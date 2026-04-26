"use client";

import { Loader2, MessageCircle } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { sendWhatsAppCode, verifyWhatsAppCode } from "@/lib/auth/actions";
import { buildWhatsAppLink, generateOtpCode } from "@/lib/auth/whatsapp";

type Step = 1 | 2 | 3;

export function WhatsAppFlow() {
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [whatsAppLink, setWhatsAppLink] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const otpCode = useMemo(() => otpDigits.join(""), [otpDigits]);

  const onSendCode = () => {
    setError(null);
    startTransition(async () => {
      const result = await sendWhatsAppCode(phone);
      if (!result.ok) {
        const fallbackCode = generateOtpCode();
        const fallbackPhone = phone.replace(/\s+/g, "");
        const businessNumber =
          process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER ?? "";
        setPhone(fallbackPhone);
        setGeneratedCode(fallbackCode);
        setWhatsAppLink(buildWhatsAppLink(businessNumber, fallbackCode, "fr"));
        setError(
          result.error ??
            "Mode dégradé actif : vérification locale uniquement.",
        );
        setStep(2);
        return;
      }

      setPhone(result.phone);
      setGeneratedCode(result.code);
      setWhatsAppLink(result.whatsappLink);
      setStep(2);
    });
  };

  const onVerify = () => {
    setError(null);
    startTransition(async () => {
      const result = await verifyWhatsAppCode(phone, otpCode);
      if (!result.ok) {
        setError(result.error ?? "Code invalide");
        setAttemptsRemaining(result.attemptsRemaining ?? null);
        return;
      }
      window.location.href = "/fr/dashboard";
    });
  };

  return (
    <section className="border-line rounded-2xl border bg-white p-5">
      <h3 className="font-display text-ink text-lg font-semibold">
        Continuer avec WhatsApp
      </h3>

      {step === 1 ? (
        <div className="mt-4 space-y-3">
          <label
            className="text-ink text-sm font-medium"
            htmlFor="whatsapp-phone"
          >
            Numéro de téléphone
          </label>
          <div className="border-line rounded-xl border px-3 py-2">
            <PhoneInput
              id="whatsapp-phone"
              defaultCountry="TN"
              international
              withCountryCallingCode
              value={phone}
              onChange={(value) => setPhone(value ?? "")}
              className="text-sm"
            />
          </div>
          <button
            type="button"
            onClick={onSendCode}
            disabled={isPending || phone.length < 8}
            className="border-line text-ink inline-flex w-full items-center justify-center rounded-xl border bg-white px-4 py-3 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageCircle className="mr-2 h-4 w-4" />
            )}
            Continuer avec WhatsApp
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="mt-4 space-y-4">
          <p className="text-ink-soft text-sm">
            Copie ce code puis ouvre WhatsApp pour l&#39;envoyer manuellement.
          </p>
          <div className="flex justify-center gap-2">
            {generatedCode.split("").map((digit, index) => (
              <div
                key={`${digit}-${index}`}
                className="border-line bg-creme-pale text-ink rounded-lg border px-3 py-2 font-mono text-2xl font-semibold"
              >
                {digit}
              </div>
            ))}
          </div>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noreferrer"
            className="bg-corail inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white"
          >
            Ouvrir WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="border-line text-ink w-full rounded-xl border bg-white px-4 py-3 text-sm"
          >
            J&#39;ai envoyé le code, vérifier
          </button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="mt-4 space-y-3">
          <p className="text-ink-soft text-sm">
            Saisis le code reçu pour valider.
          </p>
          <div className="flex justify-center gap-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                value={digit}
                onChange={(event) => {
                  const next = event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 1);
                  setOtpDigits((previous) => {
                    const copy = [...previous];
                    copy[index] = next;
                    return copy;
                  });
                }}
                inputMode="numeric"
                maxLength={1}
                className="border-line focus:border-bleu h-11 w-11 rounded-lg border text-center text-lg font-semibold outline-none"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onVerify}
            disabled={isPending || otpCode.length !== 6}
            className="bg-corail inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Vérifier le code
          </button>
          {attemptsRemaining != null ? (
            <p className="text-ink-soft text-xs">
              Tentatives restantes&#58; {attemptsRemaining}
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
    </section>
  );
}
