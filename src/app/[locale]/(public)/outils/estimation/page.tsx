import { EstimationWizard } from "@/components/features/tools/EstimationWizard";

export default function EstimationPage() {
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Estimer mon bien
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Wizard en 5 étapes basé sur le price index papimo.
        </p>
        <div className="mt-6">
          <EstimationWizard />
        </div>
      </div>
    </main>
  );
}
