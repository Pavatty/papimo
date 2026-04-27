"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

import { PublishStepper } from "./PublishStepper";
import type { PublishFormState } from "./types";

type Props = {
  initialData: PublishFormState;
  preferredCurrency?: "TND" | "EUR" | "USD" | "MAD" | "DZD";
};

export function PublishPageWithStepper({
  initialData,
  preferredCurrency,
}: Props) {
  const t = useTranslations("publishPage");
  const router = useRouter();
  const [quitOpen, setQuitOpen] = useState(false);

  const openQuit = () => setQuitOpen(true);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-ink text-3xl font-bold">
            {t("title")}
          </h1>
          <p className="text-ink-soft mt-1 text-sm">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openQuit}
          className="border-line text-ink shrink-0 rounded-xl border bg-white px-4 py-2.5 text-sm"
        >
          {t("cancelAndLeave")}
        </button>
      </div>

      <PublishStepper
        initialData={initialData}
        preferredCurrency={preferredCurrency}
        onQuitRequest={openQuit}
      />

      {quitOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-quit-title"
        >
          <div className="border-line w-full max-w-md rounded-2xl border bg-white p-5 shadow-lg">
            <h2
              id="publish-quit-title"
              className="text-ink mb-2 text-lg font-semibold"
            >
              {t("modalTitle")}
            </h2>
            <p className="text-ink-soft mb-6 text-sm">{t("modalBody")}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuitOpen(false);
                  router.push("/");
                }}
                className="border-line text-ink rounded-xl border bg-white px-4 py-2.5 text-sm font-medium"
              >
                {t("quit")}
              </button>
              <button
                type="button"
                onClick={() => setQuitOpen(false)}
                className="bg-corail rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              >
                {t("continuePublish")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
