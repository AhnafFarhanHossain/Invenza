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
import { Eye, FileText } from "lucide-react";
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
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden shadow-none">
      <div className="min-w-[600px] sm:min-w-0">
        <Table className="align-middle">
          <TableHeader className="bg-gray-50/60">
            <TableRow className="bg-transparent border-b border-gray-200/40">
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-[13px] font-medium text-gray-700">
                Order #
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-[13px] font-medium text-gray-700">
                Customer
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-[13px] font-medium text-gray-700">
                Date
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-[13px] font-medium text-gray-700">
                Amount
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-[13px] font-medium text-gray-700">
                Status
              </TableHead>
              <TableHead className="px-3 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-[13px] font-medium text-gray-700">
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
                  className="group hover:bg-gray-50/60 transition-colors border-b border-gray-200/30"
                >
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5 font-mono text-xs sm:text-[11px] font-semibold tracking-tight text-gray-900">
                    {displayOrderNumber}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm sm:text-base leading-tight text-gray-900">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight truncate max-w-[120px] sm:max-w-none">
                        {order.customerEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-gray-700">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5 text-right text-sm sm:text-base font-medium text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5">
                    <span
                      className={statusClassMap[order.status] || "status-badge"}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3.5 text-right">
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="text-xs sm:text-sm text-primary hover:text-primary/80"
                    >
                      <Link
                        href={`/dashboard/orders/${order._id}`}
                        className="inline-flex items-center"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">👁</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
