import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type EmotionalColor =
  | "joie"
  | "coeur"
  | "urgence"
  | "nouveaute"
  | "confiance"
  | "douceur";

const STYLES: Record<EmotionalColor, string> = {
  joie: "bg-joie-soft text-joie",
  coeur: "bg-coeur-soft text-coeur",
  urgence: "bg-urgence-soft text-urgence",
  nouveaute: "bg-nouveaute-soft text-nouveaute",
  confiance: "bg-confiance-soft text-confiance",
  douceur: "bg-douceur-soft text-douceur",
};

interface Props {
  color: EmotionalColor;
  children: ReactNode;
  className?: string;
  solid?: boolean;
}

export function EmotionalBadge({
  color,
  children,
  className,
  solid = false,
}: Props) {
  const solidStyles: Record<EmotionalColor, string> = {
    joie: "bg-joie text-encre",
    coeur: "bg-coeur text-white",
    urgence: "bg-urgence text-white",
    nouveaute: "bg-nouveaute text-white",
    confiance: "bg-confiance text-white",
    douceur: "bg-douceur text-encre",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide uppercase",
        solid ? solidStyles[color] : STYLES[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
