import { BRAND } from "./brand";

export const siteConfig = {
  name: BRAND.name,
  url: BRAND.url,
  canonical: {
    origin: BRAND.url,
    localePath: (locale: (typeof BRAND.supportedLocales)[number]) =>
      `${BRAND.url}/${locale}`,
  },
} as const;
