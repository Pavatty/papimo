import { InventoryMobileTool } from "@/components/features/tools/InventoryMobileTool";

export default function InventoryMobilePage() {
  return (
    <main className="bg-paper min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Inventaire mobile
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Outil PWA-friendly pour capturer les pièces du bien.
        </p>
        <div className="mt-6">
          <InventoryMobileTool />
        </div>
      </div>
    </main>
  );
}
