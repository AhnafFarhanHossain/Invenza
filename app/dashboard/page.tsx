"use client";

import { useState, useEffect } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { LowStockProducts } from "@/components/dashboard/LowStockProducts";
import { SummaryCardSkeleton } from "@/components/dashboard/SummaryCardSkeleton";
import { RecentOrdersTableSkeleton } from "@/components/dashboard/RecentOrdersTableSkeleton";
import { LowStockProductsSkeleton } from "@/components/dashboard/LowStockProductsSkeleton";
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: "completed" | "pending" | "cancelled";
    createdAt?: string;
  }>;
  lowStockProducts: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <div className="grid gap-6 md:grid-cols-[65%_35%]">
          <RecentOrdersTableSkeleton />
          <LowStockProductsSkeleton />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          description="All time revenue"
          className="bg-gradient-to-tr from-black via-orange-800 to-amber-600 border-2 border-gray-200 text-white"
          titleColor="text-white"
        />
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-5 h-5 text-gray-700" />}
          description="All time orders"
          className="bg-gray-50 border-2 border-gray-200"
          titleColor="text-gray-700"
        />
        <SummaryCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="w-5 h-5 text-gray-700" />}
          description="Active products"
          className="bg-gray-50 border-2 border-gray-200"
          titleColor="text-gray-700"
        />
        <SummaryCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-5 h-5 text-gray-700" />}
          description="Registered customers"
          className="bg-gray-50 border-2 border-gray-200"
          titleColor="text-gray-700"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-[65%_35%]">
        <RecentOrdersTable orders={stats.recentOrders} />
        <LowStockProducts products={stats.lowStockProducts} />
      </div>
    </div>
  );
}
