import { PriceDiagnosticTool } from "@/components/features/tools/PriceDiagnosticTool";

export default function DiagnosticPrixPage() {
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Diagnostic prix
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Analysez la cohérence d&#39;une annonce et obtenez des
          recommandations.
        </p>
        <div className="mt-6">
          <PriceDiagnosticTool />
        </div>
      </div>
    </main>
  );
}
