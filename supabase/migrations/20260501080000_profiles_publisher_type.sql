-- LODGE — Ajout publisher_type à profiles pour distinguer Particulier vs Agence
-- Default 'pap' (Particulier). Les agences seront upgradées via /admin ou onboarding pro.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS publisher_type TEXT
  DEFAULT 'pap'
  CHECK (publisher_type IN ('pap', 'pro'));

UPDATE public.profiles
SET publisher_type = 'pap'
WHERE publisher_type IS NULL;

ALTER TABLE public.profiles
  ALTER COLUMN publisher_type SET NOT NULL;

CREATE INDEX IF NOT EXISTS profiles_publisher_type_idx ON public.profiles(publisher_type);
