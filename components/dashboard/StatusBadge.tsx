"use client";

import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "completed" | "pending" | "cancelled";
  priority?: "low" | "medium" | "high";
}

export const StatusBadge = ({ status, priority = "low" }: StatusBadgeProps) => {
  const statusConfig = {
    completed: {
      variant: "default",
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-none font-light text-xs",
      dotColor: "bg-emerald-600",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border border-amber-200 rounded-none font-light text-xs",
      dotColor: "bg-amber-500",
    },
    cancelled: {
      variant: "destructive",
      label: "Cancelled",
      className: "bg-red-50 text-red-700 border border-red-200 rounded-none font-light text-xs",
      dotColor: "bg-red-600",
    },
  };

  const priorityConfig = {
    low: "",
    medium: "ring-1 ring-offset-1 ring-amber-300",
    high: "ring-2 ring-offset-1 ring-red-400",
  };

  const config = statusConfig[status];
  const priorityClass = priorityConfig[priority];

  return (
    <Badge variant="secondary" className={`${config.className} ${priorityClass} shadow-none hover:shadow-sm transition-shadow duration-200`}>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></div>
        <span className="font-medium text-xs">{config.label}</span>
        {priority === "high" && status === "pending" && (
          <span className="ml-1 text-xs font-bold">!</span>
        )}
      </div>
    </Badge>
  );
};
