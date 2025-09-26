"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export const SummaryCard = ({
  title,
  value,
  description,
  icon,
  className,
  iconBgColor,
  iconColor,
}: SummaryCardProps) => {
  const isDarkGradient =
    className?.includes("900") || className?.includes("bg-gradient");
  const hasLightBackground = className?.includes("bg-[var(--light-base)]");

  return (
    <Card className={`shadow-none rounded-none border border-gray-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
        <CardTitle
          className={`text-[10px] sm:text-xs font-light uppercase tracking-wider ${
            isDarkGradient ? "text-gray-200" : "text-gray-600"
          }`}
        >
          {title}
        </CardTitle>
        <div
          className={`p-1 sm:p-2 rounded-none ${
            iconBgColor ||
            (hasLightBackground
              ? "bg-gray-100"
              : isDarkGradient
              ? "bg-white/10"
              : "bg-gray-100")
          } ${
            iconColor ||
            (hasLightBackground
              ? "text-gray-800"
              : isDarkGradient
              ? "text-gray-200"
              : "text-gray-800")
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={`text-2xl sm:text-4xl font-light font-mono tracking-tight ${
            hasLightBackground
              ? "text-black"
              : isDarkGradient
              ? "text-white"
              : "text-black"
          }`}
        >
          {value}
        </div>
        {description && (
          <div className="flex items-center gap-1 mt-1">
            <p
              className={`text-[11px] font-light ${
                hasLightBackground
                  ? "text-gray-500"
                  : isDarkGradient
                  ? "text-gray-300"
                  : "text-gray-500"
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
