import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Chemin explicite vers la config i18n (détecté par défaut, mais on reste explicite pour la maintenance)
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* Options Next.js (images, expérimentation, etc.) */
};

export default withNextIntl(nextConfig);
