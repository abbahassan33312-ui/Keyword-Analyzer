// src/app/api/admin/recent-activities/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LenderApplication from "@/models/LenderApplication";

export async function GET(request) {
  try {
    await connectDB();

    // Get recent user registrations (borrowers and lenders)
    const recentUsers = await User.find({
      role: { $in: ["BORROWER", "LENDER"] },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("firstName lastName email role createdAt");

    // Get recent lender applications
    const recentApplications = await LenderApplication.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "firstName lastName email");

    // Combine and format activities
    const activities = [];

    // Add user registrations
    recentUsers.forEach((user) => {
      activities.push({
        id: user._id,
        user: `${user.firstName} ${user.lastName}`,
        email: user.email,
        action: `registered as ${user.role}`,
        time: user.createdAt,
        type: "registration",
      });
    });

    // Add lender applications
    recentApplications.forEach((app) => {
      activities.push({
        id: app._id,
        user: app.userId
          ? `${app.userId.firstName} ${app.userId.lastName}`
          : "Unknown",
        email: app.userId?.email || "Unknown",
        action: `applied to become a lender`,
        time: app.createdAt,
        type: "application",
        status: app.verificationStatus,
      });
    });

    // Sort by time (newest first)
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Return top 10
    return NextResponse.json({
      success: true,
      data: activities.slice(0, 10),
    });
  } catch (error) {
    console.error("Recent activities error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recent activities" },
      { status: 500 },
    );
  }
}
