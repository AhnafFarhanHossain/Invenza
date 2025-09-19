"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrdersTable, { Order } from "@/components/dashboard/OrdersTable";
import { useEffect, useState } from "react";

// This is a Client Component that fetches data
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-light text-black tracking-wide mb-4">
          Orders
        </h1>
        <div className="border border-gray-200 bg-white p-4 rounded-none">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 w-full">
      <h1 className="text-2xl font-light text-black tracking-wide mb-4">
        Orders
      </h1>
      <div className="bg-white rounded-none">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
