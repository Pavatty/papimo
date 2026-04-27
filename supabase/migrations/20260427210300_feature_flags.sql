CREATE TABLE IF NOT EXISTS public.feature_flags (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  rollout_pct INTEGER NOT NULL DEFAULT 0 CHECK (rollout_pct BETWEEN 0 AND 100),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "feature_flags_public_read" ON public.feature_flags;
CREATE POLICY "feature_flags_public_read" ON public.feature_flags FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "feature_flags_admin_write" ON public.feature_flags;
CREATE POLICY "feature_flags_admin_write" ON public.feature_flags FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.feature_flags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.feature_flags TO authenticated;

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('beta_mode', true, 'Bêta privée — tout gratuit, monétisation cachée'),
  ('monetization_disabled', true, 'Cache packs payants Essential/Comfort/Premium'),
  ('favorites_enabled', false, 'Activation système favoris (cœur)'),
  ('saved_searches_enabled', false, 'Sauvegarde recherches + alertes email'),
  ('messaging_enabled', false, 'Messagerie acheteur ↔ vendeur'),
  ('ai_descriptions', false, 'Génération de description par IA Claude'),
  ('ai_price_estimation', false, 'Estimation automatique prix'),
  ('phone_proxy_enabled', false, 'Numéro masqué Twilio (15min)'),
  ('reviews_enabled', false, 'Avis et ratings post-transaction'),
  ('admin_audit_log', true, 'Journal des actions admin')
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description, updated_at = now();
