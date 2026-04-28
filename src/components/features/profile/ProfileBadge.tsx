import { BadgeCheck } from "lucide-react";

import { EmotionalBadge } from "@/components/ui/EmotionalBadge";

interface Props {
  isVerified: boolean;
  label?: string;
  className?: string;
}

export function ProfileBadge({
  isVerified,
  label = "Vérifié",
  className,
}: Props) {
  if (!isVerified) return null;
  return (
    <EmotionalBadge color="confiance" {...(className ? { className } : {})}>
      <BadgeCheck className="size-3" aria-hidden="true" />
      {label}
    </EmotionalBadge>
  );
}
