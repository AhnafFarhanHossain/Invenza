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
    <Card className="border border-gray-200 bg-white shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded-none">
            <AlertTriangle className="w-4 h-4 text-gray-700" />
          </div>
          <CardTitle className="text-black font-light uppercase tracking-wider text-xs sm:text-sm">Low Stock Alert</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-none text-xs font-light"
          onClick={handleViewAllProducts}
        >
          <Eye className="w-3 h-3 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {products.length > 0 ? (
          <div className="space-y-1">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate max-w-[70%]">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-none bg-gray-100 flex items-center justify-center">
                    <Package className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="truncate">
                    <p className="font-light text-black text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 font-light truncate">
                      Stock running low
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 border border-gray-300 rounded-none font-light text-xs"
                  >
                    {product.quantity} left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-light text-gray-700">All stocked up!</p>
            <p className="text-xs text-gray-500">No low stock items to show</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
