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
        "bg-gray-100 text-gray-700 border border-gray-300 rounded-none font-light text-xs",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className:
        "bg-gray-100 text-gray-700 border border-gray-300 rounded-none font-light text-xs",
    },
    cancelled: {
      variant: "destructive",
      label: "Cancelled",
      className:
        "bg-gray-100 text-gray-700 border border-gray-300 rounded-none font-light text-xs",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={config.className}>
      <div className="flex items-center gap-1">
        {status === "completed" && (
          <div className="w-1.5 h-1.5 rounded-none bg-gray-600"></div>
        )}
        {status === "pending" && (
          <div className="w-1.5 h-1.5 rounded-none bg-gray-400"></div>
        )}
        {status === "cancelled" && (
          <div className="w-1.5 h-1.5 rounded-none bg-gray-800"></div>
        )}
        {config.label}
      </div>
    </Badge>
  );
};
