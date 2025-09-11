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
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-none">
            <ShoppingCart className="w-4 h-4 text-gray-700" />
          </div>
          <CardTitle className="text-black font-light uppercase tracking-wider text-xs sm:text-sm">Recent Orders</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-none text-xs font-light"
          onClick={handleViewAllOrders}
        >
          <Eye className="w-3 h-3 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {orders.length > 0 ? (
          <div className="border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="bg-white min-w-[500px]">
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-light text-black uppercase text-[10px] sm:text-[11px] tracking-wider py-1.5">
                    Order
                  </TableHead>
                  <TableHead className="font-light text-black uppercase text-[10px] sm:text-[11px] tracking-wider py-1.5">
                    Customer
                  </TableHead>
                  <TableHead className="font-light text-black uppercase text-[10px] sm:text-[11px] tracking-wider py-1.5">
                    Status
                  </TableHead>
                  <TableHead className="font-light text-black uppercase text-[10px] sm:text-[11px] tracking-wider text-right py-1.5">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.orderNumber}
                    className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() =>
                      router.push(`/dashboard/orders/${order._id}`)
                    }
                  >
                    <TableCell className="font-light text-black py-1.5">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-gray-600" />
                        <span className="text-xs sm:text-sm">{order.orderNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-black py-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-none bg-gray-100 flex items-center justify-center">
                          <span className="text-[9px] sm:text-[10px] font-light text-gray-700">
                            {order.customerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="font-light text-xs sm:text-sm truncate max-w-[100px]">{order.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5">
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-light text-black font-mono text-xs sm:text-sm py-1.5">
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
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-light text-gray-700">No recent orders</p>
            <p className="text-xs text-gray-500">Orders will appear here once created</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
