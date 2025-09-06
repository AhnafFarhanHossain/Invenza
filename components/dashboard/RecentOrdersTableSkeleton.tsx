"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const RecentOrdersTableSkeleton = () => (
  <Card className="bg-white shadow-none rounded-none border-soft-gray">
    <CardHeader className="flex flex-row items-center justify-between pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-8 w-20" />
    </CardHeader>
    <CardContent className="pt-0">
      <div className="rounded-lg border border-gray-200/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-200/50">
              <TableHead className="font-medium text-gray-700">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="font-medium text-gray-700">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="border-gray-200/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);
