"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { AlertTriangle, Package, Eye } from "lucide-react";

interface LowStockProduct {
  name: string;
  quantity: number;
}

interface LowStockProductsProps {
  products: LowStockProduct[];
}

export const LowStockProducts = ({ products }: LowStockProductsProps) => {
  const router = useRouter();

  const handleViewAllProducts = () => {
    router.push("/dashboard/products");
  };

  return (
    <Card className="border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow duration-200 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-50 flex items-center justify-center rounded">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <CardTitle className="text-gray-700 font-light uppercase tracking-wider text-xs sm:text-sm">Low Stock Alert</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-amber-50 border border-transparent hover:border-gray-200 rounded text-xs font-light transition-colors duration-200"
          onClick={handleViewAllProducts}
        >
          <Eye className="w-3 h-3 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {products.length > 0 ? (
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 truncate max-w-[70%]">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-amber-50 flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-xs text-amber-600 font-medium truncate">
                      Stock running low
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 text-amber-700 border border-amber-100 rounded font-medium text-xs"
                  >
                    {product.quantity} left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-200" />
            <p className="text-base font-medium text-gray-700">All stocked up!</p>
            <p className="text-xs text-gray-500 font-medium">No low stock items to show</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
