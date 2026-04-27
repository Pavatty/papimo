"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function FilterSection({ title, children, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-line rounded-xl border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-ink text-sm font-semibold">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition", open && "rotate-180")}
        />
      </button>
      {open ? <div className="space-y-2 px-3 pb-3">{children}</div> : null}
    </section>
  );
}
