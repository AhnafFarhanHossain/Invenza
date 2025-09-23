import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userPreferences = await User.findById(userId).select("preferences");
    if (!userPreferences) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userPreferences);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          "Internal Server Error - Fetching User Preferences: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    const mongoUserId = new mongoose.Types.ObjectId(userId);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { preferences } = body;

    const updatedUserPreferences = await User.findByIdAndUpdate(
      
      mongoUserId,
      { preferences },
      { new: true, runValidators: true }
    ).select("preferences");

    return NextResponse.json(updatedUserPreferences);
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          "Internal Server Error - Updating User Preferences: " + error.message,
      },
      { status: 500 }
    );
  }
}
