-- LODGE PR9.1 — S'assurer que le bucket 'listings' existe (publique).
-- La publish action utilise déjà ce bucket en prod ; cette migration est idempotente.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'listings') THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('listings', 'listings', true);
  ELSE
    UPDATE storage.buckets SET public = true WHERE id = 'listings';
  END IF;
END $$;

DROP POLICY IF EXISTS "listings_public_read" ON storage.objects;
CREATE POLICY "listings_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

DROP POLICY IF EXISTS "listings_authenticated_upload" ON storage.objects;
CREATE POLICY "listings_authenticated_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "listings_owner_delete" ON storage.objects;
CREATE POLICY "listings_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'listings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "listings_owner_update" ON storage.objects;
CREATE POLICY "listings_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'listings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
