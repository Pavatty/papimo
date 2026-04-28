import { MessageCircle, Shield, Sparkles, TrendingDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { AnimatedSection } from "@/components/shared/AnimatedSection";

export async function PourquoiPapimo() {
  const t = await getTranslations("home.why");
  const benefits = [
    {
      icon: TrendingDown,
      title: t("savings.title"),
      desc: t("savings.desc"),
      highlight: t("savings.highlight"),
    },
    {
      icon: MessageCircle,
      title: t("direct.title"),
      desc: t("direct.desc"),
      highlight: t("direct.highlight"),
    },
    {
      icon: Shield,
      title: t("trust.title"),
      desc: t("trust.desc"),
      highlight: t("trust.highlight"),
    },
    {
      icon: Sparkles,
      title: t("free.title"),
      desc: t("free.desc"),
      highlight: t("free.highlight"),
    },
  ];

  return (
    <AnimatedSection
      className="bg-creme-foncee dark:bg-encre/40 py-16"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2
            id="why-heading"
            className="text-encre dark:text-creme mb-3 font-serif text-3xl md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-encre/70 dark:text-creme/70 mx-auto max-w-2xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, desc, highlight }) => (
            <article
              key={title}
              className="border-bordurewarm-tertiary bg-blanc-casse dark:border-encre/20 dark:bg-encre/95 rounded-card hover:shadow-card border p-6 transition"
            >
              <div className="bg-bleu/10 text-bleu rounded-control dark:bg-bleu/20 mb-4 flex size-12 items-center justify-center">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <p className="text-corail mb-1 font-serif text-2xl">
                {highlight}
              </p>
              <h3 className="text-encre dark:text-creme mb-1 font-semibold">
                {title}
              </h3>
              <p className="text-encre/70 dark:text-creme/70 text-sm">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
