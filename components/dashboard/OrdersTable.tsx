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
  const mapToStatusBadgeStatus = (status: Order["status"]): "pending" | "completed" | "cancelled" => {
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
    <div className="rounded-lg border border-gray-200/50">
      <Table className="bg-gray-50">
        <TableHeader>
          <TableRow className="border-gray-200/50 bg-soft-gray hover:bg-soft-gray font-mono">
            <TableHead className="font-bold text-dark-gray uppercase">
              Order #
            </TableHead>
            <TableHead className="font-bold text-dark-gray uppercase">
              Customer
            </TableHead>
            <TableHead className="font-bold text-dark-gray uppercase">
              Date
            </TableHead>
            <TableHead className="font-bold text-dark-gray uppercase text-right">
              Amount
            </TableHead>
            <TableHead className="font-bold text-dark-gray uppercase">
              Status
            </TableHead>
            <TableHead className="font-bold text-dark-gray uppercase text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const displayOrderNumber =
              order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`;
            return (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-gray-50/80 transition-colors border-gray-200/30"
                onClick={() => router.push(`/dashboard/orders/${order._id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    {displayOrderNumber}
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
                    <div className="flex flex-col">
                      <span className="font-medium text-sm sm:text-base leading-tight text-gray-900">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight truncate max-w-[120px] sm:max-w-none">
                        {order.customerEmail}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={mapToStatusBadgeStatus(order.status)} />
                </TableCell>
                <TableCell className="text-right">
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
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
