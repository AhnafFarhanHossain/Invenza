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
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const mongoUserId = new mongoose.Types.ObjectId(userId);
    // Fetch products created by the user only
    const products = await Product.find({
      createdBy: mongoUserId,
    })
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
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
    console.log("Received body:", body); // Add logging

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const quantity = body.quantity !== undefined ? Number(body.quantity) : 0;
    const reorderLevel =
      body.reorderLevel !== undefined ? Number(body.reorderLevel) : 0;
    const costPrice = body.costPrice !== undefined ? Number(body.costPrice) : 0;
    const sellPrice = body.sellPrice !== undefined ? Number(body.sellPrice) : 0;

    // Validate that prices are not negative
    if (costPrice < 0 || sellPrice < 0) {
      return NextResponse.json(
        { message: "Prices cannot be negative" },
        { status: 400 }
      );
    }

    // Validate that quantity is not negative
    if (quantity < 0) {
      return NextResponse.json(
        { message: "Quantity cannot be negative" },
        { status: 400 }
      );
    }

    // Validate that reorder level is not negative
    if (reorderLevel < 0) {
      return NextResponse.json(
        { message: "Reorder level cannot be negative" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name: body.name,
      description: body.description || "",
      category: body.category || "",
      sku: body.sku || "",
      quantity: quantity,
      reorderLevel: reorderLevel,
      costPrice: costPrice,
      sellPrice: sellPrice,
      unit: body.unit || "pcs",
      image: body.image || "",
      createdBy: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating product:", err);

    // Handle authentication errors specifically
    if (
      err.message === "No token provided" ||
      err.message === "Token expired" ||
      err.message === "Invalid token signature" ||
      err.message === "Unauthorized"
    ) {
      return NextResponse.json(
        { message: "Authentication required", error: err.message },
        { status: 401 }
      );
    }

    if (err.name === "ValidationError") {
      return NextResponse.json({ message: err.message }, { status: 400 });
    }
    if (err.name === "MongoError" && err.code === 11000) {
      return NextResponse.json(
        { message: "Product with this SKU already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: err.message || "Error creating product" },
      { status: 500 }
    );
  }
}
