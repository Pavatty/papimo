CREATE TABLE IF NOT EXISTS public.geo_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL, label_ar TEXT NOT NULL, label_en TEXT NOT NULL,
  flag_emoji TEXT, level1_label_fr TEXT NOT NULL, level2_label_fr TEXT, level3_label_fr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true, sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.geo_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES public.geo_countries(id) ON DELETE CASCADE,
  code TEXT NOT NULL, label_fr TEXT NOT NULL, label_ar TEXT, label_en TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(country_id, code)
);

CREATE TABLE IF NOT EXISTS public.geo_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id UUID NOT NULL REFERENCES public.geo_regions(id) ON DELETE CASCADE,
  code TEXT NOT NULL, label_fr TEXT NOT NULL, label_ar TEXT, label_en TEXT,
  latitude NUMERIC(10,7), longitude NUMERIC(10,7),
  sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(region_id, code)
);

CREATE INDEX IF NOT EXISTS idx_geo_regions_country ON public.geo_regions (country_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_geo_cities_region ON public.geo_cities (region_id, is_active, sort_order);

ALTER TABLE public.geo_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "geo_countries_public_read" ON public.geo_countries;
CREATE POLICY "geo_countries_public_read" ON public.geo_countries FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "geo_regions_public_read" ON public.geo_regions;
CREATE POLICY "geo_regions_public_read" ON public.geo_regions FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "geo_cities_public_read" ON public.geo_cities;
CREATE POLICY "geo_cities_public_read" ON public.geo_cities FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "geo_countries_admin_all" ON public.geo_countries;
CREATE POLICY "geo_countries_admin_all" ON public.geo_countries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "geo_regions_admin_all" ON public.geo_regions;
CREATE POLICY "geo_regions_admin_all" ON public.geo_regions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "geo_cities_admin_all" ON public.geo_cities;
CREATE POLICY "geo_cities_admin_all" ON public.geo_cities FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.geo_countries, public.geo_regions, public.geo_cities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.geo_countries, public.geo_regions, public.geo_cities TO authenticated;

INSERT INTO public.geo_countries (code, label_fr, label_ar, label_en, flag_emoji, level1_label_fr, level2_label_fr, level3_label_fr, sort_order) VALUES
  ('TN', 'Tunisie', 'تونس', 'Tunisia', '🇹🇳', 'Gouvernorat', 'Délégation', 'Quartier', 1),
  ('FR', 'France', 'فرنسا', 'France', '🇫🇷', 'Région', 'Département', 'Ville', 2),
  ('DZ', 'Algérie', 'الجزائر', 'Algeria', '🇩🇿', 'Wilaya', 'Daïra', 'Commune', 3),
  ('MA', 'Maroc', 'المغرب', 'Morocco', '🇲🇦', 'Région', 'Province', 'Ville', 4),
  ('CA', 'Canada', 'كندا', 'Canada', '🇨🇦', 'Province', 'Ville', NULL, 5),
  ('BE', 'Belgique', 'بلجيكا', 'Belgium', '🇧🇪', 'Région', 'Province', NULL, 6),
  ('DE', 'Allemagne', 'ألمانيا', 'Germany', '🇩🇪', 'Land', 'District', NULL, 7),
  ('AE', 'Émirats arabes unis', 'الإمارات', 'UAE', '🇦🇪', 'Émirat', 'Ville', NULL, 8),
  ('SA', 'Arabie saoudite', 'السعودية', 'Saudi Arabia', '🇸🇦', 'Province', 'Ville', NULL, 9)
ON CONFLICT (code) DO UPDATE SET label_fr = EXCLUDED.label_fr, sort_order = EXCLUDED.sort_order, updated_at = now();

-- Seed Tunisie : 24 gouvernorats
WITH tn AS (SELECT id FROM public.geo_countries WHERE code = 'TN')
INSERT INTO public.geo_regions (country_id, code, label_fr, label_ar, level, sort_order)
SELECT tn.id, code, label_fr, label_ar, 1, sort_order FROM tn,
  (VALUES
    ('tunis','Tunis','تونس',1),('ariana','Ariana','أريانة',2),('ben_arous','Ben Arous','بن عروس',3),
    ('manouba','Manouba','منوبة',4),('nabeul','Nabeul','نابل',5),('zaghouan','Zaghouan','زغوان',6),
    ('bizerte','Bizerte','بنزرت',7),('beja','Béja','باجة',8),('jendouba','Jendouba','جندوبة',9),
    ('le_kef','Le Kef','الكاف',10),('siliana','Siliana','سليانة',11),('kairouan','Kairouan','القيروان',12),
    ('kasserine','Kasserine','القصرين',13),('sidi_bouzid','Sidi Bouzid','سيدي بوزيد',14),
    ('sousse','Sousse','سوسة',15),('monastir','Monastir','المنستير',16),('mahdia','Mahdia','المهدية',17),
    ('sfax','Sfax','صفاقس',18),('gafsa','Gafsa','قفصة',19),('tozeur','Tozeur','توزر',20),
    ('kebili','Kebili','قبلي',21),('gabes','Gabès','قابس',22),('medenine','Medenine','مدنين',23),
    ('tataouine','Tataouine','تطاوين',24)
  ) AS data(code, label_fr, label_ar, sort_order)
ON CONFLICT (country_id, code) DO NOTHING;
