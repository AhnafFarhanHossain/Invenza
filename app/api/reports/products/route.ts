import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/order.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";
import getSortStage from "@/utils/getSortStage";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUserId = new mongoose.Types.ObjectId(userId);

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const limitParam = searchParams.get("limit") || "10";
    let limit = parseInt(limitParam, 10);
    if (isNaN(limit)) limit = 10;

    const sortBy = searchParams.get("sortBy") || "revenue"; // Default sort by revenue

    // Validate sortBy parameter
    const validSortFields = ["revenue", "quantity", "name"];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { message: "Invalid sort field. Use: revenue, quantity, or name" },
        { status: 400 }
      );
    }

    // Validate and parse dates
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate);

    if (startDate > endDate) {
      return NextResponse.json(
        { message: "Invalid date range: startDate must be before endDate" },
        { status: 400 }
      );
    }

    // Default to last 30 days if no start date provided
    if (!startDateParam) {
      startDate.setDate(endDate.getDate() - 30);
    }

    // Set time to start and end of day in UTC
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setUTCHours(0, 0, 0, 0);
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setUTCHours(23, 59, 59, 999);

    // Base filter with adjusted dates
    const baseFilter = {
      createdBy: mongoUserId,
      status: "completed",
      createdAt: { $gte: adjustedStartDate, $lte: adjustedEndDate },
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
          allPrices: { $push: "$items.price" },
        },
      },
      {
        $addFields: {
          averagePrice: {
            $divide: ["$totalRevenue", "$totalQuantitySold"],
          },
        },
      },
      {
        $sort: getSortStage({ sortBy }),
      },
      { $limit: limit },
    ]);

    const summary = {
      totalProducts: productsData.length,
      totalRevenue: productsData.reduce(
        (sum, product) => sum + product.totalRevenue,
        0
      ),
      totalItemsSold: productsData.reduce(
        (sum, product) => sum + product.totalQuantitySold,
        0
      ),
      dateRange: `${adjustedStartDate.toDateString()} - ${adjustedEndDate.toDateString()}`,
    };

    const response = {
      success: true,
      report: "products",
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary,
      data: productsData.map((product) => ({
        productId: product._id,
        name: product.productName,
        quantitySold: product.totalQuantitySold,
        revenue: product.totalRevenue,
        averagePrice: Math.round(product.averagePrice * 100) / 100, // Round to 2 decimal places
      })),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to generate product report", error: error.message },
      { status: 500 }
    );
  }
}
