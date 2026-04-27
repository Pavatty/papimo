"use client";

import { useEffect } from "react";

import { readConsent } from "@/lib/consent";

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const exists = document.querySelector(`script[src="${src}"]`);
  if (exists) return;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
  document.head.appendChild(script);
}

export function AnalyticsBootstrap() {
  useEffect(() => {
    const applyConsent = () => {
      const consent = readConsent();
      if (!consent) return;

      if (consent.analytics && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
        injectScript("https://plausible.io/js/script.js", {
          "data-domain": process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
        });
      }

      if (consent.productAnalytics && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        injectScript("https://us.i.posthog.com/static/array.js");
      }
    };

    applyConsent();
    window.addEventListener("papimo:consent-updated", applyConsent);
    return () =>
      window.removeEventListener("papimo:consent-updated", applyConsent);
  }, []);

  return null;
}
