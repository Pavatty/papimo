"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useRouter } from "next/navigation";

import { PublishStepper } from "./PublishStepper";
import type { PublishFormState } from "./types";

type Props = {
  initialData: PublishFormState;
  preferredCurrency?: "TND" | "EUR" | "USD" | "MAD" | "DZD";
  watermarkEnabled?: boolean;
};

export function PublishPageWithStepper({
  initialData,
  preferredCurrency,
  watermarkEnabled = false,
}: Props) {
  const t = useTranslations("publish");
  const tPage = useTranslations("publishPage");
  const locale = useLocale();
  const router = useRouter();
  const [showQuitModal, setShowQuitModal] = useState(false);

  const openQuit = () => setShowQuitModal(true);

  return (
    <>
      <div className="relative mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-ink text-3xl font-bold">
            {t("breadcrumb.publish")}
          </h1>
          <p className="text-ink-soft mt-1 text-sm">{tPage("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openQuit}
          className="hover:border-LODGE-coral hover:text-LODGE-coral absolute top-4 right-4 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition"
        >
          {t("cancelAndQuit")}
        </button>
      </div>

      <PublishStepper
        initialData={initialData}
        {...(preferredCurrency ? { preferredCurrency } : {})}
        onQuitRequest={openQuit}
        watermarkEnabled={watermarkEnabled}
      />

      {showQuitModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowQuitModal(false)}
        >
          <div
            className="mx-4 max-w-md rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-xl font-bold">{t("quitModal.title")}</h3>
            <p className="mb-6 text-gray-600">{t("quitModal.message")}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowQuitModal(false)}
                className="bg-LODGE-coral hover:bg-LODGE-coral-dark rounded-xl px-5 py-2.5 font-semibold text-white transition"
              >
                {t("quitModal.continue")}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${locale}`)}
                className="rounded-xl border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:border-gray-400"
              >
                {t("quitModal.quit")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
