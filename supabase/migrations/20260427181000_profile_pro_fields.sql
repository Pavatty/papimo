-- Champs Pro pour les profils marqués "professional" (raison sociale, identifiant fiscal, etc.)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_name TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tax_id TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sector TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pro_address TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pro_rib TEXT;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT;
