import { CreditSimulator } from "@/components/features/tools/CreditSimulator";

export default function CreditSimulatorPage() {
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Simulateur de crédit
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Mensualités, intérêts cumulés et échéancier annuel.
        </p>
        <div className="mt-6">
          <CreditSimulator />
        </div>
      </div>
    </main>
  );
}
