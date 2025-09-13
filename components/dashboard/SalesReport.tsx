// components/reports/SalesReport.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface SalesReportProps {
  dateRange: { start: Date; end: Date };
}

interface SalesData {
  success: boolean;
  report: string;
  dateRange: { start: string; end: string };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    period: string;
  };
  data: Array<{
    date: string;
    totalRevenue: number;
    orderCount: number;
    averageOrderValue: number;
  }>;
}

export default function SalesReport({ dateRange }: SalesReportProps) {
  const [data, setData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, [dateRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });

      const response = await axios.get(`/api/reports/sales?${params}`);

      if (!response.data.success) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Error loading sales report</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.summary) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No data available for the selected date range
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      {/* Summary Cards with Minimal Design */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Revenue Card - Gradient Background */}
        <div className="bg-gradient-to-br from-[#cc4400] via-[#ff6b00] to-[#ff8533] p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-white/90">
            TOTAL REVENUE
          </div>
          <div className="text-2xl font-mono font-light text-white mt-1">
            ${data.summary?.totalRevenue?.toLocaleString() ?? "0"}
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            TOTAL ORDERS
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            {data.summary?.totalOrders?.toLocaleString() ?? "0"}
          </div>
        </div>

        {/* Avg Order Value Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            AVG. ORDER VALUE
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            $
            {data.summary.totalOrders > 0
              ? (
                  data.summary.totalRevenue / data.summary.totalOrders
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </div>
        </div>
      </div>

      {/* Data Table */}
      {/* Minimal Data Table */}
      <div className="bg-white border border-gray-200 rounded-none p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-light">Daily Sales Data</h3>
          <span className="text-sm font-light text-gray-500">
            {data.summary.period}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left text-xs font-light tracking-wider uppercase">
                  Date
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Revenue
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Orders
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Avg. Order
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((day) => (
                <tr
                  key={day.date}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-light">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    ${day.totalRevenue.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    {day.orderCount}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    $
                    {day.averageOrderValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
