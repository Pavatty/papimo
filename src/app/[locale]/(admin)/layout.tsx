import type { ReactNode } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

// Groupe (admin) : ici s’appliquera le garde rôles
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>;
}
