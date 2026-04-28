-- LODGE Phase 7.3 — Chatbot support + Weekly digest flags

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('chatbot_enabled', false, 'Active le chatbot support 24/7 (Claude Haiku, à activer après tests).'),
  ('weekly_digest_enabled', true, 'Active le cron weekly digest (lundi 9h UTC) qui envoie aux opt-in.')
ON CONFLICT (key) DO NOTHING;
