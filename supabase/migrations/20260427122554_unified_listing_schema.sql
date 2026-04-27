-- ============================================================
-- Migration : Unified Listing Schema for papimo
-- Aligne la table listings sur le schéma de listing-schema.ts
-- ============================================================

-- Activer PostGIS si pas déjà actif (pour les requêtes géographiques)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- TABLE listings : ajout / modification de colonnes
-- ============================================================

-- Transaction & property type (texte simple, validés côté app)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS transaction_type TEXT NOT NULL DEFAULT 'sale';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS property_type TEXT NOT NULL DEFAULT 'apartment';

-- Identité de l'annonce
ALTER TABLE listings ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Prix et devise
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price_currency TEXT NOT NULL DEFAULT 'TND';

-- Caractéristiques numériques
ALTER TABLE listings ADD COLUMN IF NOT EXISTS surface_area NUMERIC(10, 2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS rooms_total INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS bedrooms INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS bathrooms INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS floor INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS total_floors INTEGER;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS construction_year INTEGER;

-- Caractéristiques qualitatives
ALTER TABLE listings ADD COLUMN IF NOT EXISTS heating_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS dpe_rating TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS orientation TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS furnished_level TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition TEXT;

-- Géographie
ALTER TABLE listings ADD COLUMN IF NOT EXISTS country TEXT NOT NULL DEFAULT 'TN';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7);

-- Géolocalisation PostGIS pour les requêtes spatiales
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location GEOGRAPHY(POINT, 4326);

-- Équipements (array de clés)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Photos
ALTER TABLE listings ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE listings ADD COLUMN IF NOT EXISTS main_photo TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Statut et pack
ALTER TABLE listings ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pack_type TEXT NOT NULL DEFAULT 'free';

-- Stats
ALTER TABLE listings ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- Timestamps métier
ALTER TABLE listings ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- ============================================================
-- Trigger : sync location (PostGIS) avec lat/lng
-- ============================================================

CREATE OR REPLACE FUNCTION sync_listing_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listings_sync_location ON listings;
CREATE TRIGGER listings_sync_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON listings
FOR EACH ROW
EXECUTE FUNCTION sync_listing_location();

-- ============================================================
-- Indexes pour la performance de la recherche
-- ============================================================

CREATE INDEX IF NOT EXISTS listings_status_idx ON listings (status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS listings_transaction_type_idx ON listings (transaction_type);
CREATE INDEX IF NOT EXISTS listings_property_type_idx ON listings (property_type);
CREATE INDEX IF NOT EXISTS listings_country_idx ON listings (country);
CREATE INDEX IF NOT EXISTS listings_city_idx ON listings (city);
CREATE INDEX IF NOT EXISTS listings_price_idx ON listings (price);
CREATE INDEX IF NOT EXISTS listings_surface_idx ON listings (surface_area);
CREATE INDEX IF NOT EXISTS listings_published_at_idx ON listings (published_at DESC);
CREATE INDEX IF NOT EXISTS listings_amenities_gin_idx ON listings USING GIN (amenities);
CREATE INDEX IF NOT EXISTS listings_location_gist_idx ON listings USING GIST (location);

-- ============================================================
-- RPC search_listings : recherche multi-critères performante
-- ============================================================

CREATE OR REPLACE FUNCTION search_listings(filters JSONB DEFAULT '{}'::jsonb)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  title TEXT,
  description TEXT,
  slug TEXT,
  transaction_type TEXT,
  property_type TEXT,
  price NUMERIC,
  price_currency TEXT,
  surface_area NUMERIC,
  rooms_total INTEGER,
  bedrooms INTEGER,
  bathrooms INTEGER,
  country TEXT,
  region TEXT,
  city TEXT,
  neighborhood TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  amenities TEXT[],
  photos TEXT[],
  main_photo TEXT,
  status TEXT,
  view_count INTEGER,
  published_at TIMESTAMPTZ,
  total_count BIGINT
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_transaction_type TEXT := filters->>'transaction_type';
  v_property_types TEXT[] := ARRAY(SELECT jsonb_array_elements_text(COALESCE(filters->'property_types', '[]'::jsonb)));
  v_country TEXT := filters->>'country';
  v_region TEXT := filters->>'region';
  v_city TEXT := filters->>'city';
  v_neighborhoods TEXT[] := ARRAY(SELECT jsonb_array_elements_text(COALESCE(filters->'neighborhoods', '[]'::jsonb)));
  v_price_min NUMERIC := COALESCE((filters->>'price_min')::numeric, 0);
  v_price_max NUMERIC := COALESCE((filters->>'price_max')::numeric, 999999999);
  v_surface_min NUMERIC := COALESCE((filters->>'surface_min')::numeric, 0);
  v_surface_max NUMERIC := COALESCE((filters->>'surface_max')::numeric, 999999);
  v_rooms_min INTEGER := COALESCE((filters->>'rooms_min')::int, 0);
  v_bedrooms_min INTEGER := COALESCE((filters->>'bedrooms_min')::int, 0);
  v_amenities_required TEXT[] := ARRAY(SELECT jsonb_array_elements_text(COALESCE(filters->'amenities', '[]'::jsonb)));
  v_published_since INTERVAL := COALESCE((filters->>'published_since')::interval, '100 years'::interval);
  v_sort TEXT := COALESCE(filters->>'sort', 'recent');
  v_page INTEGER := COALESCE((filters->>'page')::int, 1);
  v_page_size INTEGER := LEAST(COALESCE((filters->>'page_size')::int, 20), 100);
  v_offset INTEGER;
BEGIN
  v_offset := (v_page - 1) * v_page_size;

  RETURN QUERY
  WITH filtered AS (
    SELECT
      l.*,
      COUNT(*) OVER () AS total
    FROM listings l
    WHERE l.status = 'active'
      AND (v_transaction_type IS NULL OR l.transaction_type = v_transaction_type)
      AND (cardinality(v_property_types) = 0 OR l.property_type = ANY(v_property_types))
      AND (v_country IS NULL OR l.country = v_country)
      AND (v_region IS NULL OR l.region = v_region)
      AND (v_city IS NULL OR l.city = v_city)
      AND (cardinality(v_neighborhoods) = 0 OR l.neighborhood = ANY(v_neighborhoods))
      AND (l.price IS NULL OR (l.price >= v_price_min AND l.price <= v_price_max))
      AND (l.surface_area IS NULL OR (l.surface_area >= v_surface_min AND l.surface_area <= v_surface_max))
      AND (l.rooms_total IS NULL OR l.rooms_total >= v_rooms_min)
      AND (l.bedrooms IS NULL OR l.bedrooms >= v_bedrooms_min)
      AND (cardinality(v_amenities_required) = 0 OR l.amenities @> v_amenities_required)
      AND (l.published_at IS NULL OR l.published_at >= NOW() - v_published_since)
  )
  SELECT
    f.id, f.owner_id, f.title, f.description, f.slug,
    f.transaction_type, f.property_type, f.price, f.price_currency,
    f.surface_area, f.rooms_total, f.bedrooms, f.bathrooms,
    f.country, f.region, f.city, f.neighborhood,
    f.latitude, f.longitude, f.amenities, f.photos, f.main_photo,
    f.status, f.view_count, f.published_at,
    f.total
  FROM filtered f
  ORDER BY
    CASE WHEN v_sort = 'recent' THEN f.published_at END DESC NULLS LAST,
    CASE WHEN v_sort = 'price_asc' THEN f.price END ASC NULLS LAST,
    CASE WHEN v_sort = 'price_desc' THEN f.price END DESC NULLS LAST,
    CASE WHEN v_sort = 'surface_desc' THEN f.surface_area END DESC NULLS LAST,
    CASE WHEN v_sort = 'price_per_sqm_asc' THEN (f.price / NULLIF(f.surface_area, 0)) END ASC NULLS LAST
  LIMIT v_page_size
  OFFSET v_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION search_listings(JSONB) TO authenticated, anon;

-- ============================================================
-- Fin de la migration
-- ============================================================
