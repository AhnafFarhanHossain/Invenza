// pages/api/auth/login.ts
import { dbConnect } from "@/lib/db/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email }, message: "Login Successful" });
  } catch (error: any) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
