import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Users } from "lucide-react";
import Link from "next/link";

// Define the type for a customer
export interface Customer {
  customerName: string;
  customerEmail: string;
}

interface CustomersTableProps {
  customers: Customer[];
  loading?: boolean;
}

export default function CustomersTable({
  customers,
  loading,
}: CustomersTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-200/60 bg-white max-w-6xl mx-auto">
        <div className="animate-pulse">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          Loading customers...
        </h3>
        <p className="text-muted-foreground text-sm">
          Please wait while we fetch your customer data.
        </p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-200/60 bg-white max-w-6xl mx-auto">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          No customers yet
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
          Customers will appear here once they place their first order.
        </p>
        <Button
          asChild
          className="bg-primary text-white hover:bg-primary/90 transition-colors border border-primary/20"
        >
          <Link href="/dashboard/orders/new">+ Create Your First Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {customers.map((customer, index) => (
          <div
            key={`${customer.customerEmail}-${index}`}
            className="bg-white border border-gray-200/60 rounded-lg p-4 hover:bg-gray-50/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200/50 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    {customer.customerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium text-sm leading-tight text-gray-900">
                    {customer.customerName}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight truncate">
                    {customer.customerEmail}
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                size="sm"
                asChild
                className="text-sm text-primary hover:text-primary/80 flex-shrink-0"
              >
                <Link
                  href={`/dashboard/customers/${encodeURIComponent(
                    customer.customerEmail
                  )}`}
                  className="inline-flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span>View</span>
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block bg-white border border-gray-200/60 overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <Table className="align-middle bg-gray-50 min-w-[600px]">
            <TableHeader className="bg-soft-gray font-mono uppercase font-bold text-black">
              <TableRow className="bg-transparent border-b border-gray-200/40">
                <TableHead className="px-4 py-3 text-sm font-bold text-black">
                  Customer
                </TableHead>
                <TableHead className="px-4 py-3 text-sm font-bold text-black">
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-bold text-black">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow
                  key={`${customer.customerEmail}-${index}`}
                  className="group hover:bg-gray-50/60 transition-colors border-b border-gray-200/30"
                >
                  <TableCell className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm leading-tight text-gray-900">
                        {customer.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        Customer
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-sm text-gray-700">
                    {customer.customerEmail}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right">
                    <Button
                      variant="link"
                      size="sm"
                      asChild
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      <Link
                        href={`/dashboard/customers/${encodeURIComponent(
                          customer.customerEmail
                        )}`}
                        className="inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        <span>View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
