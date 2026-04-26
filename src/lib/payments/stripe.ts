import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripeClient: Stripe | null = null;

function getStripeClient() {
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    });
  }
  return stripeClient;
}

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
  const stripe = getStripeClient();
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
            name: `Papimo order ${input.orderId}`,
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
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
