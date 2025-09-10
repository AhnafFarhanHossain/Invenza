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
    <div className="p-6 space-y-6">
      {/* Main Metrics - 4 cards in horizontal row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<TrendingUp className="w-5 h-5" />}
          description="All time revenue"
          className="bg-gradient-to-tr from-black via-orange-900 to-amber-700 border-2 border-soft-gray text-white rounded-sm"
          iconBgColor="bg-white/10"
          iconColor="text-white"
        />
        <SummaryCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="w-5 h-5" />}
          description="All time orders"
          className="border-2 border-soft-gray bg-white rounded-sm"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-700"
        />
        <SummaryCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package className="w-5 h-5" />}
          description="Active products"
          className="border-2 border-soft-gray bg-white rounded-sm"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-700"
        />
        <SummaryCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={<Users className="w-5 h-5" />}
          description="Registered customers"
          className="border-2 border-soft-gray bg-white rounded-sm"
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-700"
        />
        <SummaryCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<Clock className="w-5 h-5" />}
          description="Pending orders"
          className="border-2 border-soft-gray bg-white rounded-sm"
          iconBgColor="bg-red-100"
          iconColor="text-red-700"
        />
      </div>

      {/* Today's Stats - Sharp Minimal Design with Invenza Colors */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-5 border-2 border-[var(--soft-gray)] bg-white rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--primary)] flex items-center justify-center rounded-none">
              <TrendingUp className="w-5 h-5 text-[var(--light-base)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted-orange)] tracking-wider uppercase">
                Today's Revenue
              </p>
              <p className="text-2xl font-medium text-[var(--black)] font-mono mt-2">
                ${stats.todayRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 border-2 border-[var(--soft-gray)] bg-white rounded-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--primary)] flex items-center justify-center rounded-none">
              <ShoppingCart className="w-5 h-5 text-[var(--light-base)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--muted-orange)] tracking-wider uppercase">
                Today's Orders
              </p>
              <p className="text-2xl font-medium text-[var(--black)] font-mono mt-2">
                {stats.todayOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
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
