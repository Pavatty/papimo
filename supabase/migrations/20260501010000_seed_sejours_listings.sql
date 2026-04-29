-- LODGE PR9.1 — Seed 10 listings Séjours Tunisie
-- Idempotent : INSERT WHERE NOT EXISTS sur slug.
-- Owner : 0613d077-b93d-4a2c-8ae2-1864900ab735 (tunismeet@gmail.com / Mahmoud)

DO $$
DECLARE
  owner_uuid UUID := '0613d077-b93d-4a2c-8ae2-1864900ab735';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = owner_uuid) THEN
    RAISE NOTICE 'Owner % not found, skipping seed', owner_uuid;
    RETURN;
  END IF;

  -- Helper inline pour insérer un listing si slug pas déjà présent
  -- 1. Villa Gammarth Vue Mer
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'villa-gammarth-vue-mer', 'rent', 'rent', 'villa', 'villa', 'short_term',
    'Villa Moderne Vue Mer Gammarth',
    'Magnifique villa 4 chambres avec piscine privée et vue mer panoramique. Terrasse spacieuse, cuisine équipée, parking sécurisé. Idéal pour familles ou groupes. Plage à 5 min à pied.',
    'active', 'free',
    'Gammarth', 'Tunis', 'TN', 36.8805, 10.3246,
    4, 3, 280, 280, 10,
    450, 'TND', 'TND',
    450, 2, 14,
    true,
    'Non fumeur. Animaux interdits. Fêtes interdites. Calme respecté après 22h.',
    'moderate',
    ARRAY['piscine','wifi','parking','climatisation','cuisine_equipee','terrasse','vue_mer','bbq','tv','machine_a_laver'],
    ARRAY[
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'villa-gammarth-vue-mer');

  -- 2. Appartement Sidi Bou Said
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'appart-sidi-bou-said', 'rent', 'rent', 'apartment', 'apartment', 'short_term',
    'Appart Lumineux Sidi Bou Said',
    'Charmant appartement 2 chambres au cœur de Sidi Bou Said. Décoration traditionnelle tunisienne, balcon avec vue village. WiFi rapide, cuisine équipée. Cafés et restaurants à 2 min.',
    'active', 'free',
    'Sidi Bou Said', 'Tunis', 'TN', 36.8689, 10.3407,
    2, 1, 85, 85, 4,
    200, 'TND', 'TND',
    200, 1, 7,
    true,
    'Non fumeur. Respecter le voisinage (zone résidentielle calme). Check-in flexible.',
    'flexible',
    ARRAY['wifi','climatisation','cuisine_equipee','balcon','vue_village','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'appart-sidi-bou-said');

  -- 3. Villa Hammamet Plage
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'villa-hammamet-plage', 'rent', 'rent', 'villa', 'villa', 'short_term',
    'Villa Luxe Hammamet Front de Mer',
    'Villa exceptionnelle 5 chambres avec accès direct plage privée. Piscine chauffée, jacuzzi, jardin tropical. Cuisine pro, salon spacieux. Staff disponible. Perfect for events.',
    'active', 'free',
    'Hammamet', 'Nabeul', 'TN', 36.4000, 10.6167,
    5, 4, 350, 350, 12,
    800, 'TND', 'TND',
    800, 3, 30,
    false,
    'Respecter les lieux. Fêtes autorisées avec préavis 48h. Animaux acceptés. Caution 500 TND.',
    'strict',
    ARRAY['piscine','jacuzzi','wifi','parking','climatisation','cuisine_equipee','plage_privee','jardin','bbq','tv','machine_a_laver','salle_sport'],
    ARRAY[
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'villa-hammamet-plage');

  -- 4. Studio Sousse Médina (catégorie apartment puisque studio non disponible)
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'studio-sousse-medina', 'rent', 'rent', 'apartment', 'studio', 'short_term',
    'Studio Cosy Médina Sousse',
    'Studio moderne 30m² parfait couple ou solo traveler. Kitchenette, WiFi fiber, climatisation. Médina à 5 min, plage à 10 min à pied. Supermarché Monoprix en bas. Très bon rapport qualité/prix.',
    'active', 'free',
    'Sousse', 'Sousse', 'TN', 35.8256, 10.6369,
    1, 1, 30, 30, 2,
    80, 'TND', 'TND',
    80, 1, 14,
    true,
    'Non fumeur. Calme après 23h. Check-in autonome (code digital).',
    'flexible',
    ARRAY['wifi','climatisation','cuisine_equipee','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'studio-sousse-medina');

  -- 5. Maison Djerba Midoun
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'maison-djerba-midoun', 'rent', 'rent', 'house', 'house', 'short_term',
    'Maison Traditionnelle Djerba',
    'Authentique maison djerbienne 3 chambres avec cour intérieure ombragée. Architecture traditionnelle, déco artisanale locale. Vélos inclus. Marché Midoun 10 min, plage 15 min. Expérience locale garantie.',
    'active', 'free',
    'Midoun', 'Médenine', 'TN', 33.8078, 10.9926,
    3, 2, 120, 120, 6,
    180, 'TND', 'TND',
    180, 2, 21,
    true,
    'Respecter l''architecture traditionnelle. Animaux bienvenus. Fêtes interdites (quartier résidentiel).',
    'moderate',
    ARRAY['wifi','climatisation','cour','jardin','velos','parking','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'maison-djerba-midoun');

  -- 6. Appartement Tunis Centre
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'appart-tunis-bourguiba', 'rent', 'rent', 'apartment', 'apartment', 'short_term',
    'Appart Standing Avenue Habib Bourguiba',
    'Appartement 3 pièces luxueux plein centre Tunis. Immeuble moderne, ascenseur, sécurité 24/7. WiFi, climatisation toutes pièces, cuisine équipée. Métro à 2 min, restaurants et cafés partout. Business travelers welcome.',
    'active', 'free',
    'Tunis', 'Tunis', 'TN', 36.8065, 10.1815,
    2, 1, 95, 95, 4,
    220, 'TND', 'TND',
    220, 1, 14,
    true,
    'Non fumeur. Calme respecté. Check-in 24/7 possible. Facture fournie pour frais professionnels.',
    'moderate',
    ARRAY['wifi','climatisation','ascenseur','parking','cuisine_equipee','tv','bureau'],
    ARRAY[
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'appart-tunis-bourguiba');

  -- 7. Villa Carthage
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'villa-carthage-prestige', 'rent', 'rent', 'villa', 'villa', 'short_term',
    'Villa d''Exception Carthage',
    'Villa prestige 6 chambres quartier diplomatique Carthage. Piscine infinity, jardin méditerranéen 500m², garage 3 voitures. Décoration architecte, domotique complète. Idéal familles VIP, événements haut standing.',
    'active', 'free',
    'Carthage', 'Tunis', 'TN', 36.8529, 10.3233,
    6, 5, 450, 450, 15,
    1200, 'TND', 'TND',
    1200, 5, 30,
    false,
    'Dépôt garantie 1000 TND. Housekeeper inclus. Fêtes autorisées avec accord préalable.',
    'strict',
    ARRAY['piscine','wifi','parking','climatisation','cuisine_equipee','jardin','terrasse','vue_mer','bbq','salle_sport','bureau','cave_vin'],
    ARRAY[
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'villa-carthage-prestige');

  -- 8. Maison Mahdia Corniche
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'maison-mahdia-corniche', 'rent', 'rent', 'house', 'house', 'short_term',
    'Maison Vue Mer Mahdia',
    'Jolie maison 3 chambres sur la corniche de Mahdia. Terrasse panoramique vue mer, 50m de la plage. Parfait familles avec enfants. Calme, authentique, bon WiFi. Pêcheurs locaux vendent poisson frais tous les matins.',
    'active', 'free',
    'Mahdia', 'Mahdia', 'TN', 35.5047, 11.0622,
    3, 2, 110, 110, 6,
    160, 'TND', 'TND',
    160, 2, 14,
    true,
    'Animaux acceptés. Fêtes interdites. Respecter le voisinage (quartier familial).',
    'moderate',
    ARRAY['wifi','climatisation','terrasse','vue_mer','parking','cuisine_equipee','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'maison-mahdia-corniche');

  -- 9. Appartement La Marsa
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'appart-la-marsa-plage', 'rent', 'rent', 'apartment', 'apartment', 'short_term',
    'Appart Neuf La Marsa Plage',
    'Appartement flambant neuf 2 chambres résidence sécurisée La Marsa. Piscine commune, salle sport, terrasse privée. 200m plage, 5 min à pied Marsa Corniche. Tout équipé, design contemporain. Parking inclus.',
    'active', 'free',
    'La Marsa', 'Tunis', 'TN', 36.8782, 10.3254,
    2, 2, 100, 100, 4,
    280, 'TND', 'TND',
    280, 2, 21,
    true,
    'Non fumeur. Accès piscine 8h-20h. Parties communes à respecter. Caution 200 TND.',
    'moderate',
    ARRAY['piscine','wifi','parking','climatisation','cuisine_equipee','terrasse','salle_sport','ascenseur','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'appart-la-marsa-plage');

  -- 10. Dar Sfax Médina
  INSERT INTO public.listings (
    owner_id, slug, type, transaction_type, category, property_type, rental_type,
    title, description, status, pack,
    city, governorate, country_code, latitude, longitude,
    rooms, bathrooms, surface_m2, surface_area, max_guests,
    price, currency, price_currency,
    base_price_per_night, min_nights, max_nights,
    instant_booking, house_rules, cancellation_policy,
    amenities, photos
  )
  SELECT
    owner_uuid, 'dar-sfax-medina', 'rent', 'rent', 'house', 'house', 'short_term',
    'Dar Traditionnelle Médina Sfax',
    'Maison d''hôtes authentique plein cœur médina Sfax. 4 chambres, patio central avec fontaine, toit-terrasse vue panoramique. Architecture du 18ème siècle restaurée. Expérience culturelle immersive, breakfast traditionnel inclus.',
    'active', 'free',
    'Sfax', 'Sfax', 'TN', 34.7406, 10.7603,
    4, 3, 180, 180, 8,
    250, 'TND', 'TND',
    250, 1, 10,
    false,
    'Respecter le patrimoine. Non fumeur intérieur. Visites guidées médina possibles.',
    'flexible',
    ARRAY['wifi','climatisation','patio','terrasse','vue_medina','cuisine_equipee','tv'],
    ARRAY[
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800'
    ]
  WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'dar-sfax-medina');

  RAISE NOTICE 'Seed Sejours: % listings short_term active',
    (SELECT COUNT(*) FROM public.listings
      WHERE rental_type = 'short_term'
        AND status = 'active'
        AND owner_id = owner_uuid);
END $$;

-- Backfill main_photo depuis photos[0] pour les listings seedés
UPDATE public.listings
SET main_photo = photos[1]
WHERE rental_type = 'short_term'
  AND main_photo IS NULL
  AND photos IS NOT NULL
  AND array_length(photos, 1) > 0;
