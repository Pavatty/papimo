import Link from "next/link";

import {
  approveListingAction,
  boostListingForFreeAction,
  bulkListingStatusAction,
  rejectListingAction,
  softDeleteListingAction,
  suspendListingAction,
} from "@/app/[locale]/(admin)/admin/actions";
import { requireAdmin } from "@/lib/admin/guards";
import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["listings"]["Row"];

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    type?: string;
    category?: string;
    city?: string;
    page?: string;
  }>;
};

export default async function AdminListingsPage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin(locale);

  const page = Number(query.page ?? "1");
  const pageSize = 20;
  let req = supabase
    .from("listings")
    .select(
      "id, slug, title, city, type, category, status, created_at, owner_id",
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (query.status)
    req = req.eq("status", query.status as ListingRow["status"]);
  if (query.type) req = req.eq("type", query.type as ListingRow["type"]);
  if (query.category)
    req = req.eq("category", query.category as ListingRow["category"]);
  if (query.city) req = req.eq("city", query.city);
  if (query.q) req = req.or(`title.ilike.%${query.q}%,city.ilike.%${query.q}%`);

  const { data: listings } = await req;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-ink text-2xl font-bold">
        Gestion des annonces
      </h1>

      <form className="border-line grid gap-2 rounded-xl border bg-white p-4 md:grid-cols-6">
        <input
          name="q"
          defaultValue={query.q}
          placeholder="Recherche"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="status"
          defaultValue={query.status}
          placeholder="status"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="type"
          defaultValue={query.type}
          placeholder="type"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="category"
          defaultValue={query.category}
          placeholder="category"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="city"
          defaultValue={query.city}
          placeholder="ville"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <button className="bg-corail rounded-lg px-3 py-1.5 text-sm text-white">
          Filtrer
        </button>
      </form>

      <form
        action={async (formData) => {
          "use server";
          const ids = String(formData.get("ids") ?? "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
          const status = String(formData.get("bulkStatus") ?? "pending");
          await bulkListingStatusAction(locale, ids, status as never);
        }}
        className="border-line flex flex-wrap items-center gap-2 rounded-xl border bg-white p-3"
      >
        <input
          name="ids"
          placeholder="id1,id2,id3"
          className="border-line min-w-[280px] rounded-lg border px-2 py-1.5 text-sm"
        />
        <input
          name="bulkStatus"
          placeholder="active/rejected/expired"
          className="border-line rounded-lg border px-2 py-1.5 text-sm"
        />
        <button className="bg-bleu rounded-lg px-3 py-1.5 text-sm text-white">
          Bulk action
        </button>
      </form>

      <div className="border-line overflow-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-creme-pale text-ink-soft text-xs">
            <tr>
              <th className="px-3 py-2 text-left">Titre</th>
              <th className="px-3 py-2 text-left">Ville</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Catégorie</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(listings ?? []).map((listing) => (
              <tr key={listing.id} className="border-line border-t align-top">
                <td className="px-3 py-2">
                  <p className="text-ink font-medium">{listing.title}</p>
                  <p className="text-ink-soft text-xs">{listing.id}</p>
                </td>
                <td className="px-3 py-2">{listing.city}</td>
                <td className="px-3 py-2">{listing.type}</td>
                <td className="px-3 py-2">{listing.category}</td>
                <td className="px-3 py-2">{listing.status}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Link
                      href={`/${locale}/annonce/${listing.slug ?? listing.id}`}
                      className="border-line rounded border bg-white px-2 py-1"
                    >
                      Voir
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await approveListingAction(locale, listing.id);
                      }}
                    >
                      <button className="bg-green/15 text-green rounded px-2 py-1">
                        Approuver
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await rejectListingAction(
                          locale,
                          listing.id,
                          "Rejet admin",
                        );
                      }}
                    >
                      <button className="bg-danger/15 text-danger rounded px-2 py-1">
                        Rejeter
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await suspendListingAction(locale, listing.id);
                      }}
                    >
                      <button className="bg-creme rounded px-2 py-1">
                        Suspendre
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await boostListingForFreeAction(locale, listing.id);
                      }}
                    >
                      <button className="bg-bleu-pale text-bleu rounded px-2 py-1">
                        Booster
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await softDeleteListingAction(locale, listing.id);
                      }}
                    >
                      <button className="bg-creme rounded px-2 py-1">
                        Soft delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
