CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "app_settings_public_read" ON public.app_settings;
CREATE POLICY "app_settings_public_read" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "app_settings_admin_write" ON public.app_settings;
CREATE POLICY "app_settings_admin_write" ON public.app_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;

INSERT INTO public.app_settings (key, value, description) VALUES
  ('brand', '{"name":"papimo","tagline_fr":"L''immobilier entre particuliers","tagline_ar":"العقارات بين الأفراد","tagline_en":"Real estate, peer to peer","logo_part1":"pap","logo_part2":"imo","contact_email":"contact@papimo.com"}'::jsonb, 'Identité de marque modifiable depuis admin'),
  ('seo', '{"default_title":"papimo - L''immobilier entre particuliers","twitter_handle":"@papimo","og_image":"/og-default.jpg"}'::jsonb, 'SEO global'),
  ('marketing', '{"hero_headline_fr":"L''immobilier, chez-vous et directement.","hero_subheadline_fr":"Annonces entre particuliers, sans agence, sans intermédiaire.","cta_primary_fr":"Publier mon bien","cta_secondary_fr":"Découvrir les biens"}'::jsonb, 'Textes marketing home'),
  ('contact', '{"email":"contact@papimo.com","phone":null,"address":null,"hours_fr":"Lundi-Vendredi 9h-18h"}'::jsonb, 'Coordonnées de contact')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description, updated_at = now();
