// src/app/api/auth/verify-otp/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyOTP } from "@/lib/otpService";

export async function POST(request) {
  try {
    await connectDB();
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const result = await verifyOTP(email, otp);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 },
    );
  }
}
