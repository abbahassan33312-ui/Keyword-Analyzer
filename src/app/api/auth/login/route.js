// src/app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();

    // ======================================================
    // VALIDATION
    // ======================================================

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // ======================================================
    // FIND USER
    // ======================================================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // ======================================================
    // BLOCK ADMIN LOGIN FROM NORMAL LOGIN
    // ======================================================

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Administrators must use the Admin Login portal.",
        },
        { status: 403 },
      );
    }

    // ======================================================
    // CHECK PASSWORD
    // ======================================================

    const passwordCorrect = await user.comparePassword(password);

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    // ======================================================
    // LENDER LOGIN RULES
    // ======================================================

    if (user.role === "LENDER") {
      // Email verification
      if (!user.emailVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Please verify your email before logging in.",
            requiresVerification: true,
            email: user.email,
          },
          { status: 403 },
        );
      }

      // Approval status
      if (user.approvalStatus === "PENDING") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Your lender application is still under review. Please wait until an administrator approves your account. Always check your email for updates regarding your application status. Thank you for your patience.",
          },
          { status: 403 },
        );
      }

      if (user.approvalStatus === "REJECTED") {
        return NextResponse.json(
          {
            success: false,
            message:
              "Your lender application has been rejected. Please contact support.",
          },
          { status: 403 },
        );
      }

      if (user.approvalStatus !== "APPROVED") {
        return NextResponse.json(
          {
            success: false,
            message: "Your lender account has not yet been approved.",
          },
          { status: 403 },
        );
      }

      // Account status
      if (user.accountStatus !== "ACTIVE") {
        return NextResponse.json(
          {
            success: false,
            message: "Your lender account is not active.",
          },
          { status: 403 },
        );
      }
    }

    // ======================================================
    // BORROWER LOGIN RULES
    // ======================================================

    if (user.role === "BORROWER") {
      // Email verification
      if (!user.emailVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "Please verify your email before logging in.",
            requiresVerification: true,
            email: user.email,
          },
          { status: 403 },
        );
      }

      // Account status
      if (user.accountStatus !== "ACTIVE") {
        return NextResponse.json(
          {
            success: false,
            message: "Your account is not active.",
          },
          { status: 403 },
        );
      }
    }

    // ======================================================
    // ALLOWED ROLES ONLY
    // ======================================================

    if (!["BORROWER", "LENDER"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This login portal is only available to borrowers and lenders.",
        },
        { status: 403 },
      );
    }

    // ======================================================
    // ACCOUNT STATUS
    // ======================================================

    if (user.accountStatus === "SUSPENDED") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been suspended. Please contact support.",
        },
        { status: 403 },
      );
    }

    if (user.accountStatus === "INACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is inactive. Please contact support.",
        },
        { status: 403 },
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is not active. Please contact support.",
        },
        { status: 403 },
      );
    }

    // ======================================================
    // UPDATE LAST LOGIN
    // ======================================================

    user.lastLogin = new Date();

    await user.save({
      validateBeforeSave: false,
    });

    // ======================================================
    // GENERATE JWT
    // ======================================================

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: remember ? "7d" : "24h",
      },
    );

    // ======================================================
    // USER REDIRECT
    // ======================================================

    let redirect = "/";

    if (user.role === "LENDER") {
      redirect = "/lender-dashboard";
    } else if (user.role === "BORROWER") {
      redirect = "/borrower-dashboard";
    }

    // ======================================================
    // USER DATA
    // ======================================================

    const userData = {
      ...user.toJSON(),
      redirect,
    };

    // ======================================================
    // RESPONSE
    // ======================================================

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: userData,
      },
      {
        status: 200,
      },
    );

    // ======================================================
    // USER AUTH COOKIE
    // ======================================================

    response.cookies.set("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: remember ? 604800 : 86400,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: 500,
      },
    );
  }
}
