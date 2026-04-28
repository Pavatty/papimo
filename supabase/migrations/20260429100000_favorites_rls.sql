-- Idempotent: ensure favorites table + RLS + grants are in place.
-- The table itself ships with the unified schema (types already reflect it),
-- but no dedicated migration enforces RLS, so admins on a fresh DB would
-- otherwise get a permission-denied error from REST. This migration is
-- safe to re-run.

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_listing_id_idx ON public.favorites(listing_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_owner_select" ON public.favorites;
CREATE POLICY "favorites_owner_select" ON public.favorites
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_owner_insert" ON public.favorites;
CREATE POLICY "favorites_owner_insert" ON public.favorites
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_owner_delete" ON public.favorites;
CREATE POLICY "favorites_owner_delete" ON public.favorites
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
