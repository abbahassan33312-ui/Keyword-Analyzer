// src/app/api/auth/admin-login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password, remember } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    // Connect to database
    await connectDB();

    // Find user with SUPER_ADMIN role - explicitly select password field
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: "SUPER_ADMIN",
    }).select("+password"); // This is key - selects the password field

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials. Admin account not found.",
        },
        { status: 401 },
      );
    }

    // Check if account is active
    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          message: "Account is not active. Please contact support.",
        },
        { status: 401 },
      );
    }

    // Verify password using the model's comparePassword method
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials. Please try again.",
        },
        { status: 401 },
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET || "your-secret-key-change-in-production",
      {
        expiresIn: remember ? "7d" : "24h",
      },
    );

    // Create response without password (handled by toJSON method)
    const userData = user.toJSON();

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: userData,
      },
      { status: 200 },
    );

    // Set cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: remember ? 604800 : 86400, // 7 days or 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
