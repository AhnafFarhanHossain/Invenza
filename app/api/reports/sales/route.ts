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

    // Get query params
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Validate and parse dates
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam 
      ? new Date(startDateParam) 
      : new Date(endDate);
    
    // Apply default if no start date provided (30 days before endDate)
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

    // Aggregate daily sales data
    const dailySales = await Order.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          date: "$_id",
          totalRevenue: 1,
          orderCount: 1,
          averageOrderValue: { $divide: ["$totalRevenue", "$orderCount"] },
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Calculate totals
    const totalRevenue = dailySales.reduce(
      (sum, day) => sum + day.totalRevenue,
      0
    );
    const totalOrders = dailySales.reduce(
      (sum, day) => sum + day.orderCount,
      0
    );

    // Format response
    const response = {
      success: true,
      report: "sales",
      dateRange: { start: adjustedStartDate, end: adjustedEndDate },
      summary: {
        totalRevenue,
        totalOrders,
        period: `${startDate.toDateString()} to ${endDate.toDateString()}`,
      },
      data: dailySales,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Sales report error:", error);
    return NextResponse.json(
      { message: "Failed to generate sales report", error: (error as Error).message },
      { status: 500 }
    );
  }
}
