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

export default function CustomersTable({ customers, loading }: CustomersTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-200 bg-gradient-to-b from-background to-muted/30 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight mb-2">Loading customers...</h3>
        <p className="text-muted-foreground text-sm">Please wait while we fetch your customer data.</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-gray-200 bg-gradient-to-b from-background to-muted/30 max-w-6xl mx-auto">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold tracking-tight mb-2">No customers yet</h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-md">
          Customers will appear here once they place their first order.
        </p>
        <Button
          asChild
          className="bg-[var(--primary)] text-white hover:opacity-90 transition-opacity"
        >
          <Link href="/dashboard/orders/new">+ Create Your First Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="table-card max-w-6xl mx-auto">
      <Table className="align-middle">
        <TableHeader className="bg-neutral-100">
          <TableRow className="bg-transparent border-none">
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Customer
            </TableHead>
            <TableHead className="px-4 py-3 text-[13px] font-medium text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-[13px] font-medium text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer, index) => (
            <TableRow
              key={`${customer.customerEmail}-${index}`}
              className="group odd:bg-transparent even:bg-muted/10 hover:bg-muted/20 transition-colors !border-b-0"
            >
              <TableCell className="px-4 py-3.5">
                <div className="flex flex-col">
                  <span className="font-medium leading-tight text-foreground/90">
                    {customer.customerName}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    Customer
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3.5 text-foreground/80">
                {customer.customerEmail}
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right">
                <Button
                  variant="link"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/dashboard/customers/${encodeURIComponent(customer.customerEmail)}`}
                    className="inline-flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    View
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
