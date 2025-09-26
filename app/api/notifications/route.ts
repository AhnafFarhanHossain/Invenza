import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Notification from "@/models/notification.model";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = Number(searchParams.get("limit")) || 20;

    const notifications = await Notification.find({
      userId,
      ...(unreadOnly && { read: false }),
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ notifications });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Error fetching Notifications from API: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await Notification.deleteMany({ userId });

    return NextResponse.json({ message: "All notifications cleared" });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Error clearing notifications: " + (error as Error).message },
      { status: 500 }
    );
  }
}
