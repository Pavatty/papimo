import { FeesCalculator } from "@/components/features/tools/FeesCalculator";

export default function FeesPage() {
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Calcul frais d&#39;achat
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Détail transparent des frais selon pays.
        </p>
        <div className="mt-6">
          <FeesCalculator />
        </div>
      </div>
    </main>
  );
}
