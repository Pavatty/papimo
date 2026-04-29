import { StarRating } from "@/components/features/sejours/StarRating";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string | null;
  response: string | null;
  response_at: string | null;
};

type Props = {
  reviews: ReviewItem[];
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ReviewsList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="text-encre/60 dark:text-creme/60 text-sm">
        Aucun avis pour le moment.
      </p>
    );
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / reviews.length;

  return (
    <div className="space-y-6">
      <div className="border-bordurewarm-tertiary flex items-center gap-3 border-b pb-3">
        <StarRating value={Math.round(average)} readOnly size="md" />
        <p className="text-encre dark:text-creme text-sm font-semibold">
          {average.toFixed(1)} / 5
        </p>
        <p className="text-encre/60 dark:text-creme/60 text-xs">
          ({reviews.length} avis)
        </p>
      </div>

      <ul className="space-y-5">
        {reviews.map((r) => (
          <li
            key={r.id}
            className="border-bordurewarm-tertiary border-b pb-5 last:border-0"
          >
            <div className="mb-2 flex items-center gap-2">
              <StarRating value={r.rating} readOnly size="sm" />
              <p className="text-encre dark:text-creme text-sm font-semibold">
                {r.reviewer_name ?? "Voyageur"}
              </p>
              <span className="text-encre/50 dark:text-creme/50 text-xs">
                · {formatDate(r.created_at)}
              </span>
            </div>
            {r.comment ? (
              <p className="text-encre/80 dark:text-creme/80 text-sm leading-relaxed whitespace-pre-line">
                {r.comment}
              </p>
            ) : null}

            {r.response ? (
              <div className="bg-sejours-sky/40 dark:bg-sejours-sky/15 mt-3 rounded-md p-3">
                <p className="text-sejours-turquoise mb-1 text-xs font-semibold tracking-wide uppercase">
                  Réponse de l&apos;hôte
                </p>
                <p className="text-encre/80 dark:text-creme/80 text-sm whitespace-pre-line">
                  {r.response}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
