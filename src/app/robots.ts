import type { MetadataRoute } from "next";

import { BRAND } from "@/config/brand";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? BRAND.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/fr/admin", "/ar/admin", "/en/admin"],
      },
    ],
    sitemap: [`${ORIGIN}/sitemap.xml`, `${ORIGIN}/sitemap-images.xml`],
    host: ORIGIN,
  };
}
