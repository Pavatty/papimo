import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      {icon ? <div className="text-encre/40 mb-4">{icon}</div> : null}
      <h3 className="text-encre mb-1 font-serif text-lg">{title}</h3>
      {description ? (
        <p className="text-encre/70 mb-4 max-w-sm text-sm">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
