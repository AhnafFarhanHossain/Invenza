"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerReportProps {
  dateRange: { start: Date; end: Date };
}

interface CustomerData {
  success: boolean;
  report: string;
  dateRange: { start: string; end: string };
  summary: {
    totalCustomers: number;
    totalRevenue: number;
    totalOrders: number;
    averageRevenuePerCustomer: number;
    averageOrdersPerCustomer: number;
  };
  data: Array<{
    customerEmail: string;
    customerName: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    firstOrderDate: string;
    lastOrderDate: string;
  }>;
}

export default function CustomerReport({ dateRange }: CustomerReportProps) {
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("revenue");

  useEffect(() => {
    fetchCustomerData();
  }, [dateRange, sortBy]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
        sortBy: sortBy,
      });

      const response = await axios.get(`/api/reports/customers?${params}`);

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
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="bg-white border border-gray-200 rounded-none p-4"
            >
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-6 w-16 bg-gray-200" />
              </div>
            </Card>
          ))}
        </div>
        <Card className="border border-gray-200 rounded-none p-4">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-4 w-32 bg-gray-200" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4">
              {["Customer", "Orders", "Total Spent", "Avg. Order Value"].map(
                (header) => (
                  <div key={header}>
                    <Skeleton className="h-4 w-full bg-gray-200" />
                  </div>
                )
              )}
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Error loading customer report</p>
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
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gradient-to-br from-[#cc4400] via-[#ff6b00] to-[#ff8533] p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-white/90">
            TOTAL CUSTOMERS
          </div>
          <div className="text-2xl font-mono font-light text-white mt-1">
            {data.summary.totalCustomers.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            TOTAL REVENUE
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            ${data.summary.totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            AVG. REVENUE/CUSTOMER
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            $
            {data.summary.averageRevenuePerCustomer.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="border border-gray-200 rounded-none p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-light">Customer Details</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white border-soft-gray cursor-pointer">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-soft-gray">
                <SelectItem value="revenue" className="cursor-pointer">
                  Revenue
                </SelectItem>
                <SelectItem value="orders" className="cursor-pointer">
                  Orders
                </SelectItem>
                <SelectItem value="recency" className="cursor-pointer">
                  Recency
                </SelectItem>
                <SelectItem value="name" className="cursor-pointer">
                  Name
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="border-b border-gray-200">
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Avg Order Value</TableHead>
                  <TableHead>Last Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((customer) => (
                  <TableRow
                    key={customer.customerEmail}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="font-medium">{customer.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="text-right">
                      ${customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      $
                      {customer.averageOrderValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        <div className="flex flex-col gap-3 mb-2">
          <h3 className="text-lg font-light">Customer Details</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full bg-white border-soft-gray cursor-pointer">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="revenue" className="cursor-pointer">
                Revenue
              </SelectItem>
              <SelectItem value="orders" className="cursor-pointer">
                Orders
              </SelectItem>
              <SelectItem value="recency" className="cursor-pointer">
                Recency
              </SelectItem>
              <SelectItem value="name" className="cursor-pointer">
                Name
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          {data.data.map((customer) => (
            <Card
              key={customer.customerEmail}
              className="border border-gray-200 rounded-none p-3 w-full overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="font-light">Customer</div>
                <div>
                  <div className="font-medium truncate">
                    {customer.customerName}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {customer.customerEmail}
                  </div>
                </div>

                <div className="font-light">Orders</div>
                <div className="font-mono font-light">
                  {customer.totalOrders}
                </div>

                <div className="font-light">Total Spent</div>
                <div className="font-mono font-light">
                  ${customer.totalSpent.toLocaleString()}
                </div>

                <div className="font-light">Avg Order Value</div>
                <div className="font-mono font-light">
                  $
                  {customer.averageOrderValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>

                <div className="font-light">Last Order</div>
                <div>
                  {new Date(customer.lastOrderDate).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
