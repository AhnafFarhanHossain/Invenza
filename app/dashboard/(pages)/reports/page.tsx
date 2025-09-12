"use client";

import { SimpleDateRangePicker } from "@/components/dashboard/DateRangePicker";
import React from "react";

const Reports = () => {
  const [dateRange, setDateRange] = React.useState<{
    from: Date;
    to: Date;
  } | null>(null);

  const handleDateRangeChange = (range: { from: Date; to: Date } | null) => {
    setDateRange(range);

    if (range) {
      // Fetch orders with the selected date range
      fetchOrders(range.from, range.to);
    } else {
      // Fetch all orders (no date filter)
      fetchAllOrders();
    }
  };

  const fetchOrders = async (fromDate: Date, toDate: Date) => {
    try {
      console.log("Fetching orders from:", fromDate, "to:", toDate);

      // Format dates for API call
      const params = new URLSearchParams({
        startDate: fromDate.toISOString(),
        endDate: toDate.toISOString(),
      });

      const response = await fetch(`/api/orders?${params}`);
      const orders = await response.json();
      console.log("Fetched orders:", orders);
      // Set your orders state here
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchAllOrders = async () => {
    try {
      console.log("Fetching all orders");
      const response = await fetch("/api/orders");
      const orders = await response.json();
      console.log("Fetched all orders:", orders);
      // Set your orders state here
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-medium mb-8">Reports</h1>

      <SimpleDateRangePicker onDateChange={handleDateRangeChange} />

      {/* Display the current date range */}
      {dateRange && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing reports of data from {dateRange.from.toLocaleDateString()} to{" "}
            {dateRange.to.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Your orders table will go here */}
      <div>{/* Orders will be displayed here */}</div>
    </div>
  );
};

export default Reports;
