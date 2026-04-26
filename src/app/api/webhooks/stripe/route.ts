import { NextResponse } from "next/server";

import { handleStripeWebhook } from "@/lib/payments/actions";
import { parseWebhook } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { ok: false, error: "Missing stripe-signature" },
        { status: 400 },
      );
    }
    const rawBody = await request.text();
    const event = parseWebhook(rawBody, signature);
    const result = await handleStripeWebhook(event as never);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Webhook error",
      },
      { status: 500 },
    );
  }
}
