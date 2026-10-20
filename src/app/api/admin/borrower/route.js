// src/app/api/admin/borrower/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET - Fetch all borrowers
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    await connectDB();

    // Build filter object - only BORROWER role
    const filter = { role: "BORROWER" };

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

    // Get statistics for borrowers only
    const stats = {
      total: totalUsers,
      byStatus: {
        ACTIVE: await User.countDocuments({
          role: "BORROWER",
          accountStatus: "ACTIVE",
        }),
        INACTIVE: await User.countDocuments({
          role: "BORROWER",
          accountStatus: "INACTIVE",
        }),
        SUSPENDED: await User.countDocuments({
          role: "BORROWER",
          accountStatus: "SUSPENDED",
        }),
        PENDING_APPROVAL: await User.countDocuments({
          role: "BORROWER",
          accountStatus: "PENDING_APPROVAL",
        }),
      },
      byGender: {
        MALE: await User.countDocuments({ role: "BORROWER", gender: "MALE" }),
        FEMALE: await User.countDocuments({
          role: "BORROWER",
          gender: "FEMALE",
        }),
        OTHER: await User.countDocuments({ role: "BORROWER", gender: "OTHER" }),
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
    console.error("Error fetching borrowers:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch borrowers.",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete a borrower
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

    // Check if user exists and is a borrower
    const user = await User.findOne({ _id: userId, role: "BORROWER" });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Borrower not found.",
        },
        { status: 404 },
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Borrower deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting borrower:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete borrower.",
      },
      { status: 500 },
    );
  }
}

// PUT - Update a borrower
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

    // Check if user exists and is a borrower
    const existingUser = await User.findOne({ _id: userId, role: "BORROWER" });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Borrower not found.",
        },
        { status: 404 },
      );
    }

    // Build update object - only allow specific fields to be updated
    const updateData = {
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
    };

    // Find user and update
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    return NextResponse.json(
      {
        success: true,
        message: "Borrower updated successfully.",
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating borrower:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update borrower.",
      },
      { status: 500 },
    );
  }
}
