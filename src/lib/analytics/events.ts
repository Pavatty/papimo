type AnalyticsEventPayload = Record<string, unknown>;

export async function captureServerEvent(
  event: string,
  distinctId: string,
  properties: AnalyticsEventPayload = {},
) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  try {
    await fetch("https://us.i.posthog.com/capture/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event,
        distinct_id: distinctId,
        properties,
      }),
      cache: "no-store",
    });
  } catch {
    // Intentionally ignore analytics failures.
  }
}
