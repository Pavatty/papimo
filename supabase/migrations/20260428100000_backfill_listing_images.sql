-- Backfill listing_images from listings.photos (text[]).
-- Phase 1.5 fix: detail page reads listing_images relation but the table was empty,
-- while listings.photos carried the URLs. Mirror them so the gallery shows.
-- Idempotent: drop existing rows for these listings before re-inserting.

DELETE FROM public.listing_images
WHERE listing_id IN (
  SELECT id FROM public.listings
  WHERE photos IS NOT NULL AND array_length(photos, 1) > 0
);

INSERT INTO public.listing_images (listing_id, url, position, is_cover, alt_text)
SELECT
  l.id AS listing_id,
  photo.url AS url,
  (photo.ordinality - 1)::int AS position,
  (photo.ordinality = 1) AS is_cover,
  l.title AS alt_text
FROM public.listings l
CROSS JOIN LATERAL unnest(l.photos) WITH ORDINALITY AS photo(url, ordinality)
WHERE l.photos IS NOT NULL AND array_length(l.photos, 1) > 0;
