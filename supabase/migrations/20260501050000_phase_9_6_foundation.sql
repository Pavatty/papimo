-- LODGE Phase 9.6 Foundation
-- 7 tables admin/moderation/IA + 3 helper functions + RLS policies.
-- Tout est IF NOT EXISTS / DO blocks pour idempotence.

-- =========================================================================
-- 1. admin_permissions (RBAC)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- =========================================================================
-- 2. admin_activity_log (audit trail)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 3. moderation_queue
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('listing', 'review', 'user', 'report')),
  entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  reason TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  decided_by UUID REFERENCES auth.users(id),
  decision_notes TEXT,
  ai_confidence FLOAT,
  ai_recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);

-- =========================================================================
-- 4. user_reports (signalements)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  reported_entity_type TEXT NOT NULL CHECK (reported_entity_type IN ('listing', 'user', 'review', 'message')),
  reported_entity_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'fraud', 'inappropriate', 'offensive', 'duplicate', 'misleading', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- =========================================================================
-- 5. user_bans
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_by UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  ban_type TEXT NOT NULL DEFAULT 'permanent' CHECK (ban_type IN ('temporary', 'permanent')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lifted_at TIMESTAMPTZ,
  lifted_by UUID REFERENCES auth.users(id)
);

-- =========================================================================
-- 6. ai_decisions (log IA)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence FLOAT NOT NULL,
  model_version TEXT NOT NULL DEFAULT 'claude-sonnet-4-5',
  auto_executed BOOLEAN NOT NULL DEFAULT false,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- 7. ai_training_feedback (feedback humain → IA)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ai_training_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID NOT NULL REFERENCES public.ai_decisions(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  was_correct BOOLEAN NOT NULL,
  correct_decision TEXT,
  feedback_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_admin_permissions_user ON public.admin_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin ON public.admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created ON public.admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON public.moderation_queue(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_bans_user ON public.user_bans(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_type ON public.ai_decisions(decision_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_entity ON public.ai_decisions(entity_type, entity_id);

-- =========================================================================
-- HELPER FUNCTIONS
-- DROP préalable car les anciennes signatures peuvent exister avec des
-- paramètres nommés différemment (CREATE OR REPLACE ne peut pas renommer).
-- =========================================================================
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;
CREATE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_permissions WHERE user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS public.get_admin_role(UUID) CASCADE;
CREATE FUNCTION public.get_admin_role(check_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.admin_permissions WHERE user_id = check_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS public.is_user_banned(UUID) CASCADE;
CREATE FUNCTION public.is_user_banned(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_bans
    WHERE user_id = check_user_id
      AND lifted_at IS NULL
      AND (ban_type = 'permanent' OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- RLS
-- =========================================================================
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_feedback ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_permissions_select' AND tablename = 'admin_permissions') THEN
    CREATE POLICY admin_permissions_select ON public.admin_permissions FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_permissions_all' AND tablename = 'admin_permissions') THEN
    CREATE POLICY admin_permissions_all ON public.admin_permissions FOR ALL USING (public.get_admin_role(auth.uid()) = 'super_admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'activity_log_select' AND tablename = 'admin_activity_log') THEN
    CREATE POLICY activity_log_select ON public.admin_activity_log FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'activity_log_insert' AND tablename = 'admin_activity_log') THEN
    CREATE POLICY activity_log_insert ON public.admin_activity_log FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'moderation_select' AND tablename = 'moderation_queue') THEN
    CREATE POLICY moderation_select ON public.moderation_queue FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'moderation_all' AND tablename = 'moderation_queue') THEN
    CREATE POLICY moderation_all ON public.moderation_queue FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reports_insert' AND tablename = 'user_reports') THEN
    CREATE POLICY reports_insert ON public.user_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'reports_select' AND tablename = 'user_reports') THEN
    CREATE POLICY reports_select ON public.user_reports FOR SELECT USING (public.is_admin(auth.uid()) OR auth.uid() = reporter_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bans_select' AND tablename = 'user_bans') THEN
    CREATE POLICY bans_select ON public.user_bans FOR SELECT USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'bans_all' AND tablename = 'user_bans') THEN
    CREATE POLICY bans_all ON public.user_bans FOR ALL USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_decisions_select' AND tablename = 'ai_decisions') THEN
    CREATE POLICY ai_decisions_select ON public.ai_decisions FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_decisions_insert' AND tablename = 'ai_decisions') THEN
    CREATE POLICY ai_decisions_insert ON public.ai_decisions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_feedback_select' AND tablename = 'ai_training_feedback') THEN
    CREATE POLICY ai_feedback_select ON public.ai_training_feedback FOR SELECT USING (public.is_admin(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_feedback_insert' AND tablename = 'ai_training_feedback') THEN
    CREATE POLICY ai_feedback_insert ON public.ai_training_feedback FOR INSERT WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- =========================================================================
-- GRANT pour authenticated (RLS gérera l'accès)
-- =========================================================================
GRANT SELECT ON public.admin_permissions TO authenticated;
GRANT SELECT, INSERT ON public.admin_activity_log TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.moderation_queue TO authenticated;
GRANT SELECT, INSERT ON public.user_reports TO authenticated;
GRANT SELECT ON public.user_bans TO authenticated;
GRANT SELECT, INSERT ON public.ai_decisions TO authenticated;
GRANT SELECT, INSERT ON public.ai_training_feedback TO authenticated;

-- =========================================================================
-- SEED Mahmoud super_admin (idempotent)
-- =========================================================================
INSERT INTO public.admin_permissions (user_id, role)
VALUES ('0613d077-b93d-4a2c-8ae2-1864900ab735', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

DO $$
DECLARE
  cnt INT;
BEGIN
  SELECT COUNT(*) INTO cnt FROM public.admin_permissions WHERE role = 'super_admin';
  RAISE NOTICE 'Phase 9.6 Foundation: % super_admin(s) registered', cnt;
END $$;
