-- Idempotent: ensure tunismeet@gmail.com (id 0613d077-b93d-4a2c-8ae2-1864900ab735) has role='admin'.
-- Created in Phase 1 Session 2 to enable admin RLS policies on the new taxonomy tables.
DO $$
BEGIN
  -- Only update if profile exists; do not insert (auth.users seeding lives elsewhere)
  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = '0613d077-b93d-4a2c-8ae2-1864900ab735'::uuid
  ) THEN
    UPDATE public.profiles
       SET role = 'admin', updated_at = now()
     WHERE id = '0613d077-b93d-4a2c-8ae2-1864900ab735'::uuid
       AND (role IS NULL OR role <> 'admin');
  END IF;
END $$;
