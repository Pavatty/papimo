import { Bot, Calculator, CreditCard, HousePlus } from "lucide-react";
import Link from "next/link";

const tools = [
  {
    href: "/outils/estimation",
    title: "Estimer mon bien",
    description: "Obtenez une fourchette marché instantanée.",
    icon: HousePlus,
  },
  {
    href: "/outils/simulateur-credit",
    title: "Simulateur de crédit",
    description: "Calculez mensualités, intérêts et échéancier.",
    icon: CreditCard,
  },
  {
    href: "/outils/frais-achat",
    title: "Calcul frais d'achat",
    description: "Transparence sur tous les frais d'acquisition.",
    icon: Calculator,
  },
  {
    href: "/outils/description-ia",
    title: "Améliorer description IA",
    description: "Optimisez vos annonces avec l'IA.",
    icon: Bot,
  },
] as const;

export function ToolsIndexCards({ locale }: { locale: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={`/${locale}${tool.href}`}
          className="border-line rounded-2xl border bg-white p-5 transition hover:shadow-sm"
        >
          <tool.icon className="text-bleu mb-3 h-6 w-6" />
          <h2 className="text-ink text-lg font-semibold">{tool.title}</h2>
          <p className="text-ink-soft mt-1 text-sm">{tool.description}</p>
        </Link>
      ))}
    </div>
  );
}
