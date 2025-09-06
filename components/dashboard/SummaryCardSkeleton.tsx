"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryCardSkeleton = () => (
  <Card className="bg-white shadow-none rounded-none border-soft-gray">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-none" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-3 w-40" />
    </CardContent>
  </Card>
);
