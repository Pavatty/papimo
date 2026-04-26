import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

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
    title: `${name} | papimo`,
    description: `Profil public de ${name} sur papimo.`,
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
      <h1 className="text-ink text-3xl font-bold">
        {profile.full_name ?? "Profil utilisateur"}
      </h1>
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
