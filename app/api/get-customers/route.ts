import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/order.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req);
  try {
    await dbConnect();
    const customers = await Order.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: {
            customerName: "$customerName",
            customerEmail: "$customerEmail",
          },
        },
      },
      {
        $replaceRoot: { newRoot: "$_id" },
      },
    ]);
    if (!customers || customers.length === 0) {
      return NextResponse.json(
        { message: "No customers found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customers);
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch customers " + (error as Error).message },
      { status: 500 }
    );
  }
}
