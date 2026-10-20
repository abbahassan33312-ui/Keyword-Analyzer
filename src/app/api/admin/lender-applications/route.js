// src/app/api/admin/lender-applications/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LenderApplication from "@/models/LenderApplication";
import { sendEmail } from "@/lib/email";

// GET - Fetch all lender applications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    await connectDB();

    // Build filter object
    const filter = {};
    if (status && status !== "ALL") {
      filter.verificationStatus = status;
    }

    // Get total count for pagination
    const totalApplications = await LenderApplication.countDocuments(filter);

    // Fetch applications with pagination
    const applications = await LenderApplication.find(filter)
      .populate(
        "userId",
        "firstName lastName email phone gender city state country profileImage",
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get statistics
    const stats = {
      total: totalApplications,
      pending: await LenderApplication.countDocuments({
        verificationStatus: "PENDING",
      }),
      approved: await LenderApplication.countDocuments({
        verificationStatus: "APPROVED",
      }),
      rejected: await LenderApplication.countDocuments({
        verificationStatus: "REJECTED",
      }),
      moreInfo: await LenderApplication.countDocuments({
        verificationStatus: "MORE_INFO",
      }),
    };

    return NextResponse.json(
      {
        success: true,
        data: applications,
        pagination: {
          total: totalApplications,
          page,
          limit,
          totalPages: Math.ceil(totalApplications / limit),
        },
        stats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching lender applications:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch lender applications.",
      },
      { status: 500 },
    );
  }
}

// PUT - Update lender application status (Approve/Reject)
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("id");
    const body = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const { status, rejectionReason, adminNotes } = body;

    // Find the application
    const application = await LenderApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        { status: 404 },
      );
    }

    // Update application status
    application.verificationStatus = status;
    application.reviewedAt = new Date();

    if (status === "REJECTED" && rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    if (adminNotes) {
      application.adminNotes = adminNotes;
    }

    await application.save();

    // Update user account status based on approval
    const user = await User.findById(application.userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Associated user not found.",
        },
        { status: 404 },
      );
    }

    if (status === "APPROVED") {
      user.accountStatus = "ACTIVE";
      user.approvalStatus = "APPROVED";
      user.approvedAt = new Date();

      // Send approval email
      await sendEmail({
        to: user.email,
        subject:
          "🎉 Congratulations! Your Lender Application Has Been Approved",
        html: `
          <h2>Congratulations ${user.firstName} ${user.lastName}!</h2>
          <p>We are pleased to inform you that your lender application has been <strong>approved</strong>.</p>
          <p>You can now log in to your account and start listing your construction tools.</p>
          <br />
          <p><strong>Account Status:</strong> Active</p>
          <br />
          <p>Thank you for joining PeerTools as a Lender!</p>
          <p>The PeerTools Team</p>
        `,
      });
    } else if (status === "REJECTED") {
      user.accountStatus = "INACTIVE";
      user.approvalStatus = "REJECTED";
      user.rejectionReason = rejectionReason || "Application was not approved.";

      // Send rejection email
      await sendEmail({
        to: user.email,
        subject: "Application Status - PeerTools Lender Application",
        html: `
          <h2>Application Status Update</h2>
          <p>Dear ${user.firstName} ${user.lastName},</p>
          <p>Unfortunately, your lender application has been <strong>rejected</strong>.</p>
          <p><strong>Reason:</strong> ${rejectionReason || "Your uploaded identification could not be verified."}</p>
          <br />
          <p>Please log in and resubmit the required documents if you wish to reapply.</p>
          <br />
          <p>Thank you,</p>
          <p>The PeerTools Team</p>
        `,
      });
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `Application ${status.toLowerCase()} successfully.`,
        data: application,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating lender application:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update application.",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete a lender application and associated user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("id");

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 },
      );
    }

    await connectDB();

    // Find the application
    const application = await LenderApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
        },
        { status: 404 },
      );
    }

    // Get the user associated with this application
    const user = await User.findById(application.userId);

    // Delete the application
    await LenderApplication.findByIdAndDelete(applicationId);

    // Delete the associated user if they exist and haven't been approved
    if (user) {
      // Only delete the user if they are still pending approval
      if (
        user.approvalStatus === "PENDING" ||
        user.accountStatus === "PENDING_APPROVAL"
      ) {
        await User.findByIdAndDelete(user._id);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application and associated user deleted successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting lender application:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete application.",
      },
      { status: 500 },
    );
  }
}
