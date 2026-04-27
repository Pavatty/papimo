"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { checkRateLimit, RATE_LIMITS } from "./rateLimit";
import {
  buildWhatsAppLink,
  formatPhoneE164,
  generateOtpCode,
} from "./whatsapp";

const emailSchema = z.string().email("Email invalide");
const otpSchema = z.string().regex(/^\d{6}$/, "Code OTP invalide");

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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

function getPrivilegedClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase service role is not configured");
  }

  return createAdminClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
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
  const refererUrl = parseUrlSafe(referer);
  const localeCandidate = refererUrl?.pathname.split("/")[1];
  const locale =
    localeCandidate && ["fr", "en", "ar"].includes(localeCandidate)
      ? localeCandidate
      : "fr";
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${appUrl}/fr/auth/callback`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, url: data.url };
}

export async function sendWhatsAppCode(phone: string) {
  "use server";

  const requestHeaders = await headers();
  const ip = getRequesterIp(requestHeaders.get("x-forwarded-for"));
  const userAgent = requestHeaders.get("user-agent");
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

  const code = generateOtpCode();
  const privileged = getPrivilegedClient();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error } = await privileged.from("auth_otp").insert({
    phone: normalizedPhone,
    code,
    expires_at: expiresAt,
    ip,
    user_agent: userAgent,
  } as never);

  if (error) {
    return { ok: false, error: error.message };
  }

  const businessNumber = process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "";
  const whatsappLink = buildWhatsAppLink(businessNumber, code, "fr");

  return { ok: true, code, whatsappLink, phone: normalizedPhone };
}

export async function verifyWhatsAppCode(phone: string, code: string) {
  "use server";

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

  const privileged = getPrivilegedClient();
  const nowIso = new Date().toISOString();
  const { data: otpRows, error: otpError } = await privileged
    .from("auth_otp")
    .select("id, code, attempts, used, expires_at")
    .eq("phone", normalizedPhone)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1);

  if (otpError) {
    return { ok: false, error: otpError.message };
  }

  const otpRow = otpRows?.[0];
  const isValid =
    otpRow !== undefined &&
    otpRow.code === parsedCode.data &&
    !otpRow.used &&
    otpRow.expires_at > nowIso;

  if (!isValid) {
    if (otpRow?.id) {
      await privileged
        .from("auth_otp")
        .update({ attempts: (otpRow.attempts ?? 0) + 1 } as never)
        .eq("id", otpRow.id);
    }
    return {
      ok: false,
      error: "Code incorrect ou expire",
      attemptsRemaining: verifyLimit.remaining,
    };
  }

  if (!otpRow) {
    return {
      ok: false,
      error: "Code incorrect ou expire",
      attemptsRemaining: verifyLimit.remaining,
    };
  }

  await privileged
    .from("auth_otp")
    .update({ used: true } as never)
    .eq("id", otpRow.id);

  const { error: createUserError } = await privileged.auth.admin.createUser({
    phone: normalizedPhone,
    phone_confirm: true,
    user_metadata: { auth_method: "whatsapp_click_to_chat" },
  });

  if (
    createUserError &&
    !createUserError.message.toLowerCase().includes("already")
  ) {
    return { ok: false, error: createUserError.message };
  }

  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
