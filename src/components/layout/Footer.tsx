import { ChevronDown } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { BrandWordmark } from "@/components/layout/BrandWordmark";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Link } from "@/i18n/navigation";
import { IS_BETA } from "@/lib/beta";

const PRICING_HIDDEN = IS_BETA;

type IconProps = { className?: string };

const XLogo = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2H21.5l-7.49 8.554L23 22h-6.79l-5.32-6.957L4.8 22H1.546l8.011-9.156L1 2h6.957l4.812 6.36L18.244 2Zm-1.196 18.045h1.84L7.05 3.864H5.082l11.966 16.181Z" />
  </svg>
);

const InstagramLogo = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
  </svg>
);

const LinkedinLogo = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
  </svg>
);

const FacebookLogo = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    className={className}
  >
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82V14.706h-3.13v-3.622h3.13V8.41c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.592 1.323-1.324V1.325C24 .593 23.408 0 22.675 0z" />
  </svg>
);

export async function Footer() {
  const t = await getTranslations();
  const locale = await getLocale();
  const year = new Date().getFullYear();

  const tagline =
    locale === "fr"
      ? t("common.tagline.fr")
      : locale === "ar"
        ? t("common.tagline.ar")
        : t("common.tagline.en");

  const discoverLinks = [
    { href: "/search", label: t("footer.searchLink") },
    { href: "/achat", label: t("navigation.buy") },
    { href: "/location", label: t("navigation.rent") },
    { href: "/outils", label: t("navigation.tools") },
  ];

  const helpLinks: Array<
    { href: string; label: string } | { mailto: string; label: string }
  > = [
    { href: "/faq", label: t("footer.faq") },
    { mailto: "mailto:contact@papimo.com", label: t("footer.contact") },
    ...(!PRICING_HIDDEN
      ? [{ href: "/pricing", label: t("footer.pricingLink") }]
      : []),
  ];

  const legalLinks = [
    { href: "/legal", label: t("footer.legalHub") },
    { href: "/legal/cgu", label: t("legal.cgu") },
    { href: "/legal/cgv", label: t("legal.cgv") },
    { href: "/legal/confidentialite", label: t("legal.privacy") },
    { href: "/legal/cookies", label: t("legal.cookies") },
    { href: "/legal/mentions-legales", label: t("legal.notices") },
  ];

  const socials = [
    { href: "#", label: "X (Twitter)", Icon: XLogo },
    { href: "#", label: "Instagram", Icon: InstagramLogo },
    { href: "#", label: "LinkedIn", Icon: LinkedinLogo },
    { href: "#", label: "Facebook", Icon: FacebookLogo },
  ];

  return (
    <AnimatedSection
      className="bg-vert-fonce border-t border-white/15 py-12 text-white md:py-16"
      aria-label="Pied de page"
    >
      <div className="max-w-container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-4 md:gap-10">
          {/* Col 1 — Marque (always open on mobile) */}
          <details
            open
            className="group border-b border-white/15 pb-3 md:border-none md:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-white md:cursor-default md:font-semibold">
              <Link
                href="/"
                aria-label={t("common.brandName")}
                className="inline-flex"
              >
                <BrandWordmark size="footer" />
              </Link>
              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180 md:hidden"
                aria-hidden="true"
              />
            </summary>
            <div className="mt-3 space-y-2">
              <p className="font-serif text-lg text-white md:text-xl">
                {tagline}
              </p>
              <p className="text-sm leading-relaxed text-white/75">
                {t("footer.columnAboutText")}
              </p>
              <a
                href="mailto:contact@lodge.tn"
                className="text-vert-clair focus-visible:ring-vert-clair inline-flex text-sm font-medium transition hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                contact@lodge.tn
              </a>
            </div>
          </details>

          {/* Col 2 — Discover */}
          <details className="group border-b border-white/15 pb-3 md:border-none md:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-white uppercase md:cursor-default">
              {t("footer.columnDiscover")}
              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180 md:hidden"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-vert-clair focus-visible:ring-vert-clair rounded-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {/* Col 3 — Help & Legal merged for compactness on desktop, separated mobile */}
          <details className="group border-b border-white/15 pb-3 md:border-none md:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-white uppercase md:cursor-default">
              {t("footer.columnLegal")}
              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180 md:hidden"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {helpLinks.map((link) => (
                <li key={"href" in link ? link.href : link.mailto}>
                  {"mailto" in link ? (
                    <a
                      href={link.mailto}
                      className="hover:text-vert-clair focus-visible:ring-vert-clair rounded-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="hover:text-vert-clair focus-visible:ring-vert-clair rounded-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-vert-clair focus-visible:ring-vert-clair rounded-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>

          {/* Col 4 — Social */}
          <details className="group border-b border-white/15 pb-3 md:border-none md:pb-0">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold tracking-wide text-white uppercase md:cursor-default">
              Réseaux
              <ChevronDown
                className="size-4 transition-transform group-open:rotate-180 md:hidden"
                aria-hidden="true"
              />
            </summary>
            <ul className="mt-3 flex flex-wrap items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="hover:text-vert-clair hover:border-vert-clair/40 focus-visible:ring-vert-clair inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/70">
            {t("navigation.languages.fr")} · {t("navigation.languages.ar")} ·{" "}
            {t("navigation.languages.en")}
          </p>
          <p className="text-xs text-white/70">
            © {year} {t("common.brandName")} — {tagline}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
