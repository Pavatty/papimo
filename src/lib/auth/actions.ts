"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { createClient } from "@/data/supabase/server";

import { checkRateLimit, RATE_LIMITS } from "./rateLimit";
import { formatPhoneE164 } from "./whatsapp";

const emailSchema = z.string().email("Email invalide");
const otpSchema = z.string().regex(/^\d{6}$/, "Code OTP invalide");

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const whatsAppOtpEnabled =
  process.env.NEXT_PUBLIC_WHATSAPP_OTP_ENABLED === "true";
const enabledLocales = ["fr", "en", "ar"] as const;

function getRequesterIp(value: string | null) {
  return value?.split(",")[0]?.trim() ?? "unknown";
}

function parseUrlSafe(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function detectLocaleFromReferer(referer: string | null) {
  const refererUrl = parseUrlSafe(referer);
  const localeCandidate = refererUrl?.pathname.split("/")[1];
  const locale = enabledLocales.includes(
    localeCandidate as (typeof enabledLocales)[number],
  )
    ? localeCandidate
    : "fr";

  return { locale, refererUrl };
}

export async function sendMagicLink(email: string) {
  "use server";

  const requestHeaders = await headers();
  const ip = getRequesterIp(requestHeaders.get("x-forwarded-for"));
  const limit = checkRateLimit({
    key: `magic:${ip}`,
    ...RATE_LIMITS.magicLinkPerIpPerHour,
  });

  if (!limit.allowed) {
    return { ok: false, error: "Trop de tentatives. Réessaie plus tard." };
  }

  const parsedEmail = emailSchema.safeParse(email);
  if (!parsedEmail.success) {
    return { ok: false, error: parsedEmail.error.issues[0]?.message };
  }

  const referer = requestHeaders.get("referer");
  const { locale, refererUrl } = detectLocaleFromReferer(referer);
  const redirectToParam = refererUrl?.searchParams.get("redirect_to");
  const callbackUrl = new URL(`/${locale}/auth/callback`, appUrl);
  if (redirectToParam?.startsWith("/") && !redirectToParam.startsWith("//")) {
    callbackUrl.searchParams.set("redirect_to", redirectToParam);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsedEmail.data,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function signInWithGoogleAction() {
  "use server";

  const requestHeaders = await headers();
  const referer = requestHeaders.get("referer");
  const { locale, refererUrl } = detectLocaleFromReferer(referer);
  const redirectToParam = refererUrl?.searchParams.get("redirect_to");
  const callbackUrl = new URL(`/${locale}/auth/callback`, appUrl);
  if (redirectToParam?.startsWith("/") && !redirectToParam.startsWith("//")) {
    callbackUrl.searchParams.set("redirect_to", redirectToParam);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, url: data.url };
}

export async function sendWhatsAppCode(phone: string) {
  "use server";

  if (!whatsAppOtpEnabled) {
    return { ok: false, error: "Connexion WhatsApp indisponible." };
  }

  const requestHeaders = await headers();
  const ip = getRequesterIp(requestHeaders.get("x-forwarded-for"));
  const limit = checkRateLimit({
    key: `wa-send:${ip}`,
    ...RATE_LIMITS.whatsappSendPerIpPerHour,
  });

  if (!limit.allowed) {
    return { ok: false, error: "Limite atteinte. Réessaie dans 1 heure." };
  }

  let normalizedPhone: string;
  try {
    normalizedPhone = formatPhoneE164(phone, "TN");
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizedPhone,
    options: { channel: "whatsapp" },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, phone: normalizedPhone };
}

export async function verifyWhatsAppCode(phone: string, code: string) {
  "use server";

  if (!whatsAppOtpEnabled) {
    return { ok: false, error: "Connexion WhatsApp indisponible." };
  }

  const parsedCode = otpSchema.safeParse(code);
  if (!parsedCode.success) {
    return { ok: false, error: "Code invalide" };
  }

  let normalizedPhone: string;
  try {
    normalizedPhone = formatPhoneE164(phone, "TN");
  } catch {
    return { ok: false, error: "Numero invalide" };
  }

  const verifyLimit = checkRateLimit({
    key: `wa-verify:${normalizedPhone}`,
    ...RATE_LIMITS.whatsappVerifyPerPhonePerHour,
  });

  if (!verifyLimit.allowed) {
    return { ok: false, error: "Trop de tentatives. Réessaie plus tard." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: normalizedPhone,
    token: parsedCode.data,
    type: "sms",
  });

  if (error) {
    return {
      ok: false,
      error: error.message || "Code incorrect ou expire",
      attemptsRemaining: verifyLimit.remaining,
    };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function isWhatsAppOtpEnabled() {
  "use server";
  return { ok: true, enabled: whatsAppOtpEnabled };
}
