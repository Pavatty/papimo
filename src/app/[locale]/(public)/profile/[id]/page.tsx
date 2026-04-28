import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/data/supabase/server";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", id)
    .single();
  const name = data?.full_name ?? "Profil";
  return buildPageMetadata({
    locale,
    pathnameWithoutLocale: `/profile/${id}`,
    title: `${name} | LODGE`,
    description: `Profil public de ${name} sur LODGE.`,
  });
}

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: profile }, { data: listings }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id,full_name,avatar_url,is_verified,created_at")
      .eq("id", id)
      .single(),
    supabase
      .from("listings")
      .select("id,title,slug,status,city")
      .eq("owner_id", id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(12),
  ]);
  if (!profile) notFound();

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-ink text-3xl font-bold">
          {profile.full_name ?? "Profil utilisateur"}
        </h1>
        {profile.is_verified ? (
          <span className="bg-sejours-turquoise-light text-sejours-turquoise inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Vérifié
          </span>
        ) : null}
      </div>
      <p className="text-ink-soft mt-2 text-sm">
        Membre depuis {new Date(profile.created_at).toLocaleDateString("fr-FR")}
      </p>
      <section className="mt-6 space-y-2">
        {(listings ?? []).map((listing) => (
          <article
            key={listing.id}
            className="border-line rounded-xl border bg-white p-3"
          >
            <p className="text-ink font-medium">{listing.title}</p>
            <p className="text-ink-soft text-xs">{listing.city}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
