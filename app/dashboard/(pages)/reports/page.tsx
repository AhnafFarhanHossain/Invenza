// app/dashboard/reports/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesReport from "@/components/dashboard/SalesReport";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  // Adapter to convert to SalesReport expected format
  const salesReportDateRange = dateRange
    ? { start: dateRange.from, end: dateRange.to }
    : null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-2xl font-medium mb-8">Analytics Reports</h2>
        <DateRangePicker onDateChange={setDateRange} />
      </div>

      {/* Browser-like Tabs */}
      <div className="border border-gray-200 rounded-none">
        <Tabs defaultValue="sales">
          <TabsList className="bg-white p-0 flex border-b border-gray-200 rounded-none">
            <TabsTrigger
              value="sales"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0"
            >
              Sales Report
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0"
            >
              Products Report
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0"
            >
              Customers Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="p-4">
            {salesReportDateRange && (
              <SalesReport dateRange={salesReportDateRange} />
            )}
          </TabsContent>
          <TabsContent value="products" className="p-4">
            {/* <ProductsReport dateRange={dateRange} /> */}
          </TabsContent>
          <TabsContent value="customers" className="p-4">
            {/* <CustomersReport dateRange={dateRange} /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
