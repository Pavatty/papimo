"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({ className, classNames, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-center relative items-center",
        caption_label: "text-sm font-medium text-encre",
        nav: "space-x-1 flex items-center",
        button_previous:
          "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100",
        button_next: "h-7 w-7 bg-transparent p-0 opacity-60 hover:opacity-100",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        weekday: "text-encre/60 w-9 font-normal text-xs",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0",
        day: "h-9 w-9 p-0 font-normal text-encre rounded hover:bg-sejours-sky transition",
        selected:
          "bg-sejours-turquoise text-white hover:bg-sejours-turquoise-hover",
        today: "bg-sejours-sun/20 text-sejours-sun-text font-bold",
        disabled: "text-encre/30 opacity-50 line-through pointer-events-none",
        outside: "text-encre/30",
        range_start: "bg-sejours-turquoise text-white rounded-l-md",
        range_middle: "bg-sejours-sky text-encre",
        range_end: "bg-sejours-turquoise text-white rounded-r-md",
        ...classNames,
      }}
      {...props}
    />
  );
}
