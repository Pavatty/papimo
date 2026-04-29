-- LODGE = Immobilier + Séjours uniquement.
-- Resserre la CHECK constraint sur listings.module_name (avant : 5 modules).

DO $$
BEGIN
  -- Vérifier qu'aucune ligne orpheline n'existe avec un module retiré
  IF EXISTS (
    SELECT 1 FROM public.listings
    WHERE module_name NOT IN ('immobilier', 'sejours')
  ) THEN
    RAISE EXCEPTION 'Aborting: orphan listings detected with module_name not in (immobilier, sejours).';
  END IF;
END $$;

ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_module_name_check;

ALTER TABLE public.listings
  ADD CONSTRAINT listings_module_name_check
  CHECK (module_name IN ('immobilier', 'sejours'));

DO $$
DECLARE
  immobilier_cnt INT;
  sejours_cnt INT;
BEGIN
  SELECT COUNT(*) INTO immobilier_cnt FROM public.listings WHERE module_name = 'immobilier';
  SELECT COUNT(*) INTO sejours_cnt FROM public.listings WHERE module_name = 'sejours';
  RAISE NOTICE 'Module distribution: immobilier=%, sejours=%', immobilier_cnt, sejours_cnt;
END $$;
