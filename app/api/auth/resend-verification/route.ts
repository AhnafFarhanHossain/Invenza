import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";
import { sendEmail } from "@/lib/utils/send-email";
import { getVerificationEmailTemplate } from "@/lib/utils/email-templates";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User is already verified" },
        { status: 400 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: getVerificationEmailTemplate(user.name, verificationLink),
    });

    return NextResponse.json(
      { message: "Verification email resent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification email error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}