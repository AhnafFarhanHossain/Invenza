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
    <Card className="border border-gray-200 bg-orange-50 shadow-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <CardTitle className="text-gray-900 uppercase">Low Stock Alert</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
          onClick={handleViewAllProducts}
        >
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {products.length > 0 ? (
          <div className="space-y-3">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200/50 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100/50 flex items-center justify-center border border-amber-200/50">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock running low
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant="destructive"
                    className="bg-rose-100/40 text-rose-900/80 dark:bg-rose-500/15 dark:text-rose-100/90"
                  >
                    {product.quantity} left
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-lg font-medium">All stocked up!</p>
            <p className="text-sm">No low stock items to show</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
