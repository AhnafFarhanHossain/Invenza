import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/order.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    // Convert the string ID from the URL to an ObjectId
    const orderId = new mongoose.Types.ObjectId(id);

    // Find the order. Crucial: check that it belongs to the user!
    const order = await Order.findOne({
      _id: orderId,
      createdBy: userId,
    }).populate("items.product", "name image");

    if (!order) {
      // If no order is found, it either doesn't exist or doesn't belong to the user
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error("Single order fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    const { status } = await req.json();

    const validStatuses = ["pending", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid Status" }, { status: 400 });
    }

    const orderId = new mongoose.Types.ObjectId(id);

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        createdBy: userId,
      },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error: unknown) {
    console.error("Order update error:", error);
    return NextResponse.json(
      { message: "Failed to update order" + (error as Error).message },
      { status: 500 }
    );
  }
}
