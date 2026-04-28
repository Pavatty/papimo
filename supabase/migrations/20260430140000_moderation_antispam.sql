-- LODGE Phase 7.2 — Modération IA + Anti-spam
-- Tables: moderation_logs (audit IA), user_rate_limits (anti-spam quota)
-- Flags: ai_moderation_enabled, rate_limit_enabled, anti_agency_enabled, max_free_listings

-- =========================================================================
-- moderation_logs : audit trail des décisions IA + règles
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('approved', 'rejected', 'manual_review', 'pending')),
  source text NOT NULL CHECK (source IN ('ai_claude', 'rules', 'admin')) DEFAULT 'rules',
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ai_score numeric(3,2),
  ai_raw_response text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moderation_logs_listing_idx ON public.moderation_logs(listing_id);
CREATE INDEX IF NOT EXISTS moderation_logs_user_idx ON public.moderation_logs(user_id);
CREATE INDEX IF NOT EXISTS moderation_logs_created_idx ON public.moderation_logs(created_at DESC);

ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "moderation_logs_admin_read" ON public.moderation_logs;
CREATE POLICY "moderation_logs_admin_read" ON public.moderation_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "moderation_logs_owner_read" ON public.moderation_logs;
CREATE POLICY "moderation_logs_owner_read" ON public.moderation_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- =========================================================================
-- user_rate_limits : 1 ligne par user/jour, compte les publications
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_rate_limits (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT CURRENT_DATE,
  publish_count integer NOT NULL DEFAULT 0,
  last_publish_at timestamptz,
  PRIMARY KEY (user_id, day)
);

CREATE INDEX IF NOT EXISTS user_rate_limits_day_idx ON public.user_rate_limits(day DESC);

ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_rate_limits_self_read" ON public.user_rate_limits;
CREATE POLICY "user_rate_limits_self_read" ON public.user_rate_limits
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_rate_limits_admin_read" ON public.user_rate_limits;
CREATE POLICY "user_rate_limits_admin_read" ON public.user_rate_limits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =========================================================================
-- Feature flags Phase 7.2
-- =========================================================================
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('ai_moderation_enabled', false, 'Active la modération IA via Claude (sinon règles seules).'),
  ('rate_limit_enabled', true, 'Active la limite de publications par jour (anti-spam).'),
  ('anti_agency_enabled', true, 'Bloque les comptes qui ressemblent à des agences (max N annonces gratuites).'),
  ('max_free_listings', true, 'Active la limite de N annonces actives gratuites par compte (N=3).')
ON CONFLICT (key) DO NOTHING;

-- =========================================================================
-- app_settings: paramètres numériques (valeurs ajustables sans déploiement)
-- =========================================================================
INSERT INTO public.app_settings (key, value, description) VALUES
  ('rate_limit_publish_per_day', '3'::jsonb, 'Nombre maximal de publications (submitForReview) par utilisateur par jour.'),
  ('anti_agency_max_free_listings', '3'::jsonb, 'Nombre maximal d''annonces actives gratuites avant blocage anti-agence.')
ON CONFLICT (key) DO NOTHING;
