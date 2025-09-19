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
  <Card className="bg-white shadow-none rounded-none border border-gray-200">
    <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 pt-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 bg-gray-100" />
        <Skeleton className="h-5 w-28 bg-gray-200" />
      </div>
      <Skeleton className="h-6 w-16 bg-gray-100" />
    </CardHeader>
    <CardContent className="pt-0 px-4 pb-4">
      <div className="border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-200">
              <TableHead className="font-light text-gray-600 text-xs py-2">
                <Skeleton className="h-3 w-12 bg-gray-100" />
              </TableHead>
              <TableHead className="font-light text-gray-600 text-xs py-2">
                <Skeleton className="h-3 w-16 bg-gray-100" />
              </TableHead>
              <TableHead className="font-light text-gray-600 text-xs py-2">
                <Skeleton className="h-3 w-12 bg-gray-100" />
              </TableHead>
              <TableHead className="font-light text-gray-600 text-xs py-2 text-right">
                <Skeleton className="h-3 w-12 ml-auto bg-gray-100" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i} className="border-gray-200">
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-3 h-3 bg-gray-100" />
                    <Skeleton className="h-3 w-20 bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full bg-gray-100" />
                    <Skeleton className="h-3 w-24 bg-gray-200" />
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <Skeleton className="h-4 w-16 bg-gray-100" />
                </TableCell>
                <TableCell className="text-right py-2">
                  <Skeleton className="h-3 w-12 ml-auto bg-gray-200" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
);
