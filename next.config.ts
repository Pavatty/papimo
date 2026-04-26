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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.papimo.com" }],
        destination: "https://papimo.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io https://us.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://plausible.io https://us.i.posthog.com; frame-src https://api.mapbox.com; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

const composedConfig = withAnalyzer(withPWA(withNextIntl(withMDX(nextConfig))));

export default withSentryConfig(composedConfig, {
  sourcemaps: {
    disable: false,
  },
  telemetry: false,
});
