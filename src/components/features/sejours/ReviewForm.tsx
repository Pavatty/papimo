"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createReview } from "@/app/actions/reviews";
import { StarRating } from "@/components/features/sejours/StarRating";

type Props = {
  bookingId: string;
  reviewType: "guest_to_host" | "host_to_guest";
  redirectTo: string;
};

const SUB_RATING_FIELDS_GUEST: Array<{
  key:
    | "cleanlinessRating"
    | "communicationRating"
    | "accuracyRating"
    | "locationRating"
    | "valueRating";
  label: string;
}> = [
  { key: "cleanlinessRating", label: "Propreté" },
  { key: "communicationRating", label: "Communication" },
  { key: "accuracyRating", label: "Conformité de l'annonce" },
  { key: "locationRating", label: "Localisation" },
  { key: "valueRating", label: "Rapport qualité-prix" },
];

const SUB_RATING_FIELDS_HOST: Array<{
  key: "communicationRating" | "cleanlinessRating";
  label: string;
}> = [
  { key: "communicationRating", label: "Communication" },
  { key: "cleanlinessRating", label: "Respect des lieux" },
];

export function ReviewForm({ bookingId, reviewType, redirectTo }: Props) {
  const [rating, setRating] = useState(0);
  const [subRatings, setSubRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const fields =
    reviewType === "guest_to_host"
      ? SUB_RATING_FIELDS_GUEST
      : SUB_RATING_FIELDS_HOST;

  const canSubmit = rating > 0 && comment.trim().length >= 10 && !pending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setError(null);
        startTransition(async () => {
          const result = await createReview({
            bookingId,
            reviewType,
            rating,
            ...(subRatings.cleanlinessRating
              ? { cleanlinessRating: subRatings.cleanlinessRating }
              : {}),
            ...(subRatings.communicationRating
              ? { communicationRating: subRatings.communicationRating }
              : {}),
            ...(subRatings.accuracyRating
              ? { accuracyRating: subRatings.accuracyRating }
              : {}),
            ...(subRatings.locationRating
              ? { locationRating: subRatings.locationRating }
              : {}),
            ...(subRatings.valueRating
              ? { valueRating: subRatings.valueRating }
              : {}),
            comment: comment.trim(),
            ...(privateFeedback.trim()
              ? { privateFeedback: privateFeedback.trim() }
              : {}),
          });
          if (result.ok) {
            router.push(redirectTo);
          } else {
            setError(result.error);
          }
        });
      }}
      className="space-y-6"
    >
      <div>
        <label className="text-encre dark:text-creme mb-2 block text-sm font-semibold">
          Note globale
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          size="lg"
          ariaLabel="Note globale"
        />
      </div>

      <fieldset className="border-bordurewarm-tertiary rounded-md border p-4">
        <legend className="text-encre dark:text-creme px-2 text-sm font-semibold">
          Détails
        </legend>
        <div className="space-y-3">
          {fields.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-encre/80 dark:text-creme/80 text-sm">
                {f.label}
              </span>
              <StarRating
                value={subRatings[f.key] ?? 0}
                onChange={(n) =>
                  setSubRatings((prev) => ({ ...prev, [f.key]: n }))
                }
                size="sm"
                ariaLabel={f.label}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="review-comment"
          className="text-encre dark:text-creme mb-2 block text-sm font-semibold"
        >
          Commentaire public
          <span className="text-encre/60 ml-1 text-xs font-normal">
            (10 caractères min, visible sur l&apos;annonce)
          </span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
          placeholder="Ce qui vous a plu, ce qui pourrait être amélioré..."
        />
      </div>

      <div>
        <label
          htmlFor="review-private"
          className="text-encre dark:text-creme mb-2 block text-sm font-semibold"
        >
          Retour privé
          <span className="text-encre/60 ml-1 text-xs font-normal">
            (optionnel, visible uniquement par l&apos;
            {reviewType === "guest_to_host" ? "hôte" : "voyageur"})
          </span>
        </label>
        <textarea
          id="review-private"
          value={privateFeedback}
          onChange={(e) => setPrivateFeedback(e.target.value)}
          maxLength={2000}
          rows={3}
          className="border-bordurewarm-tertiary text-encre dark:bg-encre/30 dark:text-creme focus:border-sejours-turquoise w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none"
        />
      </div>

      {error ? (
        <p className="bg-coeur-soft text-coeur rounded-md px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-sejours-coral hover:bg-sejours-coral-hover focus-visible:ring-sejours-coral inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}
