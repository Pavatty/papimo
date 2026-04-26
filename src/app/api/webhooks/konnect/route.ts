import { NextResponse } from "next/server";

import { handleKonnectWebhook } from "@/lib/payments/actions";

export async function POST(request: Request) {
  try {
    const signature =
      request.headers.get("x-konnect-signature") ??
      request.headers.get("x-signature");
    const body = await request.text();
    const result = await handleKonnectWebhook(body, signature);
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
