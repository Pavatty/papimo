import Image from "next/image";

import { logAuditEvent } from "@/lib/audit/log";
import { requireAdmin } from "@/lib/admin/guards";
import type { Enums } from "@/types/database";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminAdsPage({ params }: Props) {
  const { locale } = await params;
  const { supabase } = await requireAdmin(locale);
  const { data: campaigns } = await supabase
    .from("ad_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">
        Campagnes pubs
      </h1>
      <form
        action={async (formData) => {
          "use server";
          const { supabase } = await requireAdmin(locale);
          const advertiser_name = String(formData.get("advertiser_name") ?? "");
          const slot = String(
            formData.get("slot") ?? "home_hero",
          ) as Enums<"ad_slot">;
          const target_url = String(formData.get("target_url") ?? "");
          if (!advertiser_name) return;
          const now = new Date();
          const end = new Date(now);
          end.setDate(end.getDate() + 30);
          await supabase.from("ad_campaigns").insert({
            advertiser_name,
            slot,
            target_url: target_url || null,
            starts_at: now.toISOString(),
            ends_at: end.toISOString(),
            country_codes: ["TN"],
          });
          await logAuditEvent({
            action: "admin_create_campaign",
            targetType: "ad_campaign",
            afterData: { advertiser_name, slot },
          });
        }}
        className="border-line flex flex-wrap gap-2 rounded-xl border bg-white p-4"
      >
        <input
          name="advertiser_name"
          placeholder="Annonceur"
          className="border-line rounded border px-2 py-1.5 text-sm"
        />
        <input
          name="slot"
          placeholder="home_hero/listing_top/..."
          className="border-line rounded border px-2 py-1.5 text-sm"
        />
        <input
          name="target_url"
          placeholder="URL cible"
          className="border-line min-w-[280px] rounded border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded px-3 py-1.5 text-sm text-white">
          Créer campagne
        </button>
      </form>
      <div className="grid gap-3 lg:grid-cols-2">
        {(campaigns ?? []).map((c) => (
          <article
            key={c.id}
            className="border-line rounded-xl border bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-ink font-semibold">{c.advertiser_name}</p>
                <p className="text-ink-soft text-xs">
                  {c.slot} • {c.country_codes.join(", ")}
                </p>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-xs ${c.is_active ? "bg-green/15 text-green" : "bg-creme text-ink-soft"}`}
              >
                {c.is_active ? "active" : "inactive"}
              </span>
            </div>
            <p className="text-ink-soft mt-2 text-sm">
              Stats: {c.clicks} clics / {c.impressions} impressions
            </p>
            {c.image_url ? (
              <Image
                src={c.image_url}
                alt={c.alt_text ?? "preview"}
                width={720}
                height={224}
                className="mt-3 h-28 w-full rounded object-cover"
              />
            ) : (
              <div className="bg-creme-pale mt-3 h-28 rounded" />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
