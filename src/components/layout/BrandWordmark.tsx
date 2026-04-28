import type { JSX } from "react";

import { cn } from "@/lib/utils";

type BrandWordmarkSize = "header" | "footer" | "compact" | "hero";

type IntrinsicTag = keyof JSX.IntrinsicElements;

interface Props {
  size?: BrandWordmarkSize;
  as?: IntrinsicTag;
  className?: string;
}

const SIZE_CLASSES: Record<BrandWordmarkSize, string> = {
  header: "text-3xl md:text-4xl",
  footer: "text-4xl md:text-5xl",
  compact: "text-xl",
  hero: "text-5xl md:text-7xl",
};

export function BrandWordmark({
  size = "header",
  as: Tag = "span",
  className,
}: Props) {
  return (
    <Tag
      aria-label="LODGE"
      className={cn(
        "text-vert inline-block leading-none font-black tracking-[-0.04em] uppercase select-none",
        SIZE_CLASSES[size],
        className,
      )}
    >
      LODGE
    </Tag>
  );
}
