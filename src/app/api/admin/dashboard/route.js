// src/app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LenderApplication from "@/models/LenderApplication";

export async function GET(request) {
  try {
    await connectDB();

    // Get total users by role
    const totalUsers = await User.countDocuments();
    const borrowers = await User.countDocuments({ role: "BORROWER" });
    const lenders = await User.countDocuments({ role: "LENDER" });
    const admins = await User.countDocuments({
      role: { $in: ["ADMIN", "SUPER_ADMIN"] },
    });

    // Get pending lender applications
    const pendingApplications = await LenderApplication.countDocuments({
      verificationStatus: "PENDING",
    });

    // Get active users
    const activeUsers = await User.countDocuments({ accountStatus: "ACTIVE" });

    // Get users joined this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Get last month's users for growth calculation
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfMonth },
    });

    const userGrowth =
      usersLastMonth > 0
        ? (
            ((newUsersThisMonth - usersLastMonth) / usersLastMonth) *
            100
          ).toFixed(1)
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        borrowers,
        lenders,
        admins,
        activeUsers,
        pendingApplications,
        newUsersThisMonth,
        userGrowth: parseFloat(userGrowth),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard statistics" },
      { status: 500 },
    );
  }
}
