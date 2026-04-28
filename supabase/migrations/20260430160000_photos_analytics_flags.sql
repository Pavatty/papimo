-- LODGE Phase 7.4 — Photos compression watermark + Analytics flags

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('watermark_enabled', true, 'Applique un watermark "LODGE.tn" sur les photos uploadées (côté client).'),
  ('plausible_enabled', true, 'Active le tracking Plausible (script injecté si consent analytics donné).')
ON CONFLICT (key) DO NOTHING;
