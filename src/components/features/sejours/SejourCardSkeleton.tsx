export function SejourCardSkeleton() {
  return (
    <div className="bg-blanc-casse dark:bg-encre/95 sejours-shadow-sm overflow-hidden rounded-2xl">
      <div className="sejours-skeleton aspect-[4/3]" aria-hidden="true" />
      <div className="space-y-3 p-4">
        <div className="sejours-skeleton h-3 w-24 rounded" aria-hidden="true" />
        <div className="space-y-2">
          <div
            className="sejours-skeleton h-4 w-full rounded"
            aria-hidden="true"
          />
          <div
            className="sejours-skeleton h-4 w-2/3 rounded"
            aria-hidden="true"
          />
        </div>
        <div className="border-bordurewarm-tertiary flex items-center justify-between border-t pt-3">
          <div
            className="sejours-skeleton h-3 w-16 rounded"
            aria-hidden="true"
          />
          <div
            className="sejours-skeleton h-6 w-24 rounded"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
