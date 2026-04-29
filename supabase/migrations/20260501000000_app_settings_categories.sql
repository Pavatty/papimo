-- LODGE PR0.5 — Settings System évolutif
-- Étend app_settings (existant) avec category + created_at + 23 nouveaux settings.
-- Format value reste JSONB (rétro-compat). Helpers TS normalisent string|number|boolean.

-- =========================================================================
-- 1. Ajouter colonnes category + created_at si absentes
-- =========================================================================
ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS category TEXT
  CHECK (category IN ('monetization', 'features', 'moderation', 'pricing', 'emails', 'branding', 'seo', 'marketing', 'contact'));

ALTER TABLE public.app_settings
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS app_settings_category_idx ON public.app_settings(category);

-- =========================================================================
-- 2. Backfill category pour les settings existants
-- =========================================================================
UPDATE public.app_settings SET category = 'branding' WHERE key = 'brand' AND category IS NULL;
UPDATE public.app_settings SET category = 'seo' WHERE key = 'seo' AND category IS NULL;
UPDATE public.app_settings SET category = 'marketing' WHERE key = 'marketing' AND category IS NULL;
UPDATE public.app_settings SET category = 'contact' WHERE key = 'contact' AND category IS NULL;
UPDATE public.app_settings SET category = 'monetization' WHERE key LIKE 'sejours_%' AND category IS NULL;
UPDATE public.app_settings SET category = 'moderation' WHERE key LIKE 'rate_limit_%' AND category IS NULL;
UPDATE public.app_settings SET category = 'moderation' WHERE key LIKE 'anti_agency_%' AND category IS NULL;

-- =========================================================================
-- 3. Insérer nouveaux settings — value en JSONB
-- =========================================================================
INSERT INTO public.app_settings (key, value, description, category) VALUES
  -- monetization
  ('free_listings_limit_individual', '3'::jsonb, 'Max annonces gratuites par particulier', 'monetization'),
  ('free_listings_limit_agency', '0'::jsonb, 'Max annonces gratuites pour agences (0 = obligatoire payant)', 'monetization'),
  ('pro_plan_starter_price', '100'::jsonb, 'Forfait Starter Pro (TND/an)', 'monetization'),
  ('pro_plan_business_price', '300'::jsonb, 'Forfait Business Pro (TND/an)', 'monetization'),
  ('pro_plan_premium_price', '500'::jsonb, 'Forfait Premium Pro (TND/an)', 'monetization'),

  -- features (miroir des feature_flags pour admin UI)
  ('sejours_enabled', 'true'::jsonb, 'LODGE Séjours activé', 'features'),
  ('instant_booking_enabled', 'true'::jsonb, 'Réservation instantanée sans validation hôte', 'features'),
  ('reviews_enabled', 'true'::jsonb, 'Système avis bidirectionnels', 'features'),
  ('verification_required', 'false'::jsonb, 'Vérification identité obligatoire pour réserver', 'features'),
  ('ai_recommendations_enabled', 'false'::jsonb, 'Recommandations IA (Phase 12)', 'features'),
  ('messaging_enabled', 'true'::jsonb, 'Messagerie temps réel', 'features'),

  -- moderation
  ('listing_price_min', '10'::jsonb, 'Prix minimum listing (TND)', 'moderation'),
  ('listing_price_max', '10000000'::jsonb, 'Prix maximum listing (TND)', 'moderation'),
  ('listing_photos_min', '3'::jsonb, 'Photos minimum par listing', 'moderation'),
  ('listing_photos_max', '20'::jsonb, 'Photos maximum par listing', 'moderation'),
  ('listing_description_min_chars', '50'::jsonb, 'Description minimum (caractères)', 'moderation'),
  ('booking_cancellation_limit', '3'::jsonb, 'Auto-ban si X annulations guest consécutives', 'moderation'),

  -- pricing dynamique defaults
  ('pricing_weekend_increase_percent', '20'::jsonb, 'Augmentation weekend par défaut (%)', 'pricing'),
  ('pricing_summer_increase_percent', '50'::jsonb, 'Augmentation été par défaut (%)', 'pricing'),
  ('pricing_longstay_7days_discount', '10'::jsonb, 'Réduction 7+ nuits (%)', 'pricing'),
  ('pricing_longstay_30days_discount', '25'::jsonb, 'Réduction 30+ nuits (%)', 'pricing')
ON CONFLICT (key) DO UPDATE SET
  category = COALESCE(public.app_settings.category, EXCLUDED.category),
  description = COALESCE(public.app_settings.description, EXCLUDED.description);
