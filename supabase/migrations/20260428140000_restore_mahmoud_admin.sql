-- Restore tunismeet@gmail.com (id 0613d077-b93d-4a2c-8ae2-1864900ab735) to role='admin'.
-- The first ensure (20260427210700) was overwritten by a buggy upsert in
-- src/lib/auth/session.ts that re-sent role='user' on every login. This file
-- restores the role and the companion code change makes the upsert role-safe
-- so a future login no longer downgrades admins.

DO $$
DECLARE
  is_admin_now BOOLEAN;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = '0613d077-b93d-4a2c-8ae2-1864900ab735'::uuid
  ) THEN
    RAISE EXCEPTION 'Profile 0613d077-b93d-4a2c-8ae2-1864900ab735 (tunismeet@gmail.com) not found in public.profiles';
  END IF;

  UPDATE public.profiles
     SET role = 'admin', updated_at = now()
   WHERE id = '0613d077-b93d-4a2c-8ae2-1864900ab735'::uuid
     AND (role IS NULL OR role <> 'admin');

  SELECT (role = 'admin') INTO is_admin_now
    FROM public.profiles
   WHERE id = '0613d077-b93d-4a2c-8ae2-1864900ab735'::uuid;

  IF NOT is_admin_now THEN
    RAISE EXCEPTION 'Failed to set role=admin on profile 0613d077-b93d-4a2c-8ae2-1864900ab735';
  END IF;

  RAISE NOTICE 'OK: profile 0613d077-b93d-4a2c-8ae2-1864900ab735 (Mahmoud) has role=admin';
END $$;
