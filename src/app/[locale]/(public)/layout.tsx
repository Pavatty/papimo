import type { ReactNode } from "react";

import { AnalyticsBootstrap } from "@/components/providers/AnalyticsBootstrap";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";

type PublicLayoutProps = {
  children: ReactNode;
};

// Layout public : shell commun (futures bannières, analytics, etc.) sans authentification
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      {children}
      <AnalyticsBootstrap />
      <CookieConsentBanner />
    </>
  );
}
