import { randomInt as nodeRandomInt } from "node:crypto";

import { parsePhoneNumberFromString } from "libphonenumber-js";

const OTP_MIN = 100000;
const OTP_MAX_EXCLUSIVE = 1000000;

export function generateOtpCode() {
  if (typeof window === "undefined") {
    return String(nodeRandomInt(OTP_MIN, OTP_MAX_EXCLUSIVE));
  }

  const random = new Uint32Array(1);
  globalThis.crypto.getRandomValues(random);
  const r = random[0] ?? 0;
  const code = OTP_MIN + (r % (OTP_MAX_EXCLUSIVE - OTP_MIN));
  return String(code);
}

export function formatPhoneE164(phone: string, defaultCountry: "TN" = "TN") {
  const parsed = parsePhoneNumberFromString(phone, defaultCountry);
  if (!parsed || !parsed.isValid()) {
    throw new Error("Numéro de téléphone invalide");
  }
  return parsed.number;
}

export function buildWhatsAppLink(
  businessNumber: string,
  code: string,
  locale: "fr" | "ar" | "en" = "fr",
) {
  const normalizedBusiness = businessNumber.replace(/[^\d]/g, "");
  const message =
    locale === "ar"
      ? `Bonjour LODGE, mon code est ${code}`
      : locale === "en"
        ? `Bonjour LODGE, mon code est ${code}`
        : `Bonjour LODGE, mon code est ${code}`;

  return `https://wa.me/${normalizedBusiness}?text=${encodeURIComponent(message)}`;
}
