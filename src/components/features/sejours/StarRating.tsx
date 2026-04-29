"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  ariaLabel?: string;
};

const SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  readOnly = false,
  ariaLabel = "Note",
}: Props) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            tabIndex={readOnly ? -1 : 0}
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
            className={cn(
              "rounded transition focus-visible:outline-none",
              !readOnly &&
                "focus-visible:ring-sejours-coral hover:scale-110 focus-visible:ring-2",
            )}
          >
            <Star
              className={cn(
                SIZE_MAP[size],
                active ? "fill-sejours-sun text-sejours-sun" : "text-encre/30",
              )}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
