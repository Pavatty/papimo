import { redirect } from "next/navigation";

import { PublishStepper } from "@/components/features/publish/PublishStepper";
import type { PublishFormState } from "@/components/features/publish/types";
import { createClient } from "@/lib/supabase/server";

function buildInitialDraft(): PublishFormState {
  return {
    title: "",
    description: "",
    price: null,
    currency: "TND",
    surface_m2: null,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    floor: null,
    total_floors: null,
    year_built: null,
    latitude: null,
    longitude: null,
    address: "",
    city: "",
    neighborhood: "",
    country_code: "TN",
    pack: "free",
    amenities: [],
    video_url: "",
    images: [],
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PublishPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_currency")
    .eq("id", user.id)
    .single();

  const { data: draft } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", user.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initial = buildInitialDraft();

  if (draft) {
    const { data: images } = await supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", draft.id)
      .order("position", { ascending: true });
    const { data: amenities } = await supabase
      .from("listing_amenities")
      .select("amenity_key")
      .eq("listing_id", draft.id);

    initial.id = draft.id;
    initial.type = draft.type;
    initial.category = draft.category;
    initial.title = draft.title ?? "";
    initial.description = draft.description ?? "";
    initial.price = draft.price ?? null;
    initial.currency = draft.currency;
    initial.surface_m2 = draft.surface_m2 ?? null;
    initial.rooms = draft.rooms ?? null;
    initial.bedrooms = draft.bedrooms ?? null;
    initial.bathrooms = draft.bathrooms ?? null;
    initial.floor = draft.floor ?? null;
    initial.total_floors = draft.total_floors ?? null;
    initial.year_built = draft.year_built ?? null;
    initial.latitude = draft.latitude ?? null;
    initial.longitude = draft.longitude ?? null;
    initial.address = draft.address ?? "";
    initial.city = draft.city ?? "";
    initial.neighborhood = draft.neighborhood ?? "";
    initial.country_code = draft.country_code;
    initial.pack = draft.pack;
    initial.images =
      images?.map((img) => ({
        id: img.id,
        url: img.url,
        position: img.position,
        is_cover: img.is_cover,
      })) ?? [];
    initial.amenities = amenities?.map((a) => a.amenity_key) ?? [];
  }

  return (
    <main className="bg-creme min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <h1 className="font-display text-ink mb-1 text-3xl font-bold">
          Publier mon annonce
        </h1>
        <p className="text-ink-soft mb-6 text-sm">
          Créez votre annonce en 7 étapes, le brouillon est sauvegardé
          automatiquement.
        </p>
        <PublishStepper
          initialData={initial}
          preferredCurrency={profile?.preferred_currency ?? "TND"}
        />
      </div>
    </main>
  );
}
