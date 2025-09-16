import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db/db";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "@/lib/auth";
import Order from "@/models/order.model";
import getSortStageForCustomers from "@/utils/setSortStageForCustomers";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUserId = new mongoose.Types.ObjectId(userId);

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const limitParam = searchParams.get("limit") || "10";
    let limit = parseInt(limitParam, 10);
    const sortBy = searchParams.get("sortBy") || "revenue"; // Default sort by revenue
    if (isNaN(limit)) limit = 10;

    // Validate sortBy parameter
    const validSortFields = ["revenue", "orders", "recency", "name"];
    if (!validSortFields.includes(sortBy)) {
      return NextResponse.json(
        {
          message: "Invalid sort field. Use: revenue, orders, recency, or name",
        },
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

    const baseFilter = {
      createdBy: mongoUserId,
      status: "completed",
      createdAt: { $gte: adjustedStartDate, $lte: adjustedEndDate },
    };

    const customers = await Order.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            email: "$customerName",
            name: "$customerEmail",
          },
          totalSpent: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          firstOrderDate: { $min: "$createdAt" },
          lastOrderDate: { $max: "$createdAt" },
          allOrderDates: { $push: "$createdAt" },
        },
      },
      {
        $addFields: {
          customerEmail: "$_id.email",
          customerName: "$_id.name",
          averageOrderValue: {
            $cond: {
              if: { $gt: ["$totalOrders", 0] },
              then: { $divide: ["$totalSpent", "$totalOrders"] },
              else: 0,
            },
          },
        },
      },
      { $sort: getSortStageForCustomers({ sortBy }) },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          customerEmail: 1,
          customerName: 1,
          totalSpent: 1,
          totalOrders: 1,
          averageOrderValue: 1,
          firstOrderDate: 1,
          lastOrderDate: 1,
        },
      },
    ]);

    // Calculate summary statistics
    const summary = {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce(
        (sum, customer) => sum + customer.totalSpent,
        0
      ),
      totalOrders: customers.reduce(
        (sum, customer) => sum + customer.totalOrders,
        0
      ),
      averageRevenuePerCustomer:
        customers.length > 0
          ? customers.reduce((sum, customer) => sum + customer.totalSpent, 0) /
            customers.length
          : 0,
      averageOrdersPerCustomer:
        customers.length > 0
          ? customers.reduce((sum, customer) => sum + customer.totalOrders, 0) /
            customers.length
          : 0,
    };

    // Format the final response
    const response = {
      success: true,
      report: "customers",
      dateRange: {
        start: startDate,
        end: endDate,
      },
      summary,
      data: customers.map((customer) => ({
        customerEmail: customer.customerEmail,
        customerName: customer.customerName,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        averageOrderValue: Math.round(customer.averageOrderValue * 100) / 100,
        firstOrderDate: customer.firstOrderDate,
        lastOrderDate: customer.lastOrderDate,
      })),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error fetching customer report:", error);
    return NextResponse.json(
      { message: "Error fetching customer report", error: error.message },
      { status: 500 }
    );
  }
}
