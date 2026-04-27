import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const tCommon = await getTranslations("common");
  const tagline =
    locale === "fr"
      ? tCommon("tagline.fr")
      : locale === "ar"
        ? tCommon("tagline.ar")
        : tCommon("tagline.en");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-ink text-3xl font-bold">
        {t("footer.faq")}
      </h1>
      <p className="text-ink-soft text-bleu mt-2 text-sm font-medium">
        {tagline}
      </p>
      <p className="text-ink-soft mt-3 text-lg leading-relaxed">
        {t("faq.pageIntro")}
      </p>
      <ul className="text-ink mt-8 list-disc space-y-3 pl-5 text-sm">
        <li>{t("faq.q1")}</li>
        <li>{t("faq.q2")}</li>
        <li>{t("faq.q3")}</li>
      </ul>
      <div className="mt-10 flex flex-wrap gap-3">
        <a
          className={cn(buttonVariants({ variant: "default" }), "inline-flex")}
          href="mailto:contact@papimo.com"
        >
          {t("footer.contact")}
        </a>
        <Link
          href="/outils"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-bleu/30 text-bleu",
          )}
        >
          {t("home.tools.title")}
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
          {t("faq.backHome")}
        </Link>
      </div>
    </main>
  );
}
