import { randomUUID } from "node:crypto";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for seed",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const cities = ["Tunis", "La Marsa", "Sfax", "Sousse"] as const;
const categories = ["apartment", "villa", "house", "office", "land"] as const;
const types = ["sale", "rent"] as const;

async function getUnsplashImage(seed: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return `https://source.unsplash.com/featured/1600x900/?real-estate,${encodeURIComponent(seed)}`;
  }
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=real-estate,house,apartment,${encodeURIComponent(seed)}&orientation=landscape&client_id=${accessKey}`,
  );
  if (!response.ok) {
    return `https://source.unsplash.com/featured/1600x900/?real-estate,${encodeURIComponent(seed)}`;
  }
  const data = (await response.json()) as {
    urls?: { regular?: string };
  };
  return (
    data.urls?.regular ??
    `https://source.unsplash.com/featured/1600x900/?real-estate,${encodeURIComponent(seed)}`
  );
}

async function ensureDemoUsers() {
  const sellers = await Promise.all(
    Array.from({ length: 5 }).map(async (_, idx) => {
      const email = `demo-seller-${idx + 1}@papimo.test`;
      const created = await supabase.auth.admin.createUser({
        email,
        password: "PapimoDemo!2026",
        email_confirm: true,
        user_metadata: { full_name: `Demo Seller ${idx + 1}` },
      });
      const user = created.data.user;
      if (!user) throw new Error(`Cannot create seller ${email}`);
      await supabase.from("profiles").upsert({
        id: user.id,
        email,
        full_name: `Demo Seller ${idx + 1}`,
        role: "user",
        country_code: "TN",
      });
      return user;
    }),
  );

  const adminEmail = "demo-admin@papimo.test";
  const adminUser = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: "PapimoAdmin!2026",
    email_confirm: true,
    user_metadata: { full_name: "Demo Admin" },
  });
  if (adminUser.data.user) {
    await supabase.from("profiles").upsert({
      id: adminUser.data.user.id,
      email: adminEmail,
      full_name: "Demo Admin",
      role: "admin",
      country_code: "TN",
    });
  }

  return sellers;
}

async function seedListings() {
  const sellers = await ensureDemoUsers();
  if (sellers.length === 0) {
    throw new Error("No demo sellers created");
  }
  const rows = Array.from({ length: 30 }).map((_, idx) => {
    const seller = sellers[idx % sellers.length];
    if (!seller) {
      throw new Error("Seller unavailable");
    }
    const city = cities[idx % cities.length] ?? "Tunis";
    const category = categories[idx % categories.length] ?? "apartment";
    const type = types[idx % types.length] ?? "sale";
    const title = `${category} ${type === "sale" ? "à vendre" : "à louer"} ${city} #${idx + 1}`;
    const basePrice = type === "sale" ? 180000 : 900;
    const multiplier = city === "La Marsa" ? 1.4 : city === "Tunis" ? 1.2 : 1;
    const price = Math.round(basePrice * multiplier + idx * 700);
    return {
      id: randomUUID(),
      owner_id: seller.id,
      slug: `demo-${city.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}-${Date.now()}`,
      title,
      description: `Annonce démo ${title}. Bien entretenu, localisation recherchée, proche commodités.`,
      status: "active" as const,
      type,
      category,
      city,
      country_code: "TN",
      currency: "TND" as const,
      price,
      surface_m2: 70 + (idx % 6) * 25,
      rooms: 2 + (idx % 4),
      bedrooms: 1 + (idx % 4),
      bathrooms: 1 + (idx % 3),
    };
  });

  const { data: inserted, error } = await supabase
    .from("listings")
    .insert(rows)
    .select("id,title,city");
  if (error) throw error;

  for (const listing of inserted ?? []) {
    const image = await getUnsplashImage(`${listing.city}-${listing.title}`);
    await supabase.from("listing_images").insert({
      listing_id: listing.id,
      url: image,
      position: 0,
      is_cover: true,
      alt_text: listing.title,
    });
  }

  console.log(`Seed complete: ${(inserted ?? []).length} listings inserted.`);
}

seedListings().catch((error) => {
  console.error(error);
  process.exit(1);
});
