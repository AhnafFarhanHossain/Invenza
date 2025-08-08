import { dbConnect } from "@/lib/db/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password } = await req.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) return NextResponse.json({ message: "User exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return NextResponse.json({ message: "User created" }, { status: 201 });
}
