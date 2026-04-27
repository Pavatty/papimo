-- Grant + RLS pour les tables jointes utilisées par la page détail annonce.
-- listing_images et listing_amenities sont lues anonymement quand la listing
-- parente est `status='active'` (RLS publique sur listings déjà en place).

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_amenities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "listing_images_public_read" ON public.listing_images;
CREATE POLICY "listing_images_public_read" ON public.listing_images
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_images.listing_id
        AND listings.status = 'active'
    )
  );

DROP POLICY IF EXISTS "listing_amenities_public_read" ON public.listing_amenities;
CREATE POLICY "listing_amenities_public_read" ON public.listing_amenities
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_amenities.listing_id
        AND listings.status = 'active'
    )
  );

-- Owners peuvent voir leurs propres images/amenities sur annonces non-active aussi
DROP POLICY IF EXISTS "listing_images_owner_all" ON public.listing_images;
CREATE POLICY "listing_images_owner_all" ON public.listing_images
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_images.listing_id
        AND listings.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_images.listing_id
        AND listings.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "listing_amenities_owner_all" ON public.listing_amenities;
CREATE POLICY "listing_amenities_owner_all" ON public.listing_amenities
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_amenities.listing_id
        AND listings.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_amenities.listing_id
        AND listings.owner_id = auth.uid()
    )
  );

GRANT SELECT ON public.listing_images, public.listing_amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.listing_images, public.listing_amenities TO authenticated;
