CREATE TABLE IF NOT EXISTS public.amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_name TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_amenities_active_cat_order ON public.amenities (is_active, category, sort_order) WHERE is_active = true;

ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "amenities_public_read" ON public.amenities;
CREATE POLICY "amenities_public_read" ON public.amenities FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "amenities_admin_all" ON public.amenities;
CREATE POLICY "amenities_admin_all" ON public.amenities FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.amenities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.amenities TO authenticated;

INSERT INTO public.amenities (code, label_fr, label_ar, label_en, category, icon_name, sort_order) VALUES
  ('furnished', 'Meublé', 'مفروش', 'Furnished', 'comfort', 'sofa', 1),
  ('air_conditioning', 'Climatisation', 'تكييف', 'Air conditioning', 'comfort', 'snowflake', 2),
  ('heating', 'Chauffage', 'تدفئة', 'Heating', 'comfort', 'flame', 3),
  ('fiber', 'Fibre optique', 'ألياف ضوئية', 'Fiber internet', 'comfort', 'wifi', 4),
  ('dishwasher', 'Lave-vaisselle', 'غسالة أطباق', 'Dishwasher', 'comfort', 'utensils', 5),
  ('washing_machine', 'Lave-linge', 'غسالة ملابس', 'Washing machine', 'comfort', 'shirt', 6),
  ('fireplace', 'Cheminée', 'مدفأة', 'Fireplace', 'comfort', 'flame', 7),
  ('parking', 'Parking', 'موقف سيارات', 'Parking', 'outdoor', 'car', 10),
  ('garden', 'Jardin', 'حديقة', 'Garden', 'outdoor', 'tree', 11),
  ('balcony', 'Balcon', 'شرفة', 'Balcony', 'outdoor', 'door-open', 12),
  ('terrace', 'Terrasse', 'تراس', 'Terrace', 'outdoor', 'sun', 13),
  ('pool', 'Piscine', 'مسبح', 'Swimming pool', 'outdoor', 'waves', 14),
  ('elevator', 'Ascenseur', 'مصعد', 'Elevator', 'building', 'arrow-up-down', 20),
  ('intercom', 'Interphone', 'انتركم', 'Intercom', 'building', 'phone', 21),
  ('double_glazing', 'Double vitrage', 'زجاج مزدوج', 'Double glazing', 'building', 'square', 22),
  ('cellar', 'Cave', 'قبو', 'Cellar', 'building', 'archive', 23),
  ('new_build', 'Neuf', 'جديد', 'New build', 'building', 'sparkles', 24),
  ('sea_view', 'Vue mer', 'إطلالة على البحر', 'Sea view', 'view', 'eye', 30),
  ('mountain_view', 'Vue montagne', 'إطلالة على الجبل', 'Mountain view', 'view', 'mountain', 31),
  ('city_view', 'Vue ville', 'إطلالة على المدينة', 'City view', 'view', 'building-2', 32),
  ('security', 'Sécurité', 'أمن', 'Security', 'security', 'shield', 40),
  ('alarm', 'Alarme', 'إنذار', 'Alarm', 'security', 'bell', 41),
  ('guard', 'Gardien', 'حارس', 'Concierge', 'security', 'user-check', 42)
ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_ar = EXCLUDED.label_ar, label_en = EXCLUDED.label_en,
  category = EXCLUDED.category, icon_name = EXCLUDED.icon_name, sort_order = EXCLUDED.sort_order,
  updated_at = now();
