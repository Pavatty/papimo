-- Enable RLS + grants on listings and profiles
-- Fixes HTTP 401 + Postgres 42501 "permission denied for table" on /rest/v1/listings

-- ============================================================
-- LISTINGS
-- ============================================================

-- 1. Privilèges Postgres de base (sans ça, RLS n'est même pas évalué)
GRANT SELECT ON public.listings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listings TO authenticated;

-- 2. Activer Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Lecture publique : tout le monde voit les annonces actives
DROP POLICY IF EXISTS "listings_public_read_active" ON public.listings;
CREATE POLICY "listings_public_read_active"
  ON public.listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

-- Lecture étendue : un user voit ses propres annonces quel que soit le statut
DROP POLICY IF EXISTS "listings_owner_read_all" ON public.listings;
CREATE POLICY "listings_owner_read_all"
  ON public.listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Création : un user authentifié peut créer ses propres annonces
DROP POLICY IF EXISTS "listings_owner_insert" ON public.listings;
CREATE POLICY "listings_owner_insert"
  ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- Modification : un user ne peut modifier que ses propres annonces
DROP POLICY IF EXISTS "listings_owner_update" ON public.listings;
CREATE POLICY "listings_owner_update"
  ON public.listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Suppression : un user ne peut supprimer que ses propres annonces
DROP POLICY IF EXISTS "listings_owner_delete" ON public.listings;
CREATE POLICY "listings_owner_delete"
  ON public.listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- ============================================================
-- PROFILES
-- ============================================================

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique des profils (pour afficher l'auteur d'une annonce)
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
CREATE POLICY "profiles_public_read"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Mise à jour : un user ne peut modifier que son propre profil
DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;
CREATE POLICY "profiles_owner_update"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insertion : un user crée son propre profil au signup
DROP POLICY IF EXISTS "profiles_owner_insert" ON public.profiles;
CREATE POLICY "profiles_owner_insert"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- SEQUENCES & FUNCTIONS RUNTIME
-- ============================================================

-- S'assurer que l'RPC search_listings reste exécutable
GRANT EXECUTE ON FUNCTION public.search_listings(JSONB) TO anon, authenticated;
