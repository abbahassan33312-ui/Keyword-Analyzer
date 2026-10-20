// src/app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET - Fetch all users
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    await connectDB();

    // Build filter object
    const filter = {};

    if (role && role !== "ALL") {
      filter.role = role;
    }

    if (status && status !== "ALL") {
      filter.accountStatus = status;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);

    // Fetch users with pagination
    const users = await User.find(filter)
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format users for the frontend
    const formattedUsers = users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      otherName: user.otherName || "",
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountStatus: user.accountStatus,
      gender: user.gender || "N/A",
      city: user.city || "N/A",
      state: user.state || "N/A",
      country: user.country || "Nigeria",
      dateOfBirth: user.dateOfBirth || null,
      createdAt: user.createdAt,
      totalTools: user.totalTools || 0,
      totalBorrowed: user.totalBorrowed || 0,
      averageRating: user.averageRating || 0,
      emailVerified: user.emailVerified || false,
      profileImage: user.profileImage || "",
    }));

    // Get statistics
    const stats = {
      total: totalUsers,
      byRole: {
        SUPER_ADMIN: await User.countDocuments({ role: "SUPER_ADMIN" }),
        ADMIN: await User.countDocuments({ role: "ADMIN" }),
        LENDER: await User.countDocuments({ role: "LENDER" }),
        BORROWER: await User.countDocuments({ role: "BORROWER" }),
      },
      byStatus: {
        ACTIVE: await User.countDocuments({ accountStatus: "ACTIVE" }),
        INACTIVE: await User.countDocuments({ accountStatus: "INACTIVE" }),
        SUSPENDED: await User.countDocuments({ accountStatus: "SUSPENDED" }),
        PENDING_APPROVAL: await User.countDocuments({
          accountStatus: "PENDING_APPROVAL",
        }),
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: formattedUsers,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
        stats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch users.",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete a user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete user.",
      },
      { status: 500 },
    );
  }
}

// PUT - Update user
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          role: body.role,
          accountStatus: body.accountStatus,
          ...(body.firstName && { firstName: body.firstName }),
          ...(body.lastName && { lastName: body.lastName }),
          ...(body.otherName !== undefined && { otherName: body.otherName }),
          ...(body.phone && { phone: body.phone }),
          ...(body.gender && { gender: body.gender }),
          ...(body.city && { city: body.city }),
          ...(body.state && { state: body.state }),
          ...(body.address && { address: body.address }),
          ...(body.country && { country: body.country }),
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully.",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update user.",
      },
      { status: 500 },
    );
  }
}
