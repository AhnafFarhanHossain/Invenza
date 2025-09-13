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
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  onDateChange: (range: { from: Date; to: Date } | null) => void;
}

export function DateRangePicker({ onDateChange }: DateRangePickerProps) {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);

  const handleFromSelect = (date: Date | undefined) => {
    if (!date) return;
    setFromDate(date);
    if (toDate) {
      if (date > toDate) {
        setToDate(undefined);
      } else {
        // Both dates are valid - call change handler and close picker
        onDateChange({ from: date, to: toDate });
        setIsRangePickerOpen(false);
      }
    }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (!date) return;
    setToDate(date);
    // Close popover if we have both dates
    if (fromDate) {
      onDateChange({ from: fromDate, to: date });
      setIsRangePickerOpen(false);
    }
  };

  const clearSelection = () => {
    setFromDate(undefined);
    setToDate(undefined);
    onDateChange(null);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Popover open={isRangePickerOpen} onOpenChange={setIsRangePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full max-w-[240px] justify-between font-light rounded-none border border-gray-200 px-3"
            >
              <span>
                {fromDate 
                  ? toDate 
                    ? `${format(fromDate, "MMM dd")} - ${format(toDate, "MMM dd")}`
                    : format(fromDate, "MMM dd, yyyy")
                  : "Select date range"}
              </span>
              <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-auto p-0 bg-white border border-gray-200 rounded-none"
            align="start"
          >
            <div className="flex">
              <div className="border-r border-gray-100">
                <div className="p-2 text-xs font-light text-gray-500 tracking-wider border-b border-gray-100">
                  FROM
                </div>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={handleFromSelect}
                  className="p-2"
                />
              </div>
              
              <div>
                <div className="p-2 text-xs font-light text-gray-500 tracking-wider border-b border-gray-100">
                  TO
                </div>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={handleToSelect}
                  disabled={(date) => (fromDate ? date < fromDate : false)}
                  className="p-2"
                />
              </div>
            </div>
            
            {(fromDate || toDate) && (
              <div className="flex justify-between items-center p-3 border-t border-gray-100">
                <div className="text-sm font-mono">
                  {fromDate && toDate 
                    ? `${format(fromDate, "MMM dd")} - ${format(toDate, "MMM dd")}` 
                    : fromDate 
                      ? `From ${format(fromDate, "MMM dd")}`
                      : ""}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSelection}
                  className="text-xs font-light hover:bg-orange-50 hover:text-orange-600"
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
