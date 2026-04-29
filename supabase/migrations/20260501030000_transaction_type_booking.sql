-- LODGE PR9.3 — Ajout valeur 'booking' à transaction_type pour paiement Séjours
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'public.transaction_type'::regtype
    AND enumlabel = 'booking'
  ) THEN
    ALTER TYPE public.transaction_type ADD VALUE 'booking';
  END IF;
END $$;
