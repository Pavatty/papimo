"use server";

import Anthropic from "@anthropic-ai/sdk";

import { createClient } from "@/lib/supabase/server";

export async function estimatePropertyRange(input: {
  countryCode: string;
  city: string;
  neighborhood?: string;
  surfaceM2: number;
}) {
  const supabase = await createClient();

  const neighborhoodRow = await supabase
    .from("price_index")
    .select("avg_price_m2_sale")
    .eq("country_code", input.countryCode)
    .eq("city", input.city)
    .eq("neighborhood", input.neighborhood ?? null)
    .order("period", { ascending: false })
    .limit(1)
    .maybeSingle();

  const cityRow = await supabase
    .from("price_index")
    .select("avg_price_m2_sale")
    .eq("country_code", input.countryCode)
    .eq("city", input.city)
    .order("period", { ascending: false })
    .limit(1)
    .maybeSingle();

  const pricePerM2 =
    neighborhoodRow.data?.avg_price_m2_sale ??
    cityRow.data?.avg_price_m2_sale ??
    2200;
  const fallbackUsed = !neighborhoodRow.data?.avg_price_m2_sale;
  const mid = Math.round((pricePerM2 ?? 2200) * input.surfaceM2);
  return {
    low: Math.round(mid * 0.85),
    mid,
    high: Math.round(mid * 1.15),
    fallbackUsed,
  };
}

export async function improveDescription(
  text: string,
  context?: { city?: string; type?: string; price?: number },
) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      content: text,
      warning: "Configurer ANTHROPIC_API_KEY pour activer",
    };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = [
    "Tu es un expert immobilier tunisien spécialisé dans la rédaction d'annonces engageantes.",
    "Améliore la description en gardant les faits exacts.",
    "Reste sobre, professionnel, en français.",
    "Texte structuré, pas trop long.",
    "Évite les superlatifs vides.",
    "Mentionne le quartier si dispo.",
    "Termine par un CTA discret.",
    `Contexte: ${JSON.stringify(context ?? {})}`,
    `Description: ${text}`,
  ].join("\n");

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  const content =
    response.content.find((item) => item.type === "text" && "text" in item)
      ?.text ?? text;

  return { content };
}

export async function runPriceDiagnostic(input: { listingIdOrSlug: string }) {
  const supabase = await createClient();
  let listing = await supabase
    .from("listings")
    .select("*, listing_images(*), listing_amenities(*)")
    .eq("slug", input.listingIdOrSlug)
    .maybeSingle();
  if (!listing.data) {
    listing = await supabase
      .from("listings")
      .select("*, listing_images(*), listing_amenities(*)")
      .eq("id", input.listingIdOrSlug)
      .maybeSingle();
  }

  if (!listing.data) {
    return { ok: false, error: "Annonce introuvable" };
  }

  const row = listing.data;
  const priceIndex = await supabase
    .from("price_index")
    .select("avg_price_m2_sale")
    .eq("country_code", row.country_code)
    .eq("city", row.city)
    .eq("neighborhood", row.neighborhood)
    .order("period", { ascending: false })
    .limit(1)
    .maybeSingle();

  const benchmark = priceIndex.data?.avg_price_m2_sale ?? null;
  const pricePerM2 = row.surface_m2 ? row.price / row.surface_m2 : null;
  const marketScore =
    benchmark && pricePerM2
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              100 - Math.abs((pricePerM2 - benchmark) / benchmark) * 100,
            ),
          ),
        )
      : 50;
  const photoScore = Math.min(100, (row.listing_images?.length ?? 0) * 15);
  const infoScore = [
    "title",
    "description",
    "surface_m2",
    "rooms",
    "city",
  ].reduce((acc, key) => (row[key as keyof typeof row] ? acc + 20 : acc), 0);
  const textScore = Math.min(
    100,
    Math.round(
      ((row.title?.length ?? 0) + (row.description?.length ?? 0)) / 20,
    ),
  );

  return {
    ok: true,
    score: Math.round((marketScore + photoScore + infoScore + textScore) / 4),
    details: { marketScore, photoScore, infoScore, textScore },
    recommendations: [
      marketScore < 60
        ? "Ajuster le prix selon le marché local."
        : "Prix cohérent.",
      photoScore < 60
        ? "Ajouter plus de photos de qualité."
        : "Galerie correcte.",
      infoScore < 80
        ? "Compléter les caractéristiques manquantes."
        : "Fiche bien remplie.",
      textScore < 60
        ? "Optimiser le titre et la description."
        : "Texte attractif.",
    ],
  };
}
