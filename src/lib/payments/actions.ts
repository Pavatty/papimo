"use server";

import PDFDocument from "pdfkit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { captureServerEvent } from "@/lib/analytics/events";
import { logAuditEvent } from "@/lib/audit/log";
import { createClient } from "@/lib/supabase/server";
import type { Enums, Json } from "@/types/database";

import { createPayment } from "./konnect";
import {
  BOOST_CONFIG,
  LISTING_PACK_PRICES_TND,
  convertTndToForeign,
} from "./pricing";
import { createCheckoutSession } from "./stripe";

function detectGateway(
  countryCode: string,
  preferredCurrency: Enums<"currency_code">,
) {
  if (["TN", "MA", "DZ", "EG"].includes(countryCode)) {
    return { gateway: "konnect" as const, currency: "TND" as const };
  }
  if (preferredCurrency === "USD") {
    return { gateway: "stripe" as const, currency: "USD" as const };
  }
  return { gateway: "stripe" as const, currency: "EUR" as const };
}

const enabledLocales = ["fr", "en", "ar"] as const;

async function detectLocaleFromRequest() {
  const requestHeaders = await headers();
  const referer = requestHeaders.get("referer");

  if (!referer) return "fr";

  try {
    const refererUrl = new URL(referer);
    const localeCandidate = refererUrl.pathname.split("/")[1];
    if (
      enabledLocales.includes(
        localeCandidate as (typeof enabledLocales)[number],
      )
    ) {
      return localeCandidate;
    }
  } catch {
    // Ignore invalid referer values and fallback to FR.
  }

  return "fr";
}

export async function activateListingPack(
  listingId: string,
  pack: Enums<"listing_pack">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const months = pack === "essential" ? 2 : pack === "comfort" ? 3 : 6;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + months);

  const { error } = await supabase
    .from("listings")
    .update({ pack, expires_at: expiresAt.toISOString() })
    .eq("id", listingId)
    .eq("owner_id", user.id);
  if (error) return { ok: false, error: error.message };

  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: `listing_${pack}`,
    status: "active",
    started_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  return { ok: true };
}

const initiateListingSchema = z.object({
  listingId: z.string().uuid(),
  pack: z.enum(["essential", "comfort", "premium"]),
});

export async function initiateListingPackPayment(
  listingId: string,
  pack: "essential" | "comfort" | "premium",
) {
  const parsed = initiateListingSchema.safeParse({ listingId, pack });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const [{ data: listing }, { data: profile }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, owner_id, pack, status")
      .eq("id", listingId)
      .eq("owner_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select("country_code, preferred_currency, email")
      .eq("id", user.id)
      .single(),
  ]);

  if (!listing || listing.status !== "draft") {
    return { ok: false, error: "Listing draft introuvable" };
  }

  const baseAmountTnd = LISTING_PACK_PRICES_TND[pack];
  const countryCode = profile?.country_code ?? "TN";
  const preferredCurrency = profile?.preferred_currency ?? "TND";
  const gatewayData = detectGateway(countryCode, preferredCurrency);
  const amount =
    gatewayData.currency === "TND"
      ? baseAmountTnd
      : convertTndToForeign(baseAmountTnd, gatewayData.currency);

  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      amount,
      currency: gatewayData.currency,
      status: "pending",
      type: "subscription",
      gateway: gatewayData.gateway,
      metadata: { listingId, pack, purpose: "listing_pack" },
    })
    .select("id")
    .single();
  if (txError || !transaction)
    return { ok: false, error: txError?.message ?? "Transaction error" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const locale = await detectLocaleFromRequest();
  const successUrl = `${appUrl}/${locale}/checkout/success?ref=${transaction.id}`;
  const cancelUrl = `${appUrl}/${locale}/checkout/failure?ref=${transaction.id}`;
  const webhookUrlKonnect = `${appUrl}/api/webhooks/konnect`;

  if (gatewayData.gateway === "konnect") {
    const payment = await createPayment({
      amount,
      currency: gatewayData.currency,
      orderId: transaction.id,
      customerEmail: profile?.email ?? user.email ?? "unknown@papimo.com",
      returnUrl: successUrl,
      webhookUrl: webhookUrlKonnect,
    });
    await supabase
      .from("transactions")
      .update({
        gateway_ref: payment.paymentRef,
        gateway_response: payment.raw,
      })
      .eq("id", transaction.id);
    return {
      ok: true,
      paymentUrl: payment.payUrl,
      transactionId: transaction.id,
    };
  }

  const stripe = await createCheckoutSession({
    amount,
    currency: gatewayData.currency,
    orderId: transaction.id,
    customerEmail: profile?.email ?? user.email ?? "unknown@papimo.com",
    successUrl,
    cancelUrl,
    metadata: {
      listingId,
      pack,
      purpose: "listing_pack",
      transactionId: transaction.id,
    },
  });
  await supabase
    .from("transactions")
    .update({
      gateway_ref: stripe.sessionId,
      gateway_response: { sessionUrl: stripe.sessionUrl },
    })
    .eq("id", transaction.id);
  return {
    ok: true,
    paymentUrl: stripe.sessionUrl,
    transactionId: transaction.id,
  };
}

export async function initiateBoostPayment(
  listingId: string,
  boostType: Enums<"boost_type">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const [{ data: listing }, { data: profile }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, owner_id")
      .eq("id", listingId)
      .eq("owner_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select("country_code, preferred_currency, email")
      .eq("id", user.id)
      .single(),
  ]);
  if (!listing) return { ok: false, error: "Listing not found" };

  const boost = BOOST_CONFIG[boostType];
  const gatewayData = detectGateway(
    profile?.country_code ?? "TN",
    profile?.preferred_currency ?? "TND",
  );
  const amount =
    gatewayData.currency === "TND"
      ? boost.priceTnd
      : convertTndToForeign(boost.priceTnd, gatewayData.currency);

  const { data: transaction } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      amount,
      currency: gatewayData.currency,
      status: "pending",
      type: "boost",
      gateway: gatewayData.gateway,
      metadata: { listingId, boostType, purpose: "listing_boost" },
    })
    .select("id")
    .single();
  if (!transaction) return { ok: false, error: "Transaction error" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const locale = await detectLocaleFromRequest();
  const successUrl = `${appUrl}/${locale}/checkout/success?ref=${transaction.id}`;
  const cancelUrl = `${appUrl}/${locale}/checkout/failure?ref=${transaction.id}`;

  if (gatewayData.gateway === "konnect") {
    const payment = await createPayment({
      amount,
      currency: gatewayData.currency,
      orderId: transaction.id,
      customerEmail: profile?.email ?? user.email ?? "unknown@papimo.com",
      returnUrl: successUrl,
      webhookUrl: `${appUrl}/api/webhooks/konnect`,
    });
    await supabase
      .from("transactions")
      .update({
        gateway_ref: payment.paymentRef,
        gateway_response: payment.raw,
      })
      .eq("id", transaction.id);
    return { ok: true, paymentUrl: payment.payUrl };
  }

  const stripe = await createCheckoutSession({
    amount,
    currency: gatewayData.currency,
    orderId: transaction.id,
    customerEmail: profile?.email ?? user.email ?? "unknown@papimo.com",
    successUrl,
    cancelUrl,
    metadata: {
      listingId,
      boostType,
      purpose: "listing_boost",
      transactionId: transaction.id,
    },
  });
  await supabase
    .from("transactions")
    .update({
      gateway_ref: stripe.sessionId,
      gateway_response: { sessionUrl: stripe.sessionUrl },
    })
    .eq("id", transaction.id);
  return { ok: true, paymentUrl: stripe.sessionUrl };
}

export async function applyBoostAfterPayment(
  listingId: string,
  boostType: Enums<"boost_type">,
  transactionId: string,
) {
  const supabase = await createClient();
  const boost = BOOST_CONFIG[boostType];
  const starts = new Date();
  const ends = new Date();
  ends.setDate(ends.getDate() + boost.durationDays);

  await supabase.from("boosts").insert({
    listing_id: listingId,
    transaction_id: transactionId,
    type: boostType,
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
  });
}

export async function handleKonnectWebhook(
  payload: string,
  signature: string | null,
) {
  const { parseWebhook } = await import("./konnect");
  const parsed = parseWebhook(payload, signature);
  if (!parsed.orderId) return { ok: false, error: "Missing orderId" };

  const supabase = await createClient();
  const targetStatus = parsed.status === "completed" ? "completed" : "failed";
  const { data: transaction } = await supabase
    .from("transactions")
    .update({
      status: targetStatus,
      completed_at:
        targetStatus === "completed" ? new Date().toISOString() : null,
      gateway_response: parsed.raw,
    })
    .eq("id", parsed.orderId)
    .select("id, metadata, user_id")
    .single();
  if (!transaction) return { ok: false, error: "Transaction not found" };

  if (targetStatus === "completed") {
    const metadata = (transaction.metadata ?? {}) as Record<string, string>;
    if (
      metadata.purpose === "listing_pack" &&
      metadata.listingId &&
      metadata.pack
    ) {
      await activateListingPack(
        metadata.listingId,
        metadata.pack as Enums<"listing_pack">,
      );
    }
    if (
      metadata.purpose === "listing_boost" &&
      metadata.listingId &&
      metadata.boostType
    ) {
      await applyBoostAfterPayment(
        metadata.listingId,
        metadata.boostType as Enums<"boost_type">,
        transaction.id,
      );
    }
    await captureServerEvent("payment_completed", transaction.user_id, {
      transactionId: transaction.id,
      gateway: "konnect",
    });
  }

  await logAuditEvent({
    action: "payment_webhook_konnect",
    targetType: "transaction",
    targetId: parsed.orderId,
    afterData: parsed.raw as Record<string, unknown>,
  });
  return { ok: true };
}

export async function handleStripeWebhook(event: {
  type: string;
  data: { object: { metadata?: Record<string, string>; id?: string } };
}) {
  const object = event.data.object;
  const metadata = object.metadata ?? {};
  const transactionId = metadata.transactionId ?? metadata.orderId;
  if (!transactionId) return { ok: false, error: "Missing transactionId" };

  const completed = [
    "checkout.session.completed",
    "payment_intent.succeeded",
  ].includes(event.type);
  const status = completed ? "completed" : "failed";

  const supabase = await createClient();
  const { data: txRow } = await supabase
    .from("transactions")
    .select("user_id")
    .eq("id", transactionId)
    .maybeSingle();
  await supabase
    .from("transactions")
    .update({
      status,
      completed_at: completed ? new Date().toISOString() : null,
      gateway_response: object as unknown as Json,
    })
    .eq("id", transactionId);

  if (completed) {
    if (
      metadata.purpose === "listing_pack" &&
      metadata.listingId &&
      metadata.pack
    ) {
      await activateListingPack(
        metadata.listingId,
        metadata.pack as Enums<"listing_pack">,
      );
    }
    if (
      metadata.purpose === "listing_boost" &&
      metadata.listingId &&
      metadata.boostType
    ) {
      await applyBoostAfterPayment(
        metadata.listingId,
        metadata.boostType as Enums<"boost_type">,
        transactionId,
      );
    }
    await captureServerEvent("payment_completed", txRow?.user_id ?? "unknown", {
      transactionId,
      gateway: "stripe",
    });
  }

  await logAuditEvent({
    action: "payment_webhook_stripe",
    targetType: "transaction",
    targetId: transactionId,
    afterData: object as unknown as Record<string, unknown>,
  });
  return { ok: true };
}

export async function startListingPackCheckoutAction(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const pack = String(formData.get("pack") ?? "") as
    | "essential"
    | "comfort"
    | "premium";
  const locale = await detectLocaleFromRequest();
  const result = await initiateListingPackPayment(listingId, pack);
  if (!result.ok || !result.paymentUrl) {
    redirect(`/${locale}/checkout/failure?ref=${result.transactionId ?? ""}`);
  }
  redirect(result.paymentUrl);
}

export async function startBoostCheckoutAction(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const boostType = String(
    formData.get("boostType") ?? "",
  ) as Enums<"boost_type">;
  const locale = await detectLocaleFromRequest();
  const result = await initiateBoostPayment(listingId, boostType);
  if (!result.ok || !result.paymentUrl) {
    redirect(`/${locale}/checkout/failure`);
  }
  redirect(result.paymentUrl);
}

export async function generateInvoice(transactionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: tx } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .eq("user_id", user.id)
    .single();
  if (!tx) return { ok: false, error: "Transaction introuvable" };

  const doc = new PDFDocument({ margin: 48 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  doc.on("end", () => undefined);

  doc.fontSize(22).fillColor("#1f4fbf").text("papimo", { continued: true });
  doc.fillColor("#ff6f61").text(" ");
  doc.fillColor("#111827").fontSize(12).text("Facture");
  doc.moveDown();
  doc.text(`Référence: ${tx.id}`);
  doc.text(`Date: ${new Date(tx.created_at).toLocaleDateString("fr-FR")}`);
  doc.text(`Client: ${user.email ?? "N/A"}`);
  doc.moveDown();
  doc.text(`Ligne: ${tx.type} (${tx.gateway ?? "gateway"})`);
  doc.text(`Montant HT: ${tx.amount} ${tx.currency}`);
  doc.text("TVA: 0.00");
  doc.text(`Total: ${tx.amount} ${tx.currency}`);
  doc.moveDown();
  doc.fontSize(10).fillColor("#6b7280").text("Papimo — entité légale TBD");
  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const objectPath = `${user.id}/${tx.id}.pdf`;
  const upload = await supabase.storage
    .from("invoices")
    .upload(objectPath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (upload.error) return { ok: false, error: upload.error.message };

  const signed = await supabase.storage
    .from("invoices")
    .createSignedUrl(objectPath, 60 * 60 * 24);
  if (signed.error) return { ok: false, error: signed.error.message };
  return { ok: true, url: signed.data.signedUrl };
}
