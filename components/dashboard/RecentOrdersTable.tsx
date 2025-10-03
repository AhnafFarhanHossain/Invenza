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
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow duration-200 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 flex items-center justify-center rounded">
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          <CardTitle className="text-gray-700 font-light uppercase tracking-wider text-xs sm:text-sm">Recent Orders</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-blue-50 border border-transparent hover:border-gray-200 rounded text-xs font-light transition-colors duration-200"
          onClick={handleViewAllOrders}
        >
          <Eye className="w-3 h-3 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {orders.length > 0 ? (
          <div className="border border-gray-200 overflow-hidden rounded">
            <div className="overflow-x-auto">
              <Table className="bg-white min-w-[500px]">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-medium text-gray-700 uppercase text-[10px] sm:text-[11px] tracking-wider py-2">
                      Order
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 uppercase text-[10px] sm:text-[11px] tracking-wider py-2">
                      Customer
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 uppercase text-[10px] sm:text-[11px] tracking-wider py-2">
                      Status
                    </TableHead>
                    <TableHead className="font-medium text-gray-700 uppercase text-[10px] sm:text-[11px] tracking-wider text-right py-2">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.orderNumber}
                      className="cursor-pointer bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
                      onClick={() =>
                        router.push(`/dashboard/orders/${order._id}`)
                      }
                    >
                      <TableCell className="font-medium text-gray-800 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                            <Package className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-800 font-medium">{order.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-blue-50 flex items-center justify-center">
                            <span className="text-[10px] sm:text-[11px] font-bold text-blue-600">
                              {order.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="font-medium text-xs sm:text-sm truncate max-w-[100px] text-gray-800">{order.customerName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5">
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-800 font-mono text-xs sm:text-sm py-2.5">
                        ${order.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-blue-200" />
            <p className="text-base font-medium text-gray-700">No recent orders</p>
            <p className="text-xs text-gray-500 font-medium">Orders will appear here once created</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
