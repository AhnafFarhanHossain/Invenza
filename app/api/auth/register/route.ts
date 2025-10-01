import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/utils/send-email";
import { getVerificationEmailTemplate } from "@/lib/utils/email-templates";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      } else {
        // Resend verification email if user exists but is not verified
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpires = verificationTokenExpires;
        await existingUser.save();

        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;
        await sendEmail({
          to: email,
          subject: "Verify your email address",
          html: getVerificationEmailTemplate(name, verificationLink),
        });

        return NextResponse.json(
          { message: "Verification email sent" },
          { status: 200 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: getVerificationEmailTemplate(newUser.name, verificationLink),
    });

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
