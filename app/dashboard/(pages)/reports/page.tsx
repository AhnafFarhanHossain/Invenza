// app/dashboard/reports/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesReport from "@/components/dashboard/SalesReport";
import ProductsReport from "@/components/dashboard/ProductReport";
import CustomerReport from "@/components/dashboard/CustomerReport";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  const reportDateRange = dateRange
    ? { start: dateRange.from, end: dateRange.to }
    : null;

  return (
    <div className="space-y-4 w-full overflow-x-hidden p-2">
      <div>
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-black tracking-tight">
            Analytics and Reports
          </h1>
          <p className="text-sm lg:text-base text-dark-base">Overview of your sales, products, and customers.</p>
        </div>
        <DateRangePicker onDateChange={setDateRange} />
      </div>

      <div className="border border-gray-200 rounded-none w-full overflow-x-hidden">
        <Tabs>
          <TabsList className="bg-white p-0 flex border-b border-gray-200 rounded-none w-full overflow-x-auto">
            <TabsTrigger
              value="sales"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0 cursor-pointer hover:bg-gray-100 flex-shrink-0 text-xs sm:text-sm whitespace-nowrap"
            >
              Sales Report
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0 cursor-pointer hover:bg-gray-100 flex-shrink-0 text-xs sm:text-sm whitespace-nowrap"
            >
              Products Report
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="relative p-3 border-r border-gray-200 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-[inset_0_-2px_0_0_#ff6b00] data-[state=active]:border-b-0 transition-all duration-200 ease-in-out border-t-0 cursor-pointer hover:bg-gray-100 flex-shrink-0 text-xs sm:text-sm whitespace-nowrap"
            >
              Customers Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="p-4 md:p-6">
            {reportDateRange && <SalesReport dateRange={reportDateRange} />}
          </TabsContent>
          <TabsContent value="products" className="p-4 md:p-6">
            {reportDateRange && <ProductsReport dateRange={reportDateRange} />}
          </TabsContent>
          <TabsContent value="customers" className="p-4 md:p-6">
            {reportDateRange && <CustomerReport dateRange={reportDateRange} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
