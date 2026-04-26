import type { ReactNode } from "react";

type AuthedLayoutProps = {
  children: ReactNode;
};

// Groupe (authed) : ici s’appliquera le garde d’authentification / navigation membre
export default function AuthedLayout({ children }: AuthedLayoutProps) {
  return <>{children}</>;
}
