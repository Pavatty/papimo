import { BRAND } from "@/config/brand";
import { createAdminClient } from "@/data/supabase/admin";

const ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? BRAND.url;

export async function GET() {
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from("listing_images")
    .select("url, listing_id")
    .order("created_at", { ascending: false })
    .limit(5000);

  const { data: listings } = await supabase
    .from("listings")
    .select("id, slug, updated_at")
    .eq("status", "active")
    .not("slug", "is", null);
  const map = new Map((listings ?? []).map((l) => [l.id, l]));

  const entries = (rows ?? [])
    .map((row) => {
      const listing = map.get(row.listing_id);
      if (!listing) return null;
      return `
  <url>
    <loc>${ORIGIN}/fr/annonce/${listing.slug}</loc>
    <lastmod>${new Date(listing.updated_at).toISOString()}</lastmod>
    <image:image>
      <image:loc>${row.url}</image:loc>
    </image:image>
  </url>`;
    })
    .filter(Boolean)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
