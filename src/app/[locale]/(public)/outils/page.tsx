import { ToolsIndexCards } from "@/components/features/tools/ToolsIndexCards";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export default async function OutilsIndexPage({ params }: Props) {
  const { locale } = await params;
  return (
    <main className="bg-paper min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-ink text-3xl font-bold">
          Outils LODGE
        </h1>
        <p className="text-ink-soft mt-2 text-sm">
          Estimation, crédit, frais, IA et diagnostics.
        </p>
        <div className="mt-8">
          <ToolsIndexCards locale={locale} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <Link
            href={`/${locale}/outils/inventaire-mobile`}
            className="text-bleu underline"
          >
            Inventaire mobile
          </Link>
          <Link
            href={`/${locale}/outils/diagnostic-prix`}
            className="text-bleu underline"
          >
            Diagnostic prix
          </Link>
        </div>
      </div>
    </main>
  );
}
