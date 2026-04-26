import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import pwa from "next-pwa";

// Chemin explicite vers la config i18n (détecté par défaut, mais on reste explicite pour la maintenance)
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});
const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const withPWA = pwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Évite l’avertissement HMR Playwright (127.0.0.1) en dev
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.mapbox.com" },
    ],
  },
};

const composedConfig = withAnalyzer(withPWA(withNextIntl(withMDX(nextConfig))));

export default withSentryConfig(composedConfig, {
  sourcemaps: {
    disable: false,
  },
  telemetry: false,
});
