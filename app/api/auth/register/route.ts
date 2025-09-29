import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ message: "User exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT with jose (Edge-compatible)
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ id: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // Create the response
    const response = NextResponse.json(
      {
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        message: "User created",
      },
      { status: 201 }
    );

    // Set JWT in HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: "strict",
      path: "/",
    });

    // Send webhook to n8n
    await fetch("https://n8n-6tqq.onrender.com/webhook-test/new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }),
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
