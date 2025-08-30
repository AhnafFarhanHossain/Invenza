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
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border/60 bg-gradient-to-b from-background to-muted/30">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          No orders yet
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
          Orders will appear here once they are created.
        </p>
        <Button
          asChild
          className="bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
        >
          <Link href="/dashboard/orders/new">+ Create Your First Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="table-card">
      <Table className="align-middle">
        <TableHeader className="bg-neutral-100">
          <TableRow className="bg-transparent border-none">
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Order #
            </TableHead>
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Customer
            </TableHead>
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Date
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-[13px] font-medium text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-[13px] font-medium text-muted-foreground">
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
                className="group odd:bg-transparent even:bg-muted/10 hover:bg-muted/20 transition-colors !border-b-0"
              >
                <TableCell className="px-4 py-3.5 font-mono text-[11px] font-semibold tracking-tight text-foreground/80">
                  {displayOrderNumber}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-medium leading-tight text-foreground/90">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {order.customerEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-foreground/80">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right font-medium text-foreground/90">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <span
                    className={statusClassMap[order.status] || "status-badge"}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right">
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/dashboard/orders/${order._id}`}
                      className="inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                      View
                    </Link>
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
