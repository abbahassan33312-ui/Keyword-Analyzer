// src/app/api/admin/wallet/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import WalletTransaction from "@/models/WalletTransaction";
import { getPlatformWallet } from "@/lib/platformWallet";
import "@/models/BorrowRequest";

export async function GET(request) {
  try {
    // ----------------------------------------
    // 1. Get admin authentication token
    // ----------------------------------------
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    // ----------------------------------------
    // 2. Verify JWT
    // ----------------------------------------
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
    );

    // ----------------------------------------
    // 3. Connect database
    // ----------------------------------------
    await connectDB();

    // ----------------------------------------
    // 4. Verify admin user
    // ----------------------------------------
    const user = await User.findById(decoded.id).select(
      "firstName lastName email role accountStatus",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account not found.",
        },
        { status: 401 },
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account is not active.",
        },
        { status: 403 },
      );
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Super Admin access required.",
        },
        { status: 403 },
      );
    }

    // ----------------------------------------
    // 5. Get / create platform wallet
    // ----------------------------------------
    const wallet = await getPlatformWallet();

    // ----------------------------------------
    // 6. Get platform transactions
    // ----------------------------------------
    const transactions = await WalletTransaction.find({
      walletId: wallet._id,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "firstName lastName email")
      .populate("borrowRequestId", "startDate endDate totalAmount status")
      .lean();

    // ----------------------------------------
    // 7. Platform fee revenue
    // ----------------------------------------
    const platformFees = await WalletTransaction.aggregate([
      {
        $match: {
          walletId: wallet._id,
          category: "PLATFORM_FEE",
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // ----------------------------------------
    // 8. Withdrawals
    // ----------------------------------------
    const withdrawals = await WalletTransaction.aggregate([
      {
        $match: {
          walletId: wallet._id,
          type: "WITHDRAWAL",
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // ----------------------------------------
    // 9. Refunds
    // ----------------------------------------
    const refunds = await WalletTransaction.aggregate([
      {
        $match: {
          walletId: wallet._id,
          category: "REFUND",
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const platformFeeTotal = platformFees[0]?.total || 0;
    const withdrawalTotal = withdrawals[0]?.total || 0;
    const refundTotal = refunds[0]?.total || 0;

    // ----------------------------------------
    // 10. Revenue statistics
    // ----------------------------------------
    const revenue = {
      platformFees: platformFeeTotal,
      withdrawals: withdrawalTotal,
      refunds: refundTotal,

      netRevenue: platformFeeTotal - withdrawalTotal - refundTotal,
    };

    // ----------------------------------------
    // 11. Return response
    // ----------------------------------------
    return NextResponse.json({
      success: true,

      data: {
        wallet,
        transactions,
        revenue,
      },
    });
  } catch (error) {
    console.error("Platform wallet error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication token.",
        },
        { status: 401 },
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication token has expired.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load platform wallet",
      },
      { status: 500 },
    );
  }
}
