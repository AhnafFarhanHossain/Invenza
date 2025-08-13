import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Product from "@/models/Product";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

type CreateBody = {
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity?: number;
  reorderLevel?: number;
  costPrice?: number;
  sellPrice?: number;
  unit?: string;
  image?: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    console.log("User ID from token:", userId, "Type:", typeof userId); // Add logging

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID format:", userId);
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // filter the products
    const filter: any = { createdBy: new mongoose.Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }),
      Product.countDocuments(filter),
    ]);
    return NextResponse.json({ items, total });
  } catch (err) {
    console.error(err);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    console.log("User ID from token (POST):", userId, "Type:", typeof userId); // Add logging

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid user ID format (POST):", userId);
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as CreateBody;
    if (!body.name) return NextResponse.json({ message: "Name required" }, { status: 400 });

    const newProduct = await Product.create({
      ...body,
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Error creating product" }, { status: 400 });
  }
}
