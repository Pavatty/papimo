-- LODGE Phase 6 — CMS home_sections table + 9 home toggle flags +
-- monetization_enabled (DB-driven flip from NEXT_PUBLIC_BETA_DISABLE_MONETIZATION).

CREATE TABLE IF NOT EXISTS public.cms_home_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  section_type TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 100,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cms_home_sections_active_sort_idx
  ON public.cms_home_sections(active, sort_order)
  WHERE active = TRUE;

ALTER TABLE public.cms_home_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_home_sections_public_read" ON public.cms_home_sections;
CREATE POLICY "cms_home_sections_public_read"
  ON public.cms_home_sections FOR SELECT
  TO anon, authenticated
  USING (active = TRUE);

DROP POLICY IF EXISTS "cms_home_sections_admin_all" ON public.cms_home_sections;
CREATE POLICY "cms_home_sections_admin_all"
  ON public.cms_home_sections FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.cms_home_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_home_sections TO authenticated;

CREATE OR REPLACE FUNCTION public.touch_cms_home_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cms_home_sections_touch ON public.cms_home_sections;
CREATE TRIGGER cms_home_sections_touch
  BEFORE UPDATE ON public.cms_home_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_cms_home_sections_updated_at();

-- Feature flags (Phase 6) — 9 toggles + monetization_enabled
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('monetization_enabled', false, 'Active la monétisation (packs, paywalls). Désactivé en bêta.'),
  ('show_header_publish_btn', true, 'Bouton "Publier mon bien" dans le header desktop.'),
  ('show_sticky_publish_cta', true, 'CTA flottant "Publier" au scroll sur la home.'),
  ('show_trust_signals', true, 'Bandeau Trust Signals sur la home.'),
  ('show_quick_filters', true, 'Section "Recherches populaires" sur la home.'),
  ('show_why_lodge', true, 'Section "Pourquoi LODGE" sur la home.'),
  ('show_how_it_works', true, 'Section "Comment ça marche" sur la home.'),
  ('show_categories_explorer', true, 'Section "Explorer par catégorie" sur la home.'),
  ('show_tools_section', true, 'Section "Outils gratuits" sur la home.')
ON CONFLICT (key) DO NOTHING;

-- Seed home sections
INSERT INTO public.cms_home_sections (section_key, section_type, sort_order, active, content_json) VALUES
  ('hero', 'hero', 10, true, '{
    "headline_fr": {"line1": "Là où votre projet prend vie,", "line2": "entre particuliers."},
    "headline_ar": {"line1": "حيث يأخذ مشروعك حياته،", "line2": "بين الأفراد."},
    "headline_en": {"line1": "Where your project comes to life,", "line2": "between individuals."},
    "subline_fr": "Vendez, achetez et louez sans frais d''agence.",
    "subline_ar": "بيعوا، اشتروا واستأجروا بدون عمولات وكالة.",
    "subline_en": "Sell, buy and rent with no agency fees.",
    "color_line1": "#1A1A1A",
    "color_line2": "#1B5E3F",
    "background_texture": "true",
    "background_opacity": "0.06"
  }'::jsonb),
  ('trust_signals', 'trust_signals', 30, true, '{
    "items": [
      {"key": "secure", "icon": "Shield", "label_fr": "Données sécurisées", "label_ar": "بيانات مؤمنة", "label_en": "Secure data"},
      {"key": "p2p", "icon": "Users", "label_fr": "Particulier à particulier", "label_ar": "من فرد إلى فرد", "label_en": "Peer to peer"},
      {"key": "fast", "icon": "Zap", "label_fr": "Contact direct & rapide", "label_ar": "اتصال مباشر وسريع", "label_en": "Direct & fast contact"},
      {"key": "verified", "icon": "BadgeCheck", "label_fr": "Annonces vérifiées", "label_ar": "إعلانات موثقة", "label_en": "Verified listings"}
    ]
  }'::jsonb),
  ('quick_filters', 'quick_filters', 40, true, '{
    "title_fr": "Recherches populaires", "title_ar": "البحوث الشائعة", "title_en": "Popular searches",
    "items": [
      {"key": "studios", "icon": "Home", "label_fr": "Studios à louer", "label_ar": "ستوديوهات للإيجار", "label_en": "Studios for rent", "href": "/search?type=studio&trans=rent"},
      {"key": "villas", "icon": "Building2", "label_fr": "Villas avec piscine", "label_ar": "فيلات بمسبح", "label_en": "Villas with pool", "href": "/search?type=villa"},
      {"key": "seaview", "icon": "MapPin", "label_fr": "Vue mer", "label_ar": "إطلالة بحر", "label_en": "Sea view", "href": "/search?q=mer"},
      {"key": "commercial", "icon": "Briefcase", "label_fr": "Locaux commerciaux", "label_ar": "محلات تجارية", "label_en": "Commercial spaces", "href": "/search?type=commercial"},
      {"key": "furnished", "icon": "Bath", "label_fr": "Meublés", "label_ar": "مفروش", "label_en": "Furnished", "href": "/search?q=meuble"},
      {"key": "students", "icon": "GraduationCap", "label_fr": "Pour étudiants", "label_ar": "للطلاب", "label_en": "For students", "href": "/search?type=studio"}
    ]
  }'::jsonb),
  ('why_lodge', 'why_lodge', 60, true, '{
    "title_fr": "Pourquoi LODGE ?", "title_ar": "لماذا LODGE؟", "title_en": "Why LODGE?",
    "subtitle_fr": "Une plateforme pensée pour les particuliers, sans intermédiaires.",
    "subtitle_ar": "منصة مصممة للأفراد، بدون وسطاء.",
    "subtitle_en": "A platform designed for individuals, with no intermediaries.",
    "items": [
      {"key": "savings", "icon": "TrendingDown", "highlight": "0 %", "title_fr": "Économies réelles", "title_ar": "وفورات حقيقية", "title_en": "Real savings", "desc_fr": "Pas de commission d''agence sur votre transaction.", "desc_ar": "لا عمولة وكالة على معاملتك.", "desc_en": "No agency commission on your transaction."},
      {"key": "direct", "icon": "MessageCircle", "highlight": "24h", "title_fr": "Contact direct", "title_ar": "اتصال مباشر", "title_en": "Direct contact", "desc_fr": "Échangez avec le propriétaire en quelques minutes.", "desc_ar": "تواصل مع المالك في دقائق.", "desc_en": "Talk to the owner within minutes."},
      {"key": "trust", "icon": "Shield", "highlight": "100%", "title_fr": "En toute confiance", "title_ar": "بكل ثقة", "title_en": "With full confidence", "desc_fr": "Annonces vérifiées et profils certifiés.", "desc_ar": "إعلانات موثقة وحسابات مصدقة.", "desc_en": "Verified listings and certified profiles."},
      {"key": "free", "icon": "Sparkles", "highlight": "Free", "title_fr": "Gratuit", "title_ar": "مجاني", "title_en": "Free", "desc_fr": "Publiez et consultez sans frais.", "desc_ar": "انشر وتصفح بدون رسوم.", "desc_en": "Post and browse for free."}
    ]
  }'::jsonb)
ON CONFLICT (section_key) DO NOTHING;
