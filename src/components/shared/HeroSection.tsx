import { getTranslations } from "next-intl/server";

import { HeroSearchBar } from "@/components/home/HeroSearchBar";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function HeroSection() {
  const t = await getTranslations();

  return (
    <section
      className="flex flex-col items-center px-4 pt-12 pb-12 text-center md:px-6 md:pt-16 md:pb-16"
      aria-labelledby="hero-heading"
    >
      <h1
        id="hero-heading"
        className="text-encre dark:text-creme max-w-4xl font-serif text-3xl leading-tight font-medium tracking-tight text-balance md:text-4xl"
      >
        {t.rich("home.hero.headline", {
          bleu: (chunks) => <span className="text-bleu">{chunks}</span>,
          corail: (chunks) => <span className="text-corail">{chunks}</span>,
        })}
      </h1>
      <p className="text-encre/70 dark:text-creme/70 mt-4 max-w-2xl text-base text-pretty md:text-lg">
        {t("home.hero.subline")}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/publish"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "min-h-12 min-w-[12rem] px-8 text-base",
          )}
        >
          {t("navigation.publishMyProperty")}
        </Link>
        <Link
          href="/search"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-bleu/30 text-bleu min-h-12 min-w-[12rem] px-8 text-base",
          )}
        >
          {t("navigation.discover")}
        </Link>
      </div>
      <HeroSearchBar />
    </section>
  );
}
