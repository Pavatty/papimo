import type { ReactNode } from "react";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { AnalyticsBootstrap } from "@/components/providers/AnalyticsBootstrap";
import { CookieConsentBanner } from "@/components/shared/CookieConsentBanner";
import { SupportChatbot } from "@/components/shared/SupportChatbot";
import { isFlagEnabled } from "@/data/repositories/feature-flags";

type PublicLayoutProps = {
  children: ReactNode;
};

// Layout public : shell global (Header sticky + Footer cohérent) + bannières
export default async function PublicRouteLayout({
  children,
}: PublicLayoutProps) {
  const chatbotEnabled = await isFlagEnabled("chatbot_enabled");
  return (
    <>
      <PublicLayout>{children}</PublicLayout>
      <AnalyticsBootstrap />
      <CookieConsentBanner />
      {chatbotEnabled ? <SupportChatbot /> : null}
    </>
  );
}
