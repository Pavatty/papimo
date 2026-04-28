import { getLocale, getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { getHomeSectionByKey } from "@/data/repositories/cms-home";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type HeroContent = {
  headline_fr?: { line1: string; line2: string };
  headline_ar?: { line1: string; line2: string };
  headline_en?: { line1: string; line2: string };
  subline_fr?: string;
  subline_ar?: string;
  subline_en?: string;
  color_line1?: string;
  color_line2?: string;
  background_texture?: string;
  background_opacity?: string;
};

const FALLBACK_HEADLINE = {
  fr: {
    line1: "Là où votre projet prend vie,",
    line2: "entre particuliers.",
  },
  ar: { line1: "حيث يأخذ مشروعك حياته،", line2: "بين الأفراد." },
  en: {
    line1: "Where your project comes to life,",
    line2: "between individuals.",
  },
} as const;

const FALLBACK_SUBLINE = {
  fr: "Vendez, achetez et louez sans frais d’agence.",
  ar: "بيعوا، اشتروا واستأجروا بدون عمولات وكالة.",
  en: "Sell, buy and rent with no agency fees.",
} as const;

export async function HeroSection() {
  const section = await getHomeSectionByKey("hero");
  const locale = (await getLocale()) as "fr" | "ar" | "en";
  const t = await getTranslations();

  if (section && !section.active) return null;

  const content = (section?.content_json ?? {}) as HeroContent;
  const headline =
    content[`headline_${locale}` as const] ?? FALLBACK_HEADLINE[locale];
  const subline =
    content[`subline_${locale}` as const] ?? FALLBACK_SUBLINE[locale];
  // Line1 = couleur "encre" qui swap blanc/noir selon le thème via la
  // CSS var --color-encre. Si l'admin a écrit "encre" dans content_json,
  // on bascule sur la classe Tailwind text-encre. Sinon, on respecte la
  // valeur hex DB (au prix d'un contraste fixe).
  const adminColorLine1 = content.color_line1;
  const adminColorLine2 = content.color_line2;
  const useEncreClass =
    !adminColorLine1 ||
    adminColorLine1 === "encre" ||
    adminColorLine1.toUpperCase() === "#1A1A1A";
  const colorLine1Hex = adminColorLine1 ?? "#1A1A1A";
  const colorLine2Hex = adminColorLine2 ?? "#1B5E3F";
  const useVertClass =
    !adminColorLine2 ||
    adminColorLine2 === "vert" ||
    adminColorLine2.toUpperCase() === "#1B5E3F";
  const showTexture = content.background_texture === "true";
  const textureOpacity = parseFloat(content.background_opacity ?? "0.06");

  return (
    <section
      className="bg-creme dark:bg-creme relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {showTexture ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(27,94,63,0.18) 0px, transparent 320px), radial-gradient(circle at 80% 70%, rgba(27,94,63,0.14) 0px, transparent 280px), linear-gradient(135deg, transparent 0%, rgba(27,94,63,0.04) 100%)",
            opacity: Math.min(1, textureOpacity * 6),
          }}
        />
      ) : null}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 pb-12 text-center md:px-6 md:pt-16 md:pb-16">
        <h1
          id="hero-heading"
          className="max-w-4xl font-sans text-3xl leading-[1.1] font-extrabold tracking-[-0.04em] md:text-5xl"
        >
          <span
            className={useEncreClass ? "text-encre block" : "block"}
            {...(useEncreClass ? {} : { style: { color: colorLine1Hex } })}
          >
            {headline.line1}
          </span>
          <span
            className={useVertClass ? "text-vert block" : "block"}
            {...(useVertClass ? {} : { style: { color: colorLine2Hex } })}
          >
            {headline.line2}
          </span>
        </h1>
        <p className="text-encre/70 mt-4 max-w-2xl text-base font-medium md:text-lg">
          {subline}
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
              "border-vert/30 text-vert min-h-12 min-w-[12rem] px-8 text-base",
            )}
          >
            {t("navigation.discover")}
          </Link>
        </div>
      </div>
    </section>
  );
}
