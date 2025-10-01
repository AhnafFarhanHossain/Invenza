import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/verification-failure?error=notoken", req.url)
      );
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verification-failure?error=invalid", req.url)
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // --- Start: Auto-login logic ---
    const secret = new TextEncoder().encode(JWT_SECRET);
    const jwt = await new SignJWT({ id: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.redirect(new URL("/dashboard", req.url));

    response.cookies.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
      path: "/",
    });

    return response;
    // --- End: Auto-login logic ---
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(
      new URL("/verification-failure?error=server", req.url)
    );
  }
}