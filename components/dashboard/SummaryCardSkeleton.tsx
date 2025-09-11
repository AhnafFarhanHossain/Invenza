"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryCardSkeleton = () => (
  <Card className="bg-white shadow-none rounded-none border border-gray-200 p-3">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-6 rounded-none bg-gray-100" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-6 w-24 mb-1 bg-gray-200" />
      <Skeleton className="h-2 w-32 bg-gray-100" />
    </CardContent>
  </Card>
);
