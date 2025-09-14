"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import Spinner from "../spinner";

interface ProductReportProps {
  dateRange: { start: Date; end: Date };
}

interface ProductData {
  success: boolean;
  report: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  summary: {
    totalProducts: number;
    totalRevenue: number;
    totalItemsSold: number;
    dateRange: string;
  };
  data: Array<{
    productId: string;
    name: string;
    quantitySold: number;
    revenue: number;
    averagePrice: number;
  }>;
}

const ProductReport = ({ dateRange }: ProductReportProps) => {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductReport();
  }, [dateRange]);

  const fetchProductReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString(),
      });

      const response = await axios.get<ProductData>(
        `/api/reports/products/?${params}`
      );

      if (!response.data.success) {
        setError("Failed to fetch product report. Status: " + response.status);
      }

      setData(response.data);
    } catch (error: any) {
      setError(
        error instanceof Error
          ? error.message
          : "Error fetching product report from ProductReport"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Error loading products report</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dateRange || !dateRange.start || !dateRange.end) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Please select a date range to view the product report
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Summary Cards Skeleton */}
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border border-gray-200 rounded-none p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-6 w-16 bg-gray-200" />
              </div>
            </Card>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="border border-gray-200 rounded-none p-4">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-5 w-24 bg-gray-200" />
            <Skeleton className="h-4 w-32 bg-gray-200" />
          </div>
          
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4">
              {['Product', 'Qty Sold', 'Revenue', 'Avg. Price'].map((header) => (
                <div key={header}>
                  <Skeleton className="h-4 w-full bg-gray-200" />
                </div>
              ))}
            </div>
            
            {/* Table Rows */}
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

  if (!data || !data.summary) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No products data available for the selected date range
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        {/* Total Products Card */}
        <div className="bg-gradient-to-br from-[#cc4400] via-[#ff6b00] to-[#ff8533] p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-white/90">
            TOTAL PRODUCTS SOLD
          </div>
          <div className="text-2xl font-mono font-light text-white mt-1">
            {data.summary.totalProducts.toLocaleString()}
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            TOTAL REVENUE
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            ${data.summary.totalRevenue.toLocaleString()}
          </div>
        </div>

        {/* Total Items Card */}
        <div className="bg-white p-4 border border-gray-200 rounded-none">
          <div className="text-xs font-light tracking-wider text-gray-500">
            TOTAL ITEMS SOLD
          </div>
          <div className="text-2xl font-mono font-light mt-1">
            {data.summary.totalItemsSold.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-none p-4 hidden md:block">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-light">Product Performance</h3>
          <span className="text-sm font-light text-gray-500">
            {data.summary.dateRange}
          </span>
        </div>

        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-3 text-left text-xs font-light tracking-wider uppercase">
                  Product
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Quantity Sold
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Revenue
                </th>
                <th className="p-3 text-right text-xs font-light tracking-wider uppercase">
                  Avg. Price
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((product) => (
                <tr
                  key={product.productId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 font-light max-w-xs truncate">
                    {product.name}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    {product.quantitySold.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="p-3 text-right font-mono font-light">
                    $
                    {product.averagePrice.toLocaleString(undefined, {
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        <h3 className="text-lg font-light">Product Performance</h3>
        <div className="space-y-3">
          {data.data.map((product) => (
            <Card key={product.productId} className="border border-gray-200 rounded-none p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="font-light">Product</div>
                <div className="font-light max-w-xs truncate">{product.name}</div>
                
                <div className="font-light">Quantity Sold</div>
                <div className="font-mono font-light">{product.quantitySold.toLocaleString()}</div>
                
                <div className="font-light">Revenue</div>
                <div className="font-mono font-light">${product.revenue.toLocaleString()}</div>
                
                <div className="font-light">Avg. Price</div>
                <div className="font-mono font-light">
                  $
                  {product.averagePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
