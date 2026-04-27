import type { MetadataRoute } from "next";

import { BRAND } from "@/config/brand";
import { createAdminClient } from "@/lib/supabase/admin";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? BRAND.url;

const staticPaths = [
  "",
  "/login",
  "/signup",
  "/pricing",
  "/outils",
  "/outils/estimation",
  "/outils/simulateur-credit",
  "/outils/frais-achat",
  "/outils/description-ia",
  "/outils/inventaire-mobile",
  "/outils/diagnostic-prix",
  "/legal/cgu",
  "/legal/cgv",
  "/legal/confidentialite",
  "/legal/cookies",
  "/legal/mentions-legales",
  "/achat",
  "/location",
  "/achat/appartement-tunis",
  "/location/villa-marsa",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const [{ data: listings }, { data: profiles }] = await Promise.all([
    supabase
      .from("listings")
      .select("slug, updated_at")
      .eq("status", "active")
      .not("slug", "is", null),
    supabase
      .from("profiles")
      .select("id, updated_at")
      .eq("role", "user")
      .not("full_name", "is", null),
  ]);

  const staticEntries: MetadataRoute.Sitemap = BRAND.supportedLocales.flatMap(
    (locale) =>
      staticPaths.map((path) => ({
        url: `${ORIGIN}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            BRAND.supportedLocales.map((l) => [l, `${ORIGIN}/${l}${path}`]),
          ),
        },
      })),
  );

  const listingEntries: MetadataRoute.Sitemap = (listings ?? []).flatMap(
    (listing) =>
      BRAND.supportedLocales.map((locale) => ({
        url: `${ORIGIN}/${locale}/annonce/${listing.slug}`,
        lastModified: new Date(listing.updated_at),
        alternates: {
          languages: Object.fromEntries(
            BRAND.supportedLocales.map(
              (l) => [l, `${ORIGIN}/${l}/annonce/${listing.slug}`] as const,
            ),
          ),
        },
      })),
  );

  const profileEntries: MetadataRoute.Sitemap = (profiles ?? []).flatMap(
    (profile) =>
      BRAND.supportedLocales.map((locale) => ({
        url: `${ORIGIN}/${locale}/profile/${profile.id}`,
        lastModified: new Date(profile.updated_at),
        alternates: {
          languages: Object.fromEntries(
            BRAND.supportedLocales.map(
              (l) => [l, `${ORIGIN}/${l}/profile/${profile.id}`] as const,
            ),
          ),
        },
      })),
  );

  return [...staticEntries, ...listingEntries, ...profileEntries];
}
