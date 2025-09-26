import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import { getUserIdFromRequest } from "@/lib/auth";
import Product from "@/models/product.model";
import { NotificationService } from "@/lib/notifications";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const userId = await getUserIdFromRequest(req);
    const product = await Product.findOne({
      _id: id,
      createdBy: userId,
    });
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    return NextResponse.json({ product });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Internal server error - " + error.message || "Unauthorized" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await req.json();
    const userId = await getUserIdFromRequest(req);
    const product = await Product.findOneAndUpdate(
      { _id: id, createdBy: userId },
      { $set: body },
      { new: true }
    );
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    if (product.quantity < product.reorderLevel && product.quantity > 0) {
      await NotificationService.lowStock(
        userId,
        product.name,
        product.quantity
      );
    }

    if (product.quantity === 0) {
      await NotificationService.outOfStock(userId, product.name);
    }
    return NextResponse.json({ product });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { message: "Internal server error - " + err.message || "Unauthorized" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const userId = await getUserIdFromRequest(req);
    const product = await Product.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (!product)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
