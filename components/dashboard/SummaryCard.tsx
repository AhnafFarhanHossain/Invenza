"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  titleColor?: string;
}

export const SummaryCard = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  titleColor,
}: SummaryCardProps) => {
  const isDarkGradient =
    className?.includes("900") || className?.includes("bg-gradient");
  const hasWhiteBackground = className?.includes("bg-white");

  return (
    <Card className={`bg-white shadow-none rounded-none ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle
          className={`text-sm font-medium ${
            titleColor || "text-muted-foreground"
          }`}
        >
          {title}
        </CardTitle>
        <div
          className={`p-2 rounded-none ${
            hasWhiteBackground
              ? "bg-gray-100 text-gray-700"
              : isDarkGradient
              ? "bg-white/10 text-white"
              : "bg-gray-50 text-gray-600"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={`text-4xl font-bold font-mono ${
            hasWhiteBackground
              ? "text-gray-900"
              : isDarkGradient
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {value}
        </div>
        {description && (
          <div className="flex items-center gap-2 mt-1">
            <p
              className={`text-xs ${
                hasWhiteBackground
                  ? "text-gray-600"
                  : isDarkGradient
                  ? "text-white/80"
                  : "text-muted-foreground"
              }`}
            >
              {description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
