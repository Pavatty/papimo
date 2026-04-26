import { defineRouting } from "next-intl/routing";

// Routage i18n : préfixe toujours visible (/fr, /ar, /en) — la racine / est gérée par le middleware
export const routing = defineRouting({
  locales: ["fr", "ar", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
});
