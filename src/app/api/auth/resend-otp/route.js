// src/app/api/auth/resend-otp/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { resendOTP } from "@/lib/otpService";

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const result = await resendOTP(email);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resend OTP" },
      { status: 500 },
    );
  }
}
