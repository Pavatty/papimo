import crypto from "node:crypto";

const KONNECT_BASE_URL =
  process.env.KONNECT_BASE_URL ?? "https://api.konnect.network/api/v2";

type CreateKonnectPaymentInput = {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  returnUrl: string;
  webhookUrl: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export async function createPayment(input: CreateKonnectPaymentInput) {
  const apiKey = process.env.KONNECT_API_KEY;
  const walletId = process.env.KONNECT_WALLET_ID;
  if (!apiKey || !walletId) {
    throw new Error("Missing KONNECT_API_KEY or KONNECT_WALLET_ID");
  }

  const body = {
    receiverWalletId: walletId,
    amount: input.amount,
    currency: input.currency,
    type: "immediate",
    description: `LODGE order ${input.orderId}`,
    orderId: input.orderId,
    acceptedPaymentMethods: ["bank_card", "e-DINAR"],
    successUrl: input.returnUrl,
    failUrl: input.returnUrl,
    webhook: input.webhookUrl,
    customer: {
      firstName: input.firstName ?? "Client",
      lastName: input.lastName ?? "LODGE",
      email: input.customerEmail,
      phoneNumber: input.phoneNumber ?? "",
    },
  };

  const response = await fetch(`${KONNECT_BASE_URL}/payments/init-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Konnect init-payment failed: ${response.status} ${errorText}`,
    );
  }

  const json = (await response.json()) as {
    payUrl?: string;
    paymentRef?: string;
    paymentId?: string;
  };
  return {
    payUrl: json.payUrl ?? "",
    paymentRef: json.paymentRef ?? json.paymentId ?? "",
    raw: json,
  };
}

export async function getPaymentStatus(paymentRef: string) {
  const apiKey = process.env.KONNECT_API_KEY;
  if (!apiKey) throw new Error("Missing KONNECT_API_KEY");

  const response = await fetch(`${KONNECT_BASE_URL}/payments/${paymentRef}`, {
    headers: { "x-api-key": apiKey },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Konnect payment status failed: ${response.status} ${errorText}`,
    );
  }
  return response.json();
}

export function parseWebhook(payload: string, signatureHeader: string | null) {
  const webhookSecret = process.env.KONNECT_WEBHOOK_SECRET;
  if (webhookSecret && signatureHeader) {
    const digest = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");
    if (digest !== signatureHeader) {
      throw new Error("Invalid Konnect webhook signature");
    }
  }

  const data = JSON.parse(payload) as {
    paymentRef?: string;
    status?: string;
    orderId?: string;
    amount?: number;
    currency?: string;
  };

  return {
    paymentRef: data.paymentRef ?? null,
    status: data.status ?? "unknown",
    orderId: data.orderId ?? null,
    amount: data.amount ?? null,
    currency: data.currency ?? null,
    raw: data,
  };
}

/**
 * Konnect environments:
 * - Sandbox: configure KONNECT_BASE_URL and sandbox API keys from dashboard.
 * - Production: default base URL above with production credentials.
 */
