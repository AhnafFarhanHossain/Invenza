"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, Eye } from "lucide-react";

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: "completed" | "pending" | "cancelled";
  createdAt?: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
  const router = useRouter();

  const handleViewAllOrders = () => {
    router.push("/dashboard/orders");
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <CardTitle className="text-gray-900 uppercase">Recent Orders</CardTitle>
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
            <Table className="bg-gray-50">
              <TableHeader>
                <TableRow className="border-gray-200/50 bg-soft-gray hover:bg-soft-gray font-mono">
                  <TableHead className="font-bold text-dark-gray uppercase">
                    Order
                  </TableHead>
                  <TableHead className="font-bold text-dark-gray uppercase">
                    Customer
                  </TableHead>
                  <TableHead className="font-bold text-dark-gray uppercase">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-dark-gray uppercase text-right">
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
