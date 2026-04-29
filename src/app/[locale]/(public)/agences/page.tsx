import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { createAnonClient } from "@/data/supabase/server";

type ListingPreview = {
  id: string;
  title: string;
  city: string;
  slug: string | null;
  status: string;
  module_name: string | null;
};

type AgenceRow = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  account_type: string | null;
  publisher_type: string | null;
  listings: ListingPreview[];
};

type Params = { locale: string };

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AgencesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  const t = await getTranslations("AgencesPage");
  const supabase = createAnonClient();

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, full_name, company_name, account_type, publisher_type, listings:listings!owner_id(id, title, city, slug, status, module_name)",
    )
    .eq("publisher_type", "agency")
    .order("full_name", { ascending: true });

  const agences = (data ?? []) as unknown as AgenceRow[];

  return (
    <main className="bg-cream min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <header className="mb-10">
          <h1 className="text-ink mb-2 text-3xl font-medium">{t("title")}</h1>
          <p className="text-base text-gray-500">{t("subtitle")}</p>
        </header>

        {agences.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            {t("emptyState")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agences.map((agence) => {
              const activeListings = (agence.listings ?? []).filter(
                (l) => l.status === "active" && l.module_name === "immobilier",
              );
              const displayName =
                agence.company_name || agence.full_name || "Agence";

              return (
                <article
                  key={agence.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="bg-pro-50 text-pro flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                      {getInitials(displayName) || "•"}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-ink text-base leading-tight font-medium">
                        {displayName}
                      </h2>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {activeListings.length > 0
                          ? `${activeListings.length} ${t("listingsCount")}`
                          : t("noListings")}
                      </p>
                    </div>
                  </div>

                  {activeListings.length > 0 ? (
                    <div className="mb-4 space-y-2">
                      {activeListings.slice(0, 2).map((l) => (
                        <Link
                          key={l.id}
                          href={`/annonce/${l.slug ?? l.id}`}
                          locale={locale}
                          className="hover:text-ink line-clamp-1 block text-xs text-gray-500"
                        >
                          • {l.title} — {l.city}
                        </Link>
                      ))}
                    </div>
                  ) : null}

                  <Link
                    href={`/profile/${agence.id}`}
                    locale={locale}
                    className="text-lodge inline-block text-sm font-medium hover:underline"
                  >
                    {t("viewProfile")} →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
