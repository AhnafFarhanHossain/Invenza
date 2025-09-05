"use client";

import axios, { isAxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderItemsList from "@/components/dashboard/OrderDetails";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
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

const statusOptions = [
  { value: "pending", label: "Pending", variant: "outline" as const },
  { value: "completed", label: "Completed", variant: "default" as const },
  { value: "cancelled", label: "Cancelled", variant: "destructive" as const },
];

const SingleOrdersPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.replace("/404");
      return;
    }

    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        if (!active) return;
        if (response.data) {
          setOrder(response.data as Order);
          setSelectedStatus(response.data.status);
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
  }, [orderId, router]);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === order?.status) return;
    setSelectedStatus(newStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    setIsUpdating(true);
    setShowConfirmModal(false);

    try {
      const response = await axios.patch(
        `/api/orders/${orderId}`,
        { status: selectedStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Handle the response properly - check if it's the updated order or a success message
        const responseData = response.data;

        // If the response contains the updated order data, use it
        if (responseData && typeof responseData === "object") {
          // Check if it's the full order object or just a success message
          if (responseData._id || responseData.orderNumber) {
            setOrder(responseData as Order);
          } else {
            // If it's just a success message, refetch the order to get updated data
            try {
              const refetchResponse = await axios.get(`/api/orders/${orderId}`);
              if (refetchResponse.data) {
                setOrder(refetchResponse.data as Order);
              }
            } catch (refetchError) {
              console.error("Error refetching order:", refetchError);
            }
          }
        }

        toast.success("Order status updated successfully");
      } else {
        toast.error("Error updating status");
        setSelectedStatus(order.status);
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
      setSelectedStatus(order.status); // Reset the selector on error
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelStatusUpdate = () => {
    setSelectedStatus(order?.status || "");
    setShowConfirmModal(false);
  };

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
            <div className="flex items-center gap-4">
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-40 bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-sm border-none cursor-pointer">
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-soft-gray transition"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isUpdating && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-4 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Items
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {order.items?.length || 0} item
                  {order.items?.length !== 1 ? "s" : ""} in this order
                </p>
              </div>
              <div className="p-6">
                <OrderItemsList items={order.items || []} />
              </div>
            </div>
          </div>

          {/* Right Column - Customer & Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Customer
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                    {order.customerName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.customerName || "Unknown Customer"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {order.customerEmail || "No email provided"}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Order Date
                  </p>
                  <p className="text-sm text-slate-700">
                    {order.createdAt
                      ? formatDate(order.createdAt)
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(order.totalAmount || 0)}
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
                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatCurrency(order.totalAmount || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Sheet open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <SheetContent className="bg-white shadow-xl border-l border-orange-100 w-full max-w-md px-4 py-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-slate-900">
                Confirm Status Change
              </SheetTitle>
            </SheetHeader>

            {/* Content */}
            <div className="flex-1 py-6">
              <SheetDescription className="text-slate-600 leading-relaxed">
                Are you sure you want to change the order status?
              </SheetDescription>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">
                    Current Status
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-white border-slate-200 text-slate-700 font-medium"
                  >
                    {order?.status || "Unknown"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-sm font-medium text-slate-600">
                    New Status
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 border-orange-200 text-orange-700 font-medium"
                  >
                    {selectedStatus}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> This action cannot
                  be undone and will update the order status immediately.
                </p>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="flex gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={cancelStatusUpdate}
                disabled={isUpdating}
                className="flex-1 py-2.5 border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={isUpdating}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm Change"
                )}
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SingleOrdersPage;
