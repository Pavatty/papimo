"use client";

import { useState, useTransition } from "react";

import { submitListingReport } from "@/app/[locale]/(public)/listings/[slug]/actions";

type Props = {
  listingId: string;
};

const reasons = [
  "escroquerie",
  "doublon",
  "prix incohérent",
  "photos volées",
  "autre",
] as const;

export function ReportListingDialog({ listingId }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<(typeof reasons)[number]>("escroquerie");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-danger text-sm underline-offset-2 hover:underline"
      >
        Signaler cette annonce
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="border-line w-full max-w-md rounded-2xl border bg-white p-5">
            <h3 className="text-ink mb-3 text-lg font-semibold">
              Signaler l&#39;annonce
            </h3>
            <div className="space-y-3">
              <input type="hidden" value={listingId} />
              <select
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value as (typeof reasons)[number])
                }
                className="border-line w-full rounded-lg border px-3 py-2"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                className="border-line h-28 w-full rounded-lg border px-3 py-2"
                placeholder="Détails (optionnel)"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border-line rounded-lg border px-3 py-2 text-sm"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      await submitListingReport(listingId, reason, details);
                      setOpen(false);
                      setDetails("");
                    })
                  }
                  className="bg-corail rounded-lg px-3 py-2 text-sm font-medium text-white"
                  disabled={isPending}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
