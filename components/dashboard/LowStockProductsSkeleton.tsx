"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LowStockProductsSkeleton = () => (
  <Card className="bg-white shadow-none rounded-none border border-gray-200">
    <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 pt-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 bg-gray-100" />
        <Skeleton className="h-5 w-28 bg-gray-200" />
      </div>
      <Skeleton className="h-6 w-16 bg-gray-100" />
    </CardHeader>
    <CardContent className="pt-0 px-4 pb-4">
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-none bg-gray-100" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 bg-gray-200" />
                <Skeleton className="h-2 w-20 bg-gray-100" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 bg-gray-100" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
