import { cn } from "@/lib/utils";

// Logo texte bicolore : pap = bleu institutionnel, imo = corail (règles de marque LODGE)

const sizeClasses = {
  xs: "text-lg",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
} as const;

type LogoProps = {
  className?: string;
  size?: keyof typeof sizeClasses;
};

export function Logo({ className, size = "md" }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display leading-none font-bold",
        "inline-flex select-none",
        sizeClasses[size],
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
