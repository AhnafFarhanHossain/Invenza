"use client";

import { useState, useEffect } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { LowStockProducts } from "@/components/dashboard/LowStockProducts";
import { SummaryCardSkeleton } from "@/components/dashboard/SummaryCardSkeleton";
import { RecentOrdersTableSkeleton } from "@/components/dashboard/RecentOrdersTableSkeleton";
import { LowStockProductsSkeleton } from "@/components/dashboard/LowStockProductsSkeleton";
import { ShoppingCart, Package, Users, TrendingUp, Clock } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  todayRevenue: number;
  todayOrders: number;
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <div className="grid grid-cols-2 h-24 gap-4">
          <div className="px-6 py-3 bg-white border border-soft-gray col-span-1"></div>
          <div className="px-6 py-3 bg-white border border-soft-gray col-span-1"></div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentOrdersTableSkeleton />
          </div>
          <div className="lg:col-span-1">
            <LowStockProductsSkeleton />
          </div>
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
    <div className="p-2 md:p-4 space-y-3">
      {/* Main Metrics - Responsive cards */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <SummaryCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="w-4 h-4" />}
          description="All time revenue"
          className="border border-gray-200 bg-gradient-to-br from-[#cc4400] via-[#ff6b00] to-[#ff8533] rounded-none text-white xl:col-span-1"
          iconBgColor="bg-white/20"
          iconColor="text-white"
        />
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-4 h-4" />}
          description="All time orders"
          className="border border-gray-200 bg-white rounded-none"
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <SummaryCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="w-4 h-4" />}
          description="Active products"
          className="border border-gray-200 bg-white rounded-none"
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <SummaryCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-4 h-4" />}
          description="Registered customers"
          className="border border-gray-200 bg-white rounded-none lg:col-span-1 xl:col-span-1"
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <SummaryCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Clock className="w-4 h-4" />}
          description="Pending orders"
          className="border border-gray-200 bg-white rounded-none sm:col-span-2 lg:col-span-1 xl:col-span-1"
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Today's Stats - Responsive layout */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        <div className="p-3 sm:p-4 border border-gray-200 bg-white rounded-none">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-50 flex items-center justify-center rounded-none">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-light text-gray-500 tracking-wider uppercase">
                Today's Revenue
              </p>
              <p className="text-lg sm:text-xl font-light text-black font-mono mt-0.5 sm:mt-1">
                ${stats.todayRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-4 border border-gray-200 bg-white rounded-none">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 flex items-center justify-center rounded-none">
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-light text-gray-500 tracking-wider uppercase">
                Today's Orders
              </p>
              <p className="text-lg sm:text-xl font-light text-black font-mono mt-0.5 sm:mt-1">
                {stats.todayOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders and Low Stock - Responsive layout */}
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={stats.recentOrders} />
        </div>
        <div className="lg:col-span-1">
          <LowStockProducts products={stats.lowStockProducts} />
        </div>
      </div>
    </div>
  );
}
