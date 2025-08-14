// pages/api/auth/signin/route.ts
import { dbConnect } from "@/lib/db/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );

    // Generate JWT with jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // Create the response
    const response = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email },
      message: "Login Successful",
    });
    +(
      // Set JWT in HTTP-only cookie
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        sameSite: "strict",
        path: "/",
      })
    );

    // Log the token for debugging
    console.log("Signin: Token set in cookie:", token);
    console.log("Signin: Cookie options:", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
