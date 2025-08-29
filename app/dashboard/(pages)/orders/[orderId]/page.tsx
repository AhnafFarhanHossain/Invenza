"use client";

import axios, { isAxiosError } from "axios";
import { notFound, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderItemsList from "@/components/dashboard/OrderDetails";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
    _id: string;
  }>;
}

const SingleOrdersPage = () => {
  const params = useParams();
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;
  const router = useRouter();

  // If orderId is missing, navigate to 404 on client
  if (!orderId) {
    // In Client Components prefer a redirect over notFound()
    router.replace("/404");
    return null;
  }

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        if (!active) return;
        if (response.data) {
          setOrder(response.data as Order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        if (isAxiosError(err) && err.response?.status === 404) {
          router.replace("/404");
          return;
        }
        setError("Failed to load order data");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) return null;

  return <OrderDetails order={order as Order} />;
};

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const statusVariantMap = {
    pending: "outline",
    processing: "secondary",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
  } as const;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Error boundary should handle errors from use()
  // Loading state handled by Suspense

  return (
    <div className="min-h-screen">
      <div className="mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Order Details
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-slate-600">Order</span>
                <span className="font-mono text-lg font-semibold text-slate-900">
                  #{order.orderNumber}
                </span>
              </div>
            </div>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                order.status === "pending"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : order.status === "processing"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : order.status === "shipped"
                  ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                  : order.status === "delivered"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-800 border border-red-200"
                  : "bg-gray-100 text-gray-800 border border-gray-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  order.status === "pending"
                    ? "bg-amber-500"
                    : order.status === "processing"
                    ? "bg-blue-500"
                    : order.status === "shipped"
                    ? "bg-indigo-500"
                    : order.status === "delivered"
                    ? "bg-emerald-500"
                    : order.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-md  border border-gray-200/80 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Items
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}{" "}
                  in this order
                </p>
              </div>
              <div className="p-6">
                <OrderItemsList items={order.items} />
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-md  border border-gray-200/80 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Customer
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                    {order.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-orange-600">
                      {order.customerEmail}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Order Date
                  </p>
                  <p className="text-sm text-slate-700">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-md  border border-gray-200/80 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(0)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrdersPage;
