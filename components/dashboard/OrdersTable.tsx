// components/orders/OrdersTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useRouter } from "next/navigation";
import { Eye, FileText, Package } from "lucide-react";
import Link from "next/link";

// Define the type for an order
export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "cancelled"
    | "shipped"
    | "delivered";
  createdAt: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      image?: string;
    };
    quantity: number;
    price: number;
    _id: string;
  }>;
}

interface OrdersTableProps {
  orders: Order[];
}

// Map status to custom class names for a subtle, brand-tinted pill
const statusClassMap: Record<string, string> = {
  pending: "status-badge status-badge-pending",
  processing: "status-badge status-badge-processing",
  completed: "status-badge status-badge-completed",
  cancelled: "status-badge status-badge-cancelled",
  shipped: "status-badge status-badge-shipped",
  delivered: "status-badge status-badge-completed",
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Map order status to StatusBadge compatible status
  const mapToStatusBadgeStatus = (
    status: Order["status"]
  ): "pending" | "completed" | "cancelled" => {
    switch (status) {
      case "processing":
      case "shipped":
        return "pending";
      case "delivered":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return status;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-200/60 bg-white">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          No orders yet
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
          Orders will appear here once they are created.
        </p>
        <Button
          asChild
          className="bg-primary text-white hover:bg-primary/90 transition-colors border border-primary/20"
        >
          <Link href="/dashboard/orders/new">+ Create Your First Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {orders.map((order) => {
          const displayOrderNumber =
            order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`;
          return (
            <div
              key={order._id}
              className="bg-white border border-gray-200/60 rounded-lg p-5 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => router.push(`/dashboard/orders/${order._id}`)}
            >
              {/* Header Section - Order Number & Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">
                      Order Number
                    </p>
                    <p className="font-semibold text-gray-900">
                      {displayOrderNumber}
                    </p>
                  </div>
                </div>
                <StatusBadge status={mapToStatusBadgeStatus(order.status)} />
              </div>

              {/* Customer Section */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">
                  Customer
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200/50">
                    <span className="text-gray-600 font-medium text-sm">
                      {order.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 leading-tight">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {order.customerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details Section */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Total Amount
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Order Date
                    </p>
                    <p className="font-medium text-gray-700">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex justify-center border-t border-gray-100 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/orders/${order._id}`);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block rounded-lg overflow-auto">
        <div className="overflow-x-auto">
          <Table className="bg-gray-50 min-w-[800px]">
            <TableHeader>
              <TableRow className="border-gray-200/50 bg-soft-gray hover:bg-soft-gray font-mono">
                <TableHead className="font-bold text-dark-gray uppercase py-2">
                  Order #
                </TableHead>
                <TableHead className="font-bold text-dark-gray uppercase py-2">
                  Customer
                </TableHead>
                <TableHead className="font-bold text-dark-gray uppercase py-2">
                  Date
                </TableHead>
                <TableHead className="font-bold text-dark-gray uppercase text-right py-2">
                  Amount
                </TableHead>
                <TableHead className="font-bold text-dark-gray uppercase py-2">
                  Status
                </TableHead>
                <TableHead className="font-bold text-dark-gray uppercase text-right py-2">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const displayOrderNumber =
                  order.orderNumber ||
                  `ORD-${order._id.slice(-6).toUpperCase()}`;
                return (
                  <TableRow
                    key={order._id}
                    className="cursor-pointer hover:bg-gray-50/80 transition-colors border-gray-200/30"
                    onClick={() =>
                      router.push(`/dashboard/orders/${order._id}`)
                    }
                  >
                    <TableCell className="font-medium py-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm lg:text-base">
                          {displayOrderNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200/50">
                          <span className="text-xs font-medium text-gray-600">
                            {order.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm lg:text-base leading-tight text-gray-900">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground leading-tight truncate max-w-[150px] lg:max-w-[200px]">
                            {order.customerEmail}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 py-2">
                      <span className="text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium py-2">
                      <span className="text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      <StatusBadge
                        status={mapToStatusBadgeStatus(order.status)}
                      />
                    </TableCell>
                    <TableCell className="text-right py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/orders/${order._id}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="text-sm">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
