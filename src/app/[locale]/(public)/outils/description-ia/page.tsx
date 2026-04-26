import { DescriptionAiTool } from "@/components/features/tools/DescriptionAiTool";

export default function DescriptionAiPage() {
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Améliorer description IA
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Améliorez un texte d&#39;annonce avec contexte local.
        </p>
        <div className="mt-6">
          <DescriptionAiTool />
        </div>
      </div>
    </main>
  );
}
