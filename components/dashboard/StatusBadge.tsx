"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "completed" | "pending" | "cancelled";
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    completed: {
      variant: "default",
      label: "Completed",
      className:
        "bg-emerald-100/40 text-emerald-900/80 dark:bg-emerald-500/15 dark:text-emerald-100/90",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className:
        "bg-amber-100/40 text-amber-900/80 dark:bg-amber-500/15 dark:text-amber-100/90",
    },
    cancelled: {
      variant: "destructive",
      label: "Cancelled",
      className:
        "bg-rose-100/40 text-rose-900/80 dark:bg-rose-500/15 dark:text-rose-100/90",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      <div className="flex items-center gap-1">
        {status === "completed" && (
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        )}
        {status === "pending" && (
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
        )}
        {status === "cancelled" && (
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
        )}
        {config.label}
      </div>
    </Badge>
  );
};
