CREATE TABLE IF NOT EXISTS public.pricing_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  price_monthly_tnd NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly_tnd NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_active_listings INTEGER NOT NULL DEFAULT 1,
  max_photos_per_listing INTEGER NOT NULL DEFAULT 5,
  active_days INTEGER NOT NULL DEFAULT 30,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_packs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "pricing_packs_public_read" ON public.pricing_packs;
CREATE POLICY "pricing_packs_public_read" ON public.pricing_packs FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "pricing_packs_admin_all" ON public.pricing_packs;
CREATE POLICY "pricing_packs_admin_all" ON public.pricing_packs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.pricing_packs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pricing_packs TO authenticated;

INSERT INTO public.pricing_packs (code, label_fr, label_ar, label_en, price_monthly_tnd, price_yearly_tnd, max_active_listings, max_photos_per_listing, active_days, features, is_recommended, sort_order) VALUES
  ('free', 'Free', 'مجاني', 'Free', 0, 0, 1, 5, 30, '["1 annonce active","5 photos","30 jours"]'::jsonb, false, 1),
  ('essential', 'Essential', 'أساسي', 'Essential', 29, 278, 3, 12, 60, '["3 annonces actives","12 photos","60 jours","Statistiques de vues"]'::jsonb, false, 2),
  ('comfort', 'Comfort', 'مريح', 'Comfort', 69, 662, 5, 20, 90, '["5 annonces actives","20 photos","90 jours","Vidéo","Top liste 7j","Statistiques détaillées"]'::jsonb, true, 3),
  ('premium', 'Premium', 'بريميوم', 'Premium', 149, 1430, 999, 30, 180, '["Annonces illimitées","30 photos","180 jours","Top accueil","Support prioritaire","Badge Premium"]'::jsonb, false, 4)
ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en,
  price_monthly_tnd = EXCLUDED.price_monthly_tnd, price_yearly_tnd = EXCLUDED.price_yearly_tnd,
  max_active_listings = EXCLUDED.max_active_listings, max_photos_per_listing = EXCLUDED.max_photos_per_listing,
  active_days = EXCLUDED.active_days, features = EXCLUDED.features, is_recommended = EXCLUDED.is_recommended,
  sort_order = EXCLUDED.sort_order, updated_at = now();
