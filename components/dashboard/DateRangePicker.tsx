// components/SimpleDateRangePicker.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SimpleDateRangePickerProps {
  onDateChange: (range: { from: Date; to: Date } | null) => void;
}

export function SimpleDateRangePicker({
  onDateChange,
}: SimpleDateRangePickerProps) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);

  const handleFromDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setFromDate(date);
    if (toDate && date > toDate) {
      setToDate(undefined); // Reset to date if from date is after to date
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setToDate(date);
    setIsOpen(false);

    if (fromDate) {
      onDateChange({ from: fromDate, to: date });
    }
  };

  const clearDates = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[140px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "MMM dd") : "From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-2 border-soft-gray">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={handleFromDateSelect}
            />
          </PopoverContent>
        </Popover>

        <span className="text-gray-500">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[140px]"
              disabled={!fromDate}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {toDate ? format(toDate, "MMM dd") : "To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-2 border-soft-gray">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={handleToDateSelect}
              disabled={(date) => (fromDate ? date < fromDate : false)}
            />
          </PopoverContent>
        </Popover>

        {(fromDate || toDate) && (
          <Button variant="ghost" size="sm" onClick={clearDates}>
            Clear
          </Button>
        )}
      </div>

      {fromDate && toDate && (
        <p className="text-sm text-gray-600">
          Selected: {format(fromDate, "MMM dd, yyyy")} to{" "}
          {format(toDate, "MMM dd, yyyy")}
        </p>
      )}
    </div>
  );
}
