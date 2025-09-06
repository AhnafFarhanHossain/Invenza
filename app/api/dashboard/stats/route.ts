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

    // Fetch all stats in aggregation from Orders
    const summaryResult = await Order.aggregate([
      { $match: { createdBy: mongoUserId, status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalCompletedOrders: { $sum: 1 },
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

    // Final Response - match dashboard interface
    const dashboardData = {
      totalRevenue: summaryResult[0]?.totalRevenue || 0,
      totalOrders: summaryResult[0]?.totalCompletedOrders || 0,
      totalProducts: await Product.countDocuments({ createdBy: userId }),
      totalCustomers: customerCount.length,
      recentOrders,
      lowStockProducts: lowStockProducts.map(p => ({ name: p.name, quantity: p.quantity })),
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
