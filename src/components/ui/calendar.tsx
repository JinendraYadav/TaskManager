import * as React from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type CalendarProps = {
  className?: string;

  /** react-day-picker compatibility */
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date) => void;
  initialFocus?: boolean;
};

export function Calendar({
  className,
  selected,
  onSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(
    selected ?? new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = new Date(day.getTime() + 86400000);
  }

  return (
    <div
      className={cn(
        "w-[320px] rounded-md bg-popover p-4",
        className
      )}
    >
      {/* Header */}
      <div className="relative mb-4 flex items-center justify-center">
        <span className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </span>

        <div className="absolute right-0 flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 p-0"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 p-0"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
        {days.map((day, idx) => {
          const isOutside = !isSameMonth(day, monthStart);
          const isTodayDate = isToday(day);
          const isSelected = selected && isSameDay(day, selected);

          return (
            <button
              key={idx}
              onClick={() => onSelect?.(day)}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal",
                isOutside && "text-muted-foreground opacity-40",
                isTodayDate && "bg-accent text-accent-foreground",
                isSelected &&
                "bg-primary text-primary-foreground hover:bg-primary"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
