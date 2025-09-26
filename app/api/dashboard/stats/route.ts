import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db/db";
import Order from "@/models/order.model";
import Product from "@/models/product.model";
import { getUserIdFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdFromRequest(req);
    const mongoUserId = new mongoose.Types.ObjectId(userId);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Fetch all stats in aggregation from Orders
    const summaryResult = await Order.aggregate([
      { $match: { createdBy: mongoUserId } },
      {
        $facet: {
          // All-time stats for completed orders only
          allTime: [
            {
              $match: { status: "completed" }
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalCompletedOrders: { $sum: 1 },
              },
            },
          ],
          // Pending Orders Count
          pendingOrders: [
            {
              $match: { status: "pending" }, // Filter for pending orders
            },
            {
              $group: {
                _id: null,
                totalPendingOrders: { $sum: 1 },
              },
            },
          ],
          // Today's stats
          today: [
            {
              $match: {
                status: "completed",
                createdAt: {
                  $gte: startOfToday,
                  $lt: endOfToday,
                },
              },
            },
            {
              $group: {
                _id: null,
                todayRevenue: { $sum: "$totalAmount" },
                todayOrders: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Fetch Customer Count
    const customerCount = await Order.distinct("customerEmail", {
      createdBy: mongoUserId,
    });

    // Alerts for low stock products
    const lowStockProducts = await Product.find({
      createdBy: userId,
      $expr: { $lt: ["$quantity", "$reorderLevel"] },
    }).select("name quantity");

    // Recent Orders(Last 5)
    const recentOrders = await Order.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("_id orderNumber customerName totalAmount status createdAt");

    const allTimeStats = summaryResult[0]?.allTime[0];
    const todayStats = summaryResult[0]?.today[0];
    const pendingOrdersStats = summaryResult[0]?.pendingOrders[0];

    // Final Response - match dashboard interface
    const dashboardData = {
      totalRevenue: allTimeStats?.totalRevenue || 0,
      totalOrders: allTimeStats?.totalCompletedOrders || 0,
      todayRevenue: todayStats?.todayRevenue || 0,
      todayOrders: todayStats?.todayOrders || 0,
      pendingOrders: pendingOrdersStats?.totalPendingOrders || 0,
      totalProducts: await Product.countDocuments({ createdBy: userId }),
      totalCustomers: customerCount.length,
      recentOrders,
      lowStockProducts: lowStockProducts.map((p) => ({
        name: p.name,
        quantity: p.quantity,
      })),
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal Server Error: " + (error as Error).message },
      { status: 500 }
    );
  }
}
