import type { ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

// Layout public : shell commun (futures bannières, analytics, etc.) sans authentification
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>;
}
