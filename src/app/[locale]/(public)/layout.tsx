import type { ReactNode } from "react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { AnalyticsBootstrap } from "@/components/providers/AnalyticsBootstrap";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";

type PublicLayoutProps = {
  children: ReactNode;
};

// Layout public : shell global (Header sticky + Footer cohérent) + bannières
export default function PublicRouteLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicLayout>{children}</PublicLayout>
      <AnalyticsBootstrap />
      <CookieConsentBanner />
    </>
  );
}
