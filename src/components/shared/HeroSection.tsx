import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Bandeau d’accueil : ton éditorial + CTA (corail = primaire, outline = secondaire)
export async function HeroSection() {
  const t = await getTranslations();

  return (
    <section
      className="flex flex-col items-center px-4 pt-16 pb-20 text-center md:px-6 md:pt-24"
      aria-labelledby="hero-heading"
    >
      <h1
        id="hero-heading"
        className="font-heading text-encre max-w-4xl text-4xl font-bold tracking-tight text-balance md:text-5xl"
      >
        {t.rich("home.hero.headline", {
          bleu: (chunks) => <span className="text-bleu">{chunks}</span>,
          corail: (chunks) => <span className="text-corail">{chunks}</span>,
        })}
      </h1>
      <p className="text-encre/70 mt-6 max-w-2xl text-lg text-pretty md:text-xl">
        {t("home.hero.subline")}
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/publish"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-11 min-w-[12rem] px-6",
          )}
        >
          {t("navigation.publishMyProperty")}
        </Link>
        <Link
          href="/search"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-bleu/30 text-bleu min-h-11 min-w-[12rem]",
          )}
        >
          {t("navigation.discover")}
        </Link>
      </div>
    </section>
  );
}
