-- LODGE — Seed démo PAP/PRO pour vitrine du filtre publisher_type
-- 7 profils Particuliers + 5 profils Agences avec 1 annonce immobilier chacun
-- profiles.id a un FK vers auth.users → INSERT auth.users d'abord
-- Idempotent : ON CONFLICT DO sur les 2 niveaux

-- =========================================================================
-- 12 auth.users (7 PAP + 5 PRO)
-- =========================================================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, aud, role)
VALUES
  ('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'pap1@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sami Ben Ali"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'pap2@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Leila Trabelsi"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'pap3@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Marc Dubois"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'pap4@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Fatima Zahra"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'pap5@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Karim Mansour"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a6666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'pap6@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sophie Martin"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('a7777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', 'pap7@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Yassine Hamdi"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'pro1@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Carthage Properties"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'pro2@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Méditerranée Immobilier"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'pro3@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Atlas Real Estate"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'pro4@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Provence Habitat"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b5555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'pro5@lodge-demo.test', '$2a$10$fakehashfornoauthuse0123456789abcdefghijklmn', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Gulf Premium Realty"}'::jsonb, NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 7 profils PAP (Particuliers)
-- =========================================================================
INSERT INTO public.profiles (
  id, email, full_name, publisher_type, account_type, role,
  country_code, preferred_language, preferred_currency,
  is_verified, kyc_status, created_at, updated_at
) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'pap1@lodge-demo.test', 'Sami Ben Ali', 'pap', 'individual', 'user', 'TN', 'fr', 'TND', true, 'verified', NOW(), NOW()),
  ('a2222222-2222-2222-2222-222222222222', 'pap2@lodge-demo.test', 'Leila Trabelsi', 'pap', 'individual', 'user', 'TN', 'fr', 'TND', true, 'verified', NOW(), NOW()),
  ('a3333333-3333-3333-3333-333333333333', 'pap3@lodge-demo.test', 'Marc Dubois', 'pap', 'individual', 'user', 'FR', 'fr', 'EUR', true, 'verified', NOW(), NOW()),
  ('a4444444-4444-4444-4444-444444444444', 'pap4@lodge-demo.test', 'Fatima Zahra', 'pap', 'individual', 'user', 'MA', 'fr', 'MAD', true, 'verified', NOW(), NOW()),
  ('a5555555-5555-5555-5555-555555555555', 'pap5@lodge-demo.test', 'Karim Mansour', 'pap', 'individual', 'user', 'EG', 'en', 'EUR', false, 'pending', NOW(), NOW()),
  ('a6666666-6666-6666-6666-666666666666', 'pap6@lodge-demo.test', 'Sophie Martin', 'pap', 'individual', 'user', 'FR', 'fr', 'EUR', true, 'verified', NOW(), NOW()),
  ('a7777777-7777-7777-7777-777777777777', 'pap7@lodge-demo.test', 'Yassine Hamdi', 'pap', 'individual', 'user', 'TN', 'fr', 'TND', true, 'verified', NOW(), NOW())
ON CONFLICT (id) DO UPDATE
  SET publisher_type = 'pap',
      full_name = EXCLUDED.full_name,
      account_type = EXCLUDED.account_type;

-- =========================================================================
-- 5 profils PRO (Agences)
-- =========================================================================
INSERT INTO public.profiles (
  id, email, full_name, publisher_type, account_type, role,
  country_code, preferred_language, preferred_currency,
  is_verified, kyc_status, company_name, created_at, updated_at
) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'pro1@lodge-demo.test', 'Carthage Properties', 'pro', 'pro', 'user', 'TN', 'fr', 'TND', true, 'verified', 'Carthage Properties', NOW(), NOW()),
  ('b2222222-2222-2222-2222-222222222222', 'pro2@lodge-demo.test', 'Méditerranée Immobilier', 'pro', 'pro', 'user', 'TN', 'fr', 'TND', true, 'verified', 'Méditerranée Immobilier SARL', NOW(), NOW()),
  ('b3333333-3333-3333-3333-333333333333', 'pro3@lodge-demo.test', 'Atlas Real Estate', 'pro', 'pro', 'user', 'MA', 'fr', 'MAD', true, 'verified', 'Atlas Real Estate', NOW(), NOW()),
  ('b4444444-4444-4444-4444-444444444444', 'pro4@lodge-demo.test', 'Provence Habitat', 'pro', 'pro', 'user', 'FR', 'fr', 'EUR', true, 'verified', 'Provence Habitat SA', NOW(), NOW()),
  ('b5555555-5555-5555-5555-555555555555', 'pro5@lodge-demo.test', 'Gulf Premium Realty', 'pro', 'pro', 'user', 'AE', 'en', 'EUR', true, 'verified', 'Gulf Premium Realty LLC', NOW(), NOW())
ON CONFLICT (id) DO UPDATE
  SET publisher_type = 'pro',
      full_name = EXCLUDED.full_name,
      account_type = EXCLUDED.account_type,
      company_name = EXCLUDED.company_name;

-- =========================================================================
-- 7 annonces immobilier PAP
-- WHERE NOT EXISTS sur slug pour idempotence
-- =========================================================================
INSERT INTO public.listings (
  owner_id, slug, type, transaction_type, category, property_type,
  rental_type, module_name,
  title, description, status, pack,
  city, governorate, country_code, country, currency, price_currency,
  price, surface_m2, surface_area, rooms, bedrooms,
  photos
)
SELECT
  'a3333333-3333-3333-3333-333333333333'::uuid, 'studio-marseille-vieux-port-pap',
  'sale', 'sale', 'apartment', 'apartment',
  'annual', 'immobilier',
  'Studio rénové au Vieux-Port',
  'Studio entièrement rénové au cœur du Vieux-Port de Marseille. Idéal investissement locatif ou résidence secondaire.',
  'active', 'free',
  'Marseille', 'Bouches-du-Rhône', 'FR', 'France', 'EUR', 'EUR',
  185000, 28, 28, 1, 0,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'studio-marseille-vieux-port-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a1111111-1111-1111-1111-111111111111'::uuid, 'villa-la-marsa-piscine-pap',
  'sale', 'sale', 'villa', 'villa', 'annual', 'immobilier',
  'Villa moderne avec piscine à La Marsa',
  'Magnifique villa de standing avec jardin et piscine. Quartier résidentiel calme à 5 min de la mer.',
  'active', 'free',
  'La Marsa', 'Tunis', 'TN', 'Tunisie', 'TND', 'TND',
  850000, 320, 320, 7, 4,
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'villa-la-marsa-piscine-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a2222222-2222-2222-2222-222222222222'::uuid, 'appartement-tunis-lac-pap',
  'rent', 'rent', 'apartment', 'apartment', 'annual', 'immobilier',
  'Appartement neuf vue lac',
  'Appartement haut standing avec vue panoramique sur le Lac de Tunis. Résidence sécurisée avec parking.',
  'active', 'free',
  'Tunis', 'Tunis', 'TN', 'Tunisie', 'TND', 'TND',
  1800, 135, 135, 4, 2,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'appartement-tunis-lac-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a4444444-4444-4444-4444-444444444444'::uuid, 'riad-casablanca-medina-pap',
  'sale', 'sale', 'house', 'house', 'annual', 'immobilier',
  'Riad authentique dans la médina',
  'Riad traditionnel restauré avec patio, fontaine et terrasse panoramique. Charme et authenticité marocaine.',
  'active', 'free',
  'Casablanca', 'Casablanca-Settat', 'MA', 'Maroc', 'MAD', 'MAD',
  4200000, 240, 240, 8, 5,
  ARRAY['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'riad-casablanca-medina-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a5555555-5555-5555-5555-555555555555'::uuid, 'appart-zamalek-caire-pap',
  'rent', 'furnished_rent', 'apartment', 'apartment', 'annual', 'immobilier',
  'Appartement Zamalek meublé',
  'Appartement spacieux et meublé dans le quartier prisé de Zamalek. Idéal expatriés ou séjour long.',
  'active', 'free',
  'Le Caire', 'Le Caire', 'EG', 'Égypte', 'EUR', 'EUR',
  1200, 180, 180, 5, 3,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'appart-zamalek-caire-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a6666666-6666-6666-6666-666666666666'::uuid, 'maison-lyon-croix-rousse-pap',
  'sale', 'sale', 'house', 'house', 'annual', 'immobilier',
  'Maison de caractère Croix-Rousse',
  'Maison familiale rénovée avec jardin clos. Quartier authentique et convivial des pentes lyonnaises.',
  'active', 'free',
  'Lyon', 'Rhône', 'FR', 'France', 'EUR', 'EUR',
  720000, 165, 165, 6, 4,
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'maison-lyon-croix-rousse-pap');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'a7777777-7777-7777-7777-777777777777'::uuid, 'local-commercial-sousse-pap',
  'rent', 'rent', 'shop', 'commercial_space', 'annual', 'immobilier',
  'Local commercial centre-ville Sousse',
  'Local commercial vitrine sur boulevard passant. Idéal commerce, agence ou bureau.',
  'active', 'free',
  'Sousse', 'Sousse', 'TN', 'Tunisie', 'TND', 'TND',
  2500, 85, 85, 2, 0,
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'local-commercial-sousse-pap');

-- =========================================================================
-- 5 annonces immobilier PRO (Agences)
-- =========================================================================
INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'b1111111-1111-1111-1111-111111111111'::uuid, 'penthouse-carthage-vue-mer-pro',
  'sale', 'sale', 'apartment', 'apartment', 'annual', 'immobilier',
  'Penthouse vue mer panoramique',
  'Penthouse exceptionnel avec terrasse 80m² et vue mer à 180°. Finitions haut de gamme, ascenseur privé.',
  'active', 'free',
  'Carthage', 'Tunis', 'TN', 'Tunisie', 'TND', 'TND',
  2400000, 320, 320, 8, 5,
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'penthouse-carthage-vue-mer-pro');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'b2222222-2222-2222-2222-222222222222'::uuid, 'villa-hammamet-yasmine-pro',
  'sale', 'sale', 'villa', 'villa', 'annual', 'immobilier',
  'Villa avec piscine à Hammamet',
  'Villa contemporaine avec piscine et accès direct plage. Quartier résidentiel sécurisé.',
  'active', 'free',
  'Hammamet', 'Nabeul', 'TN', 'Tunisie', 'TND', 'TND',
  1450000, 280, 280, 6, 4,
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'villa-hammamet-yasmine-pro');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'b3333333-3333-3333-3333-333333333333'::uuid, 'loft-marrakech-gueliz-pro',
  'sale', 'sale', 'apartment', 'apartment', 'annual', 'immobilier',
  'Loft moderne quartier Guéliz',
  'Loft design dans le nouveau quartier Guéliz. Architecture contemporaine, terrasse aménagée.',
  'active', 'free',
  'Marrakech', 'Marrakech-Safi', 'MA', 'Maroc', 'MAD', 'MAD',
  2800000, 145, 145, 3, 2,
  ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'loft-marrakech-gueliz-pro');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'b4444444-4444-4444-4444-444444444444'::uuid, 'mas-provencal-aix-pro',
  'sale', 'sale', 'house', 'house', 'annual', 'immobilier',
  'Mas provençal avec oliveraie',
  'Authentique mas du XVIIIe siècle restauré avec goût. Oliveraie de 1 hectare, piscine.',
  'active', 'free',
  'Aix-en-Provence', 'Bouches-du-Rhône', 'FR', 'France', 'EUR', 'EUR',
  1850000, 380, 380, 9, 5,
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'mas-provencal-aix-pro');

INSERT INTO public.listings (owner_id, slug, type, transaction_type, category, property_type, rental_type, module_name, title, description, status, pack, city, governorate, country_code, country, currency, price_currency, price, surface_m2, surface_area, rooms, bedrooms, photos)
SELECT
  'b5555555-5555-5555-5555-555555555555'::uuid, 'tour-dubai-marina-pro',
  'sale', 'sale', 'apartment', 'apartment', 'annual', 'immobilier',
  'Appartement Dubai Marina vue Burj',
  'Appartement luxe au 45e étage avec vue Burj Khalifa et Marina. Concierge 24/7, piscine sur le toit.',
  'active', 'free',
  'Dubai', 'Dubai', 'AE', 'Émirats arabes unis', 'EUR', 'EUR',
  3500000, 220, 220, 5, 3,
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']
WHERE NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = 'tour-dubai-marina-pro');

-- Backfill main_photo
UPDATE public.listings
SET main_photo = photos[1]
WHERE main_photo IS NULL
  AND photos IS NOT NULL
  AND array_length(photos, 1) > 0
  AND slug LIKE '%-pap' OR slug LIKE '%-pro';

-- =========================================================================
-- VERIFICATION
-- =========================================================================
DO $$
DECLARE
  pap_count INT;
  pro_count INT;
  total_immo INT;
BEGIN
  SELECT COUNT(*) INTO pap_count
    FROM listings l JOIN profiles p ON l.owner_id = p.id
    WHERE l.module_name = 'immobilier' AND l.status = 'active' AND p.publisher_type = 'pap';
  SELECT COUNT(*) INTO pro_count
    FROM listings l JOIN profiles p ON l.owner_id = p.id
    WHERE l.module_name = 'immobilier' AND l.status = 'active' AND p.publisher_type = 'pro';
  SELECT COUNT(*) INTO total_immo
    FROM listings WHERE module_name = 'immobilier' AND status = 'active';
  RAISE NOTICE 'Distribution finale immobilier active : PAP=%, PRO=%, TOTAL=%', pap_count, pro_count, total_immo;
END $$;
