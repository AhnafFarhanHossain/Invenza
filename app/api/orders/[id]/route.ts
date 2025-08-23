import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/Order";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    // Convert the string ID from the URL to an ObjectId
    const orderId = new mongoose.Types.ObjectId(params.id);

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
  } catch (error: any) {
    console.error("Single order fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    const body = await req.json();

    const orderId = new mongoose.Types.ObjectId(params.id);
    const order = await Order.findOne({
      _id: orderId,
      createdBy: userId,
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, body, {
      new: true,
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Single order fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
