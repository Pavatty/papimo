-- LODGE PR0 — Cleanup module separation
-- Ajout module_name explicit pour distinguer Immobilier vs Séjours.
-- Backfill basé sur rental_type ('short_term' → sejours, sinon immobilier).
-- Note : transaction_type 'seasonal_rent' supprimé du publish flow ;
-- les listings legacy avec seasonal_rent (s'il y en a) sont migrés vers
-- rental_type='short_term' + module_name='sejours' avant le check.

-- =========================================================================
-- 1. Add column module_name si absent
-- =========================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listings' AND column_name = 'module_name'
  ) THEN
    ALTER TABLE public.listings ADD COLUMN module_name TEXT;
  END IF;
END $$;

-- =========================================================================
-- 2. Migrer listings legacy seasonal_rent → rental_type=short_term
--    (avant backfill module_name pour cohérence)
-- =========================================================================
UPDATE public.listings
SET rental_type = 'short_term'
WHERE transaction_type = 'seasonal_rent'
  AND (rental_type IS NULL OR rental_type != 'short_term');

-- Normaliser les seasonal_rent en transaction_type='rent' (puisque seasonal_rent
-- n'est plus une option Immobilier — la distinction se fait via rental_type).
UPDATE public.listings
SET transaction_type = 'rent'
WHERE transaction_type = 'seasonal_rent';

-- =========================================================================
-- 3. Backfill module_name
-- =========================================================================
UPDATE public.listings
SET module_name = CASE
  WHEN rental_type = 'short_term' THEN 'sejours'
  ELSE 'immobilier'
END
WHERE module_name IS NULL;

-- =========================================================================
-- 4. Constraint + NOT NULL + index
-- =========================================================================
ALTER TABLE public.listings
  ALTER COLUMN module_name SET NOT NULL;

ALTER TABLE public.listings
  ALTER COLUMN module_name SET DEFAULT 'immobilier';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'listings_module_name_check'
  ) THEN
    ALTER TABLE public.listings
      ADD CONSTRAINT listings_module_name_check
      CHECK (module_name IN ('immobilier', 'sejours', 'rentacar', 'experiences', 'services'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS listings_module_name_idx ON public.listings(module_name);

-- =========================================================================
-- 5. Sanity check : NOTICE pour audit
-- =========================================================================
DO $$
DECLARE
  total INT;
  immobilier INT;
  sejours INT;
  legacy_seasonal INT;
BEGIN
  SELECT COUNT(*) INTO total FROM public.listings;
  SELECT COUNT(*) INTO immobilier FROM public.listings WHERE module_name = 'immobilier';
  SELECT COUNT(*) INTO sejours FROM public.listings WHERE module_name = 'sejours';
  SELECT COUNT(*) INTO legacy_seasonal FROM public.listings WHERE transaction_type = 'seasonal_rent';
  RAISE NOTICE 'Module split: total=%, immobilier=%, sejours=%, residual seasonal_rent=%',
    total, immobilier, sejours, legacy_seasonal;
END $$;
