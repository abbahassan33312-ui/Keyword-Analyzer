import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  try {
    await connectDB();

    // Check if Super Admin already exists
    const superAdmin = await User.findOne({
      role: "SUPER_ADMIN",
    });

    if (superAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Super Admin already exists.",
        },
        { status: 409 },
      );
    }

    // Create Super Admin
    const admin = await User.create({
      firstName: "Hashim",
      lastName: "Ahmad",
      email: "ahmadhashim027@gmail.com",
      phone: "08061621467",

      // Let the User model hash this automatically
      password: "Admin@1234",

      role: "SUPER_ADMIN",

      address: "Head Office",
      city: "Kaduna",
      state: "Kaduna",
      country: "Nigeria",

      emailVerified: true,
      accountStatus: "ACTIVE",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Super Admin created successfully.",
        data: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
