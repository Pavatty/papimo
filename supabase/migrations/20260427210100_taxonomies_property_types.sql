CREATE TABLE IF NOT EXISTS public.property_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  icon_name TEXT,
  category TEXT NOT NULL DEFAULT 'residential',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_types_active_order ON public.property_types (is_active, sort_order) WHERE is_active = true;

ALTER TABLE public.property_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "property_types_public_read" ON public.property_types;
CREATE POLICY "property_types_public_read" ON public.property_types FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "property_types_admin_all" ON public.property_types;
CREATE POLICY "property_types_admin_all" ON public.property_types FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.property_types TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_types TO authenticated;

INSERT INTO public.property_types (code, label_fr, label_ar, label_en, icon_name, category, sort_order) VALUES
  ('apartment', 'Appartement', 'شقة', 'Apartment', 'building', 'residential', 1),
  ('house', 'Maison', 'منزل', 'House', 'home', 'residential', 2),
  ('villa', 'Villa', 'فيلا', 'Villa', 'home', 'residential', 3),
  ('studio', 'Studio', 'استوديو', 'Studio', 'home', 'residential', 4),
  ('duplex', 'Duplex', 'دوبلكس', 'Duplex', 'home', 'residential', 5),
  ('land', 'Terrain', 'أرض', 'Land', 'map', 'land', 10),
  ('commercial', 'Local commercial', 'محل تجاري', 'Commercial space', 'store', 'commercial', 20),
  ('shop', 'Boutique', 'متجر', 'Shop', 'store', 'commercial', 21),
  ('office', 'Bureau', 'مكتب', 'Office', 'briefcase', 'commercial', 22),
  ('warehouse', 'Entrepôt', 'مستودع', 'Warehouse', 'warehouse', 'commercial', 23),
  ('garage', 'Garage / Parking', 'كراج', 'Garage / Parking', 'car', 'special', 30),
  ('building', 'Immeuble', 'مبنى', 'Building', 'building', 'special', 31),
  ('farm', 'Ferme', 'مزرعة', 'Farm', 'tree', 'special', 32),
  ('other', 'Autre', 'أخرى', 'Other', 'help-circle', 'special', 99)
ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en,
  icon_name = EXCLUDED.icon_name, category = EXCLUDED.category, sort_order = EXCLUDED.sort_order,
  updated_at = now();
