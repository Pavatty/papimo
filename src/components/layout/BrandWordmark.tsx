import { cn } from "@/lib/utils";

type BrandWordmarkSize = "header" | "footer" | "compact";

type Props = {
  size?: BrandWordmarkSize;
  className?: string;
  part1?: string;
  part2?: string;
};

const SIZE_CLASSES: Record<BrandWordmarkSize, string> = {
  header: "text-3xl md:text-4xl font-bold",
  footer: "text-4xl md:text-5xl",
  compact: "text-xl",
};

export function BrandWordmark({
  size = "header",
  className,
  part1 = "pap",
  part2 = "imo",
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex font-serif leading-none font-medium tracking-tight select-none",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <span className="text-bleu" aria-hidden>
        {part1}
      </span>
      <span className="text-corail" aria-hidden>
        {part2}
      </span>
    </span>
  );
}
