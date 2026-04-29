-- LODGE — Migration 4 segments + architecture paramétrable
-- 1. publisher_type étendu de 2 à 4 valeurs (pap, agency, developer, host)
-- 2. Migration legacy 'pro' → 'agency'
-- 3. RPC get_immobilier_publisher_counts retourne 4 colonnes
-- 4. Table pricing_plans + seed 8 plans
-- 5. Utilise app_settings (existant) et feature_flags (existant) — ajout entrées seulement

-- =========================================================================
-- 1. Étendre publisher_type à 4 valeurs
-- =========================================================================
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_publisher_type_check;

UPDATE public.profiles SET publisher_type = 'agency' WHERE publisher_type = 'pro';

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_publisher_type_check
  CHECK (publisher_type IN ('pap', 'agency', 'developer', 'host') OR publisher_type IS NULL);

-- =========================================================================
-- 2. Refactor RPC get_immobilier_publisher_counts (drop + recreate avec 4 cols)
-- =========================================================================
DROP FUNCTION IF EXISTS public.get_immobilier_publisher_counts() CASCADE;

CREATE FUNCTION public.get_immobilier_publisher_counts()
RETURNS TABLE(
  all_count BIGINT,
  pap_count BIGINT,
  agency_count BIGINT,
  developer_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) AS all_count,
    COUNT(*) FILTER (WHERE p.publisher_type = 'pap') AS pap_count,
    COUNT(*) FILTER (WHERE p.publisher_type = 'agency') AS agency_count,
    COUNT(*) FILTER (WHERE p.publisher_type = 'developer') AS developer_count
  FROM public.listings l
  LEFT JOIN public.profiles p ON l.owner_id = p.id
  WHERE l.module_name = 'immobilier' AND l.status = 'active';
$$;

GRANT EXECUTE ON FUNCTION public.get_immobilier_publisher_counts() TO anon, authenticated;

-- =========================================================================
-- 3. Table pricing_plans (NEW — différente de pricing_packs)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('pap', 'agency', 'developer', 'host')),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2),
  price_yearly NUMERIC(10,2),
  currency TEXT DEFAULT 'TND',
  billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly', 'one_time', 'commission')),
  listings_limit INTEGER,
  features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_visible_during_beta BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pricing_plans_segment ON public.pricing_plans(segment);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_active ON public.pricing_plans(is_active);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pricing_plans_select_public" ON public.pricing_plans;
CREATE POLICY "pricing_plans_select_public" ON public.pricing_plans
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "pricing_plans_admin_all" ON public.pricing_plans;
CREATE POLICY "pricing_plans_admin_all" ON public.pricing_plans
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

GRANT SELECT ON public.pricing_plans TO anon, authenticated;

-- Seed 8 plans
INSERT INTO public.pricing_plans (code, segment, name, description, price_monthly, currency, billing_interval, listings_limit, features, display_order, is_active, is_visible_during_beta) VALUES
  ('pap_free', 'pap', 'Particulier Gratuit', '3 annonces gratuites pour vendre ou louer.', 0, 'TND', 'monthly', 3, '{"boost_available": true, "photos_max": 10, "duration_days": 60}'::jsonb, 1, true, true),
  ('agency_starter', 'agency', 'Agence Starter', 'Pour agences indépendantes débutantes.', 89, 'TND', 'monthly', 10, '{"users_max": 1, "stats_basic": true, "vitrine_page": false}'::jsonb, 2, true, true),
  ('agency_pro', 'agency', 'Agence Pro', 'Pour agences moyennes avec équipe.', 249, 'TND', 'monthly', 50, '{"users_max": 3, "stats_advanced": true, "vitrine_page": true, "csv_export": true}'::jsonb, 3, true, true),
  ('agency_premium', 'agency', 'Agence Premium', 'Pour réseaux d''agences haut de gamme.', 599, 'TND', 'monthly', NULL, '{"users_max": null, "stats_advanced": true, "vitrine_page": true, "csv_export": true, "csv_import": true, "api_access": true, "priority_search": true}'::jsonb, 4, true, true),
  ('developer_starter', 'developer', 'Promoteur Starter', '1 programme + 20 lots + page dédiée.', 500, 'TND', 'monthly', 20, '{"programs_max": 1, "dedicated_page": true, "lead_capture": false}'::jsonb, 5, true, true),
  ('developer_pro', 'developer', 'Promoteur Pro', '5 programmes + 100 lots + section home.', 1500, 'TND', 'monthly', 100, '{"programs_max": 5, "dedicated_page": true, "lead_capture": true, "homepage_section": true}'::jsonb, 6, true, true),
  ('developer_premium', 'developer', 'Promoteur Premium', 'Illimité + bandeaux marketing exclusifs.', 3000, 'TND', 'monthly', NULL, '{"programs_max": null, "dedicated_page": true, "lead_capture": true, "homepage_section": true, "marketing_banners": true, "priority_search": true}'::jsonb, 7, true, true),
  ('host_commission', 'host', 'Hôte Séjours', 'Publication gratuite, commission sur réservation.', 0, 'TND', 'commission', NULL, '{"commission_host": 3, "commission_guest": 12, "instant_book": true}'::jsonb, 8, true, true)
ON CONFLICT (code) DO NOTHING;

-- =========================================================================
-- 4. INSERT settings dans app_settings existant — étendre les catégories
--    pour accepter limits / commissions / localization
-- =========================================================================
ALTER TABLE public.app_settings DROP CONSTRAINT IF EXISTS app_settings_category_check;
ALTER TABLE public.app_settings
  ADD CONSTRAINT app_settings_category_check
  CHECK (category IN ('monetization','features','moderation','pricing','emails','branding','seo','marketing','contact','limits','commissions','localization'));

INSERT INTO public.app_settings (key, value, description, category) VALUES
  ('limits.pap_free_listings', '3'::jsonb, 'Nombre d''annonces gratuites pour les PAP', 'limits'),
  ('limits.listing_duration_days', '60'::jsonb, 'Durée d''expiration d''une annonce en jours', 'limits'),
  ('limits.photos_max_per_listing', '20'::jsonb, 'Nombre maximum de photos par annonce', 'limits'),
  ('limits.boost_duration_days', '7'::jsonb, 'Durée d''un boost annonce en jours', 'limits'),
  ('commissions.sejours_host_pct', '3'::jsonb, 'Commission LODGE sur les hôtes Séjours (%)', 'commissions'),
  ('commissions.sejours_guest_pct', '12'::jsonb, 'Commission LODGE sur les voyageurs Séjours (%)', 'commissions'),
  ('boosts.featured_price_tnd', '15'::jsonb, 'Prix boost "À la une" 7 jours en TND', 'pricing'),
  ('boosts.premium_price_tnd', '40'::jsonb, 'Prix boost "Premium" 30 jours en TND', 'pricing'),
  ('boosts.refresh_price_tnd', '8'::jsonb, 'Prix renouvellement annonce en TND', 'pricing'),
  ('currencies.supported', '["TND","EUR","USD","MAD","AED","EGP"]'::jsonb, 'Devises supportées', 'localization'),
  ('currencies.default', '"TND"'::jsonb, 'Devise par défaut', 'localization'),
  ('countries.supported', '["TN","FR","BE","CA","DE","IT","ES","MA","DZ","EG","AE","SA","QA","CH","UK"]'::jsonb, 'Pays supportés', 'localization'),
  ('beta.enabled', 'true'::jsonb, 'Mode bêta actif (gratuit pour tous)', 'features'),
  ('beta.message', '"Bêta : gratuit pour les early adopters jusqu''à fin 2026."'::jsonb, 'Message bandeau bêta', 'features')
ON CONFLICT (key) DO NOTHING;

-- =========================================================================
-- 5. INSERT flags dans feature_flags existant
-- =========================================================================
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('billing.enabled', false, 'Facturation activée globalement'),
  ('billing.pap_boosts', false, 'Boosts payants pour PAP'),
  ('billing.agency_subscriptions', false, 'Abonnements payants Agences'),
  ('billing.developer_subscriptions', false, 'Abonnements payants Promoteurs'),
  ('publishers.developers_enabled', true, 'Segment Promoteur visible publiquement'),
  ('publishers.hosts_enabled', true, 'Segment Hôte Séjours visible publiquement'),
  ('modules.programs_neufs_section', true, 'Section Programmes Neufs visible sur la home'),
  ('search.advanced_filters', true, 'Filtres avancés sur /search'),
  ('home.featured_agencies_carousel', false, 'Carousel agences sponsorisées sur la home')
ON CONFLICT (key) DO NOTHING;

-- =========================================================================
-- 6. RPC : get_pricing_plans_for_segment
-- =========================================================================
DROP FUNCTION IF EXISTS public.get_pricing_plans_for_segment(TEXT);
CREATE FUNCTION public.get_pricing_plans_for_segment(p_segment TEXT)
RETURNS SETOF public.pricing_plans
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.pricing_plans
  WHERE segment = p_segment AND is_active = true
  ORDER BY display_order ASC;
$$;

GRANT EXECUTE ON FUNCTION public.get_pricing_plans_for_segment(TEXT) TO anon, authenticated;

-- =========================================================================
-- VERIFICATION
-- =========================================================================
DO $$
DECLARE
  pap_cnt INT; agency_cnt INT; developer_cnt INT;
  plans_cnt INT;
BEGIN
  SELECT COUNT(*) INTO pap_cnt FROM public.profiles WHERE publisher_type = 'pap';
  SELECT COUNT(*) INTO agency_cnt FROM public.profiles WHERE publisher_type = 'agency';
  SELECT COUNT(*) INTO developer_cnt FROM public.profiles WHERE publisher_type = 'developer';
  SELECT COUNT(*) INTO plans_cnt FROM public.pricing_plans;
  RAISE NOTICE 'Migration 4 segments OK : pap=%, agency=%, developer=%, plans=%',
    pap_cnt, agency_cnt, developer_cnt, plans_cnt;
END $$;
