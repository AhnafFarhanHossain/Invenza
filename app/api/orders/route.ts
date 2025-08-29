import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Product from "@/models/product.model";
import Order from "@/models/order.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    console.log("User Id: " + userId);

    // Get Data from Request
    const body = await req.json();
    const { customerName, customerEmail, items } = body;

    // Basic Validation
    if (!customerName || !customerEmail || !items || items.length === 0) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const { productId, quantity } = item;

      // Validate and convert string to ObjectId using the recommended API
      if (!mongoose.isValidObjectId(productId)) {
        return NextResponse.json(
          { message: `Invalid product id: ${productId}` },
          { status: 400 }
        );
      }
      const productObjectId =
        mongoose.Types.ObjectId.createFromHexString(productId);

      // Check if product is available
      const product = await Product.findOne({
        _id: productObjectId,
        createdBy: new mongoose.Types.ObjectId(userId),
      });
      console.log(product);
      if (!product) {
        return NextResponse.json(
          {
            message: `Product not found: ${productId}`,
          },
          { status: 400 }
        );
      }
      // If product is not enough
      if (product.quantity < quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for ${product.name}. Only ${product.quantity} available.`,
          },
          { status: 400 }
        );
      }

      // Calculate product after order
      const itemTotal = product.sellPrice * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: productObjectId,
        name: product.name,
        quantity,
        price: product.sellPrice,
      });

      product.quantity -= quantity;
      await product.save(); // Save the updated product stock
    }

    const newOrder = new Order({
      customerName,
      customerEmail,
      items: orderItems,
      totalAmount,
      createdBy: userId,
    });

    const savedOrder = await newOrder.save();

    await savedOrder.populate("items.product", "name image");

    return NextResponse.json({ order: savedOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Order Creation Error: " + error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const orders = await Order.find({ createdBy: objectUserId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image");
    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Order Retrieval Error: " + err.message,
      },
      { status: 500 }
    );
  }
}
