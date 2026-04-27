import { cn } from "@/lib/utils";

type BrandWordmarkSize = "header" | "footer" | "compact";

type Props = {
  size?: BrandWordmarkSize;
  className?: string;
};

const SIZE_CLASSES: Record<BrandWordmarkSize, string> = {
  header: "text-3xl md:text-4xl",
  footer: "text-4xl md:text-5xl",
  compact: "text-xl",
};

// Wordmark bicolor "pap·imo" — source unique partagée entre Header et Footer.
export function BrandWordmark({ size = "header", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex font-serif leading-none font-medium tracking-tight select-none",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <span className="text-bleu" aria-hidden>
        pap
      </span>
      <span className="text-corail" aria-hidden>
        imo
      </span>
    </span>
  );
}
