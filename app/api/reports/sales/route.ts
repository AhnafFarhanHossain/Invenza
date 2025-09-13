import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/order.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoUserId = new mongoose.Types.ObjectId(userId);

    // Search Params
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Set up date range
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date();

    // Only apply default if no start date is provided
    if (!startDateParam) {
      startDate.setDate(endDate.getDate() - 30);
    }

    // Set time to start and end of day in UTC to avoid timezone issues
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    // Base filter
    const baseFilter = {
      createdBy: mongoUserId,
      status: "completed",
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const productsData = await Order.aggregate([
      {
        $match: baseFilter,
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          totalQuantitySold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          averagePrice: { $avg: "$items.price" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Format Response
    const response = {
      success: true,
      report: "products",
      dateRange: { start: startDate, end: endDate },
      summary: {
        totalProducts: productsData.length,
        totalRevenue: productsData.reduce(
          (sum, product) => sum + product.totalRevenue,
          0
        ),
        totalItemsSold: productsData.reduce(
          (sum, product) => sum + product.totalQuantitySold,
          0
        ),
        period: `${startDate.toDateString()} to ${endDate.toDateString()}`,
      },
      data: productsData.map((product) => ({
        productId: product._id,
        name: product.productName,
        quantitySold: product.totalQuantitySold,
        totalRevenue: product.totalRevenue,
        averagePrice: Math.round(product.averagePrice * 100) / 100,
      })),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Products report error:", error);
    return NextResponse.json(
      { message: "Failed to generate products report", error: error.message },
      { status: 500 }
    );
  }
}
