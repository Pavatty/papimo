// Helper léger pour appeler Plausible custom events depuis le client.
// Le script est injecté par AnalyticsBootstrap si le consentement analytics est donné.

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

type EventProps = Record<string, string | number | boolean>;

export function trackEvent(name: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  try {
    window.plausible(name, props ? { props } : undefined);
  } catch (error) {
    console.warn("[plausible] trackEvent failed:", error);
  }
}
