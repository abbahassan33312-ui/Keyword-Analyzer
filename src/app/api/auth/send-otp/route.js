// src/app/api/auth/send-otp/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { createAndSendOTP } from "@/lib/otpService";

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

    const result = await createAndSendOTP(email);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 },
    );
  }
}
