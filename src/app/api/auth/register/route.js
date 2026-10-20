// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LenderApplication from "@/models/LenderApplication";
import { sendEmail } from "@/lib/email";
import { createAndSendOTP } from "@/lib/otpService";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form data - REMOVED toolCategories, toolOwnershipCount, bankName, accountNumber, accountName
    const {
      firstName,
      lastName,
      otherName,
      email,
      phone,
      password,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      country,
      accountType,
      role,
      businessName,
      businessType,
      cacRegistrationNumber,
      tin,
      nationalIdNumber,
      bvn,
      meansOfIdentification,
      availabilityAddress,
      availabilityCity,
      availabilityState,
      availabilityGps,
    } = Object.fromEntries(formData);

    // Connect to database
    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists.",
        },
        { status: 409 },
      );
    }

    // Create user data
    let userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
      city,
      state,
      country,
      role: role || "BORROWER",
      accountType: accountType || "BORROWER",
      emailVerified: false, // Start as false
    };

    // Add otherName if provided
    if (otherName) {
      userData.otherName = otherName;
    }

    if (accountType === "LENDER") {
      userData.accountStatus = "PENDING_APPROVAL";
      userData.approvalStatus = "PENDING";
    } else {
      userData.accountStatus = "ACTIVE";
      userData.approvalStatus = "NONE";
    }

    // Create user
    const user = await User.create(userData);

    // Send OTP for email verification
    await createAndSendOTP(email);

    // If Lender, create lender application
    if (accountType === "LENDER") {
      const uploadedIdImage = formData.get("uploadedIdImage");
      const selfieImage = formData.get("selfieImage");

      await LenderApplication.create({
        userId: user._id,
        businessName: businessType === "COMPANY" ? businessName : undefined,
        businessType: businessType || "INDIVIDUAL",
        cacRegistrationNumber:
          businessType === "COMPANY" ? cacRegistrationNumber : undefined,
        tin: tin || undefined,
        nationalIdNumber,
        bvn: bvn || undefined,
        meansOfIdentification,
        uploadedIdImage: uploadedIdImage || "",
        selfieImage: selfieImage || "",
        availabilityAddress: {
          address: availabilityAddress,
          city: availabilityCity,
          state: availabilityState,
          gps: availabilityGps || "",
        },
        verificationStatus: "PENDING",
      });

      // Send lender registration email
      await sendEmail({
        to: email,
        subject: "Registration Received - PeerTools Lender Application",
        html: `
          <h2>Thank you for registering as a Lender on PeerTools!</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Your application has been received successfully.</p>
          <p><strong>Important:</strong> Please check your email for the OTP to verify your email address.</p>
          <p>Our administrators will review your information.</p>
          <p>You will receive another email once your application has been approved or rejected.</p>
          <br />
          <p><strong>Status:</strong> Pending Review</p>
          <br />
          <p>Thank you,</p>
          <p>The PeerTools Team</p>
        `,
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Lender application submitted successfully. Please verify your email with the OTP sent.",
          data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            accountStatus: user.accountStatus,
            emailVerified: user.emailVerified,
          },
        },
        { status: 201 },
      );
    } else {
      // Borrower - send welcome email
      await sendEmail({
        to: email,
        subject: "Welcome to PeerTools!",
        html: `
          <h2>Welcome to PeerTools!</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Your account has been created successfully.</p>
          <p><strong>Important:</strong> Please check your email for the OTP to verify your email address.</p>
          <p>You can now log in and start borrowing tools from our community.</p>
          <br />
          <p>Thank you,</p>
          <p>The PeerTools Team</p>
        `,
      });

      return NextResponse.json(
        {
          success: true,
          message:
            "Account created successfully. Please verify your email with the OTP sent.",
          data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred during registration.",
      },
      { status: 500 },
    );
  }
}
