-- ============================================================
-- Seed listings papimo : 10 annonces réalistes Tunisie
-- ============================================================

INSERT INTO listings (
  owner_id, transaction_type, property_type, title, description, slug,
  price, price_currency, surface_area, rooms_total, bedrooms, bathrooms,
  floor, total_floors, construction_year, heating_type, orientation,
  furnished_level, condition, country, region, city, neighborhood,
  latitude, longitude, amenities, photos, main_photo,
  status, pack_type, published_at, expires_at
) VALUES
-- 1. Appart La Marsa vente luxe
(
  (SELECT id FROM auth.users LIMIT 1),
  'sale', 'apartment',
  'Magnifique appartement 4 pièces avec vue mer à La Marsa',
  'Bel appartement traversant de 145m² situé au 3e étage d''une résidence sécurisée à La Marsa. Vue mer panoramique, balcon de 18m², cuisine équipée moderne. Proche de la corniche, écoles et commerces. Idéal famille ou investissement locatif.',
  'appartement-vue-mer-la-marsa-001',
  680000, 'TND', 145, 4, 3, 2,
  3, 5, 2018, 'individual_electric', 'south_west',
  'unfurnished', 'excellent', 'TN', 'Tunis', 'La Marsa', 'Marsa Plage',
  36.8881, 10.3239,
  ARRAY['parking', 'elevator', 'balcony', 'ac', 'sea_view', 'security', 'fiber'],
  ARRAY[
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200'
  ],
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
  'active', 'free',
  NOW() - INTERVAL '2 days', NOW() + INTERVAL '60 days'
),
-- 2. Maison Hammamet Yasmine
(
  (SELECT id FROM auth.users LIMIT 1),
  'sale', 'house',
  'Villa moderne avec piscine à Hammamet Yasmine',
  'Superbe villa contemporaine de 320m² sur terrain de 600m². 5 chambres, 4 salles de bain, grande piscine, jardin paysager, garage 2 voitures. Quartier résidentiel calme à 5 min de la plage et des golfs.',
  'villa-piscine-hammamet-yasmine-002',
  950000, 'TND', 320, 7, 5, 4,
  0, 2, 2020, 'central', 'south',
  'unfurnished', 'excellent', 'TN', 'Nabeul', 'Hammamet', 'Hammamet Yasmine',
  36.3756, 10.5504,
  ARRAY['parking', 'garden', 'pool', 'ac', 'heating', 'security', 'fiber', 'alarm'],
  ARRAY[
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200'
  ],
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200',
  'active', 'free',
  NOW() - INTERVAL '5 days', NOW() + INTERVAL '60 days'
),
-- 3. Studio location Tunis Centre
(
  (SELECT id FROM auth.users LIMIT 1),
  'rent', 'studio',
  'Studio meublé proche métro à Tunis Centre',
  'Studio fonctionnel de 35m² entièrement meublé et équipé. Idéal étudiant ou jeune actif. Cuisine américaine, salle de douche refaite à neuf. À 2 min du métro Mohamed V. Charges incluses.',
  'studio-meuble-tunis-centre-003',
  650, 'TND', 35, 1, 0, 1,
  4, 6, 2010, 'individual_electric', 'east',
  'fully_furnished', 'good', 'TN', 'Tunis', 'Tunis Centre', 'Centre Ville',
  36.7989, 10.1789,
  ARRAY['elevator', 'ac', 'furnished', 'fiber'],
  ARRAY[
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200'
  ],
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
  'active', 'free',
  NOW() - INTERVAL '1 days', NOW() + INTERVAL '60 days'
),
-- 4. Terrain Sfax investissement
(
  (SELECT id FROM auth.users LIMIT 1),
  'sale', 'land',
  'Terrain constructible 800m² zone résidentielle Sfax',
  'Beau terrain plat de 800m² entièrement viabilisé (eau, électricité, assainissement) dans zone résidentielle de Sfax. Permis de construire R+2 disponible. Idéal pour villa familiale ou petit immeuble locatif.',
  'terrain-constructible-sfax-004',
  280000, 'TND', 800, NULL, NULL, NULL,
  NULL, NULL, NULL, NULL, NULL,
  NULL, 'good', 'TN', 'Sfax', 'Sfax Ville', 'Sfax Sakiet Eddaier',
  34.7406, 10.7603,
  ARRAY[]::TEXT[],
  ARRAY[
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200'
  ],
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
  'active', 'free',
  NOW() - INTERVAL '7 days', NOW() + INTERVAL '60 days'
),
-- 5. Local commercial Sousse Sahloul
(
  (SELECT id FROM auth.users LIMIT 1),
  'rent', 'commercial_space',
  'Local commercial 80m² Sahloul Sousse - emplacement premium',
  'Local commercial idéalement situé sur l''avenue principale de Sahloul à Sousse. 80m² avec vitrine de 8m, hauteur sous plafond 3.5m. Parfait pour boutique, agence ou restaurant. Forte fréquentation.',
  'local-commercial-sahloul-sousse-005',
  2200, 'TND', 80, NULL, NULL, 1,
  0, 5, 2015, NULL, NULL,
  NULL, 'excellent', 'TN', 'Sousse', 'Sousse Ville', 'Sousse Sahloul',
  35.8245, 10.6347,
  ARRAY['ac', 'security', 'fiber'],
  ARRAY[
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200',
    'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200'
  ],
  'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1200',
  'active', 'free',
  NOW() - INTERVAL '3 days', NOW() + INTERVAL '60 days'
),
-- 6. Maison Sidi Bou Said vente prestige
(
  (SELECT id FROM auth.users LIMIT 1),
  'sale', 'villa',
  'Maison de charme à Sidi Bou Said avec vue sur la baie',
  'Authentique maison tunisienne rénovée avec goût au cœur de Sidi Bou Said. 4 chambres, patio andalou, terrasse panoramique avec vue imprenable sur la baie de Tunis. Bien d''exception, rare sur le marché.',
  'maison-charme-sidi-bou-said-006',
  1850000, 'TND', 280, 6, 4, 3,
  0, 2, 1920, 'central', 'north_east',
  'semi_furnished', 'excellent', 'TN', 'Tunis', 'Sidi Bou Said', 'Sidi Bou Said Ville',
  36.8703, 10.3464,
  ARRAY['parking', 'garden', 'sea_view', 'security', 'fiber', 'fireplace', 'cellar'],
  ARRAY[
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200'
  ],
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
  'active', 'free',
  NOW() - INTERVAL '10 days', NOW() + INTERVAL '60 days'
),
-- 7. Appart Ariana Ennasr location familiale
(
  (SELECT id FROM auth.users LIMIT 1),
  'rent', 'apartment',
  'Bel appartement S+3 à Ennasr 2 - calme et lumineux',
  'Appartement S+3 de 110m² au 2e étage, dans résidence calme avec ascenseur et parking. Cuisine équipée, salon avec balcon, 3 chambres dont 1 master. Climatisation centrale, fibre optique installée.',
  'appartement-s3-ariana-ennasr-007',
  1400, 'TND', 110, 4, 3, 2,
  2, 4, 2016, 'central', 'south_east',
  'unfurnished', 'good', 'TN', 'Ariana', 'Ariana Ville', 'Ennasr 2',
  36.8625, 10.1956,
  ARRAY['parking', 'elevator', 'balcony', 'ac', 'heating', 'fiber', 'intercom'],
  ARRAY[
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200'
  ],
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
  'active', 'free',
  NOW() - INTERVAL '4 days', NOW() + INTERVAL '60 days'
),
-- 8. Location saisonnière Djerba
(
  (SELECT id FROM auth.users LIMIT 1),
  'seasonal_rent', 'house',
  'Maison traditionnelle à Djerba Houmt Souk - location estivale',
  'Charmante maison djerbienne traditionnelle de 180m² avec patio intérieur, 3 chambres climatisées, terrasse panoramique. À 5 min à pied de la médina et 10 min de la plage. Disponible juin à septembre.',
  'maison-djerba-houmt-souk-008',
  1500, 'TND', 180, 5, 3, 2,
  0, 2, 1985, NULL, 'north',
  'fully_furnished', 'good', 'TN', 'Médenine', 'Djerba Houmt Souk', 'Houmt Souk',
  33.8762, 10.8579,
  ARRAY['terrace', 'ac', 'furnished', 'fiber'],
  ARRAY[
    'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=1200',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200'
  ],
  'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=1200',
  'active', 'free',
  NOW() - INTERVAL '6 days', NOW() + INTERVAL '60 days'
),
-- 9. Bureau Centre Ville Tunis
(
  (SELECT id FROM auth.users LIMIT 1),
  'rent', 'office',
  'Bureau professionnel 60m² Lafayette Tunis',
  'Plateau de bureau de 60m² en open space avec 2 bureaux fermés et salle de réunion. Climatisation, fibre optique, ascenseur. Idéal startup ou cabinet conseil. Charges et entretien inclus.',
  'bureau-lafayette-tunis-009',
  1100, 'TND', 60, 3, NULL, 1,
  4, 7, 2012, 'central', 'east',
  'semi_furnished', 'good', 'TN', 'Tunis', 'Tunis Centre', 'Lafayette',
  36.8141, 10.1813,
  ARRAY['elevator', 'ac', 'fiber', 'security', 'intercom'],
  ARRAY[
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200'
  ],
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
  'active', 'free',
  NOW() - INTERVAL '8 days', NOW() + INTERVAL '60 days'
),
-- 10. Duplex moderne Sousse Khezama
(
  (SELECT id FROM auth.users LIMIT 1),
  'sale', 'duplex',
  'Duplex neuf 5 pièces avec rooftop à Sousse Khezama',
  'Magnifique duplex de 195m² au dernier étage d''une résidence haut standing 2024. 4 chambres, 3 SDB, double séjour, rooftop privatif de 60m² avec vue mer panoramique. Cuisine américaine équipée, dressings.',
  'duplex-rooftop-sousse-khezama-010',
  890000, 'TND', 195, 5, 4, 3,
  6, 6, 2024, 'central', 'south_west',
  'unfurnished', 'new', 'TN', 'Sousse', 'Sousse Ville', 'Sousse Khezama',
  35.8569, 10.6017,
  ARRAY['parking', 'elevator', 'terrace', 'ac', 'sea_view', 'city_view', 'fiber', 'security', 'new_construction', 'double_glazing'],
  ARRAY[
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200'
  ],
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
  'active', 'free',
  NOW() - INTERVAL '12 days', NOW() + INTERVAL '60 days'
);

-- ============================================================
-- Fin du seed
-- ============================================================
