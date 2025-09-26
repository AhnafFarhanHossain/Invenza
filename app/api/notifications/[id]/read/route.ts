import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import { getUserIdFromRequest } from "@/lib/auth";
import Notification from "@/models/notification.model";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId },
      { read: true },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    return NextResponse.json({
      message: "Notification Status Updated Successfully",
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Error updating notification: " + (error as Error).message },
      { status: 500 }
    );
  }
}
