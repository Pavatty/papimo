import Stripe from "stripe";

/** Build-safe: empty env must not become `""` or Stripe throws "Neither apiKey nor config.authenticator". */
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY?.trim() || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-04-22.dahlia",
});

type CreateCheckoutSessionInput = {
  amount: number;
  currency: "EUR" | "USD" | "TND";
  orderId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(input: CreateCheckoutSessionInput) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: input.amount * 100,
          product_data: {
            name: `LODGE order ${input.orderId}`,
          },
        },
      },
    ],
    metadata: {
      orderId: input.orderId,
      ...(input.metadata ?? {}),
    },
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
}

export function parseWebhook(rawBody: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
