import {
  Bath,
  Briefcase,
  Building2,
  GraduationCap,
  Home as HomeIcon,
  MapPin,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export async function QuickFilters() {
  const t = await getTranslations("home.quickFilters");
  const locale = await getLocale();

  const filters = [
    {
      icon: HomeIcon,
      label: t("studios"),
      href: "/search?type=studio&trans=rent",
    },
    { icon: Building2, label: t("villas"), href: "/search?type=villa" },
    { icon: MapPin, label: t("seaview"), href: "/search?q=mer" },
    {
      icon: Briefcase,
      label: t("commercial"),
      href: "/search?type=commercial",
    },
    { icon: Bath, label: t("furnished"), href: "/search?q=meuble" },
    {
      icon: GraduationCap,
      label: t("students"),
      href: "/search?type=studio",
    },
  ];

  return (
    <section
      className="py-8"
      aria-labelledby={`${locale}-quickfilters-heading`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <h2
          id={`${locale}-quickfilters-heading`}
          className="text-encre dark:text-creme mb-4 font-serif text-2xl"
        >
          {t("title")}
        </h2>
        <ul className="flex gap-2 overflow-x-auto pb-2">
          {filters.map(({ icon: Icon, label, href }) => (
            <li key={label} className="flex-shrink-0">
              <Link
                href={href}
                className="border-bordurewarm-tertiary bg-blanc-casse text-encre dark:border-encre/20 dark:bg-encre/95 dark:text-creme hover:border-bleu hover:text-bleu focus-visible:ring-bleu inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <Icon className="text-bleu size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
