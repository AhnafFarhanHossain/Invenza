"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  DollarSign,
  Package,
  Eye,
  Warehouse,
  Calendar,
  Clock,
} from "lucide-react";

// Types for our dashboard data
interface DashboardStats {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    lowStockCount: number;
  };
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

// Status badge component with enhanced styling
const StatusBadge = ({
  status,
}: {
  status: "completed" | "pending" | "cancelled";
}) => {
  const statusConfig = {
    completed: {
      variant: "default",
      label: "Completed",
      className:
        "bg-emerald-100/40 text-emerald-900/80 dark:bg-emerald-500/15 dark:text-emerald-100/90",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className:
        "bg-amber-100/40 text-amber-900/80 dark:bg-amber-500/15 dark:text-amber-100/90",
    },
    cancelled: {
      variant: "destructive",
      label: "Cancelled",
      className:
        "bg-rose-100/40 text-rose-900/80 dark:bg-rose-500/15 dark:text-rose-100/90",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      <div className="flex items-center gap-1">
        {status === "completed" && (
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        )}
        {status === "pending" && (
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        )}
        {status === "cancelled" && (
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
        )}
        {config.label}
      </div>
    </Badge>
  );
};

// Enhanced summary card component with icons and better styling
const SummaryCard = ({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) => (
  <Card className="border-2 border-gray-200 bg-white shadow-none hover:border-gray-300/70 transition-colors duration-200 rounded-none">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 rounded-none bg-gray-50 text-gray-600">{icon}</div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="text-4xl font-bold text-gray-900 font-mono">{value}</div>
      {description && (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div
              className={`flex items-center text-xs ${
                trend.positive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${trend.positive ? "" : "rotate-180"}`}
              />
              <span className="ml-1">{trend.value}</span>
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
);

// Recent orders table component with enhanced styling
const RecentOrdersTable = ({
  orders,
}: {
  orders: DashboardStats["recentOrders"];
}) => {
  const router = useRouter();

  const handleViewAllOrders = () => {
    router.push("/dashboard/orders");
  };

  return (
    <Card className="border-2 border-gray-200 bg-white shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <CardTitle className="text-gray-900">Recent Orders</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
          onClick={handleViewAllOrders}
        >
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {orders.length > 0 ? (
          <div className="rounded-lg border border-gray-200/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-200/50">
                  <TableHead className="font-medium text-gray-700">
                    Order
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Customer
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-gray-700 text-right">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.orderNumber}
                    className="cursor-pointer hover:bg-gray-50/80 transition-colors border-gray-200/30"
                    onClick={() =>
                      router.push(`/dashboard/orders/${order._id}`)
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        {order.orderNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200/50">
                          <span className="text-xs font-medium text-gray-600">
                            {order.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        {order.customerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-lg font-medium">No recent orders</p>
            <p className="text-sm">Orders will appear here once created</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Low stock products component with enhanced styling
const LowStockProducts = ({
  products,
}: {
  products: DashboardStats["lowStockProducts"];
}) => {
  const router = useRouter();

  const handleManageInventory = () => {
    router.push("/dashboard/products");
  };

  return (
    <Card className="border-2 border-gray-200 bg-white shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-gray-900">Low Stock Alert</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
          onClick={handleManageInventory}
        >
          <Warehouse className="w-4 h-4 mr-2" />
          Manage
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50 hover:bg-gray-50/60 hover:border-gray-300/60 transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/products`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/50 flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Running low
                    </div>
                  </div>
                </div>
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <span>{product.quantity}</span>
                  <span className="text-xs">left</span>
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-lg font-medium">All products well stocked</p>
            <p className="text-sm">No low stock alerts at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Loading skeleton components with enhanced styling
const SummaryCardSkeleton = () => (
  <Card className="border-2 border-gray-200 bg-white shadow-none rounded-none">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-24" />
    </CardContent>
  </Card>
);

const RecentOrdersSkeleton = () => (
  <Card className="border-2 border-gray-200 bg-white shadow-none rounded-none">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-8 w-20" />
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LowStockSkeleton = () => (
  <Card className="border-2 border-gray-200 bg-white shadow-none rounded-none">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-8 w-20" />
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DashboardStats>(
          "/api/dashboard/stats"
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-destructive">
            Error Loading Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          data && (
            <>
              <SummaryCard
                title="Total Revenue"
                value={`$${data.summary.totalRevenue.toFixed(2)}`}
                description="This month"
                icon={<DollarSign className="w-5 h-5" />}
                trend={{ value: "+12%", positive: true }}
              />
              <SummaryCard
                title="Total Orders"
                value={data.summary.totalOrders}
                description="This month"
                icon={<ShoppingCart className="w-5 h-5" />}
                trend={{ value: "+8%", positive: true }}
              />
              <SummaryCard
                title="Customers"
                value={data.summary.totalCustomers}
                description="Active this month"
                icon={<Users className="w-5 h-5" />}
                trend={{ value: "+3%", positive: true }}
              />
              <SummaryCard
                title="Low Stock Items"
                value={data.summary.lowStockCount}
                description="Need attention"
                icon={<AlertTriangle className="w-5 h-5" />}
                trend={{ value: "2", positive: false }}
              />
            </>
          )
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          {loading ? (
            <RecentOrdersSkeleton />
          ) : (
            data && <RecentOrdersTable orders={data.recentOrders} />
          )}
        </div>

        {/* Low Stock Products - single column */}
        <div>
          {loading ? (
            <LowStockSkeleton />
          ) : (
            data && <LowStockProducts products={data.lowStockProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;