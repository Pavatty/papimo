CREATE TABLE IF NOT EXISTS public.transaction_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  label_fr TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  badge_color TEXT NOT NULL DEFAULT 'corail',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transaction_types_active_order
  ON public.transaction_types (is_active, sort_order) WHERE is_active = true;

ALTER TABLE public.transaction_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transaction_types_public_read" ON public.transaction_types;
CREATE POLICY "transaction_types_public_read" ON public.transaction_types
  FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "transaction_types_admin_all" ON public.transaction_types;
CREATE POLICY "transaction_types_admin_all" ON public.transaction_types
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

GRANT SELECT ON public.transaction_types TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.transaction_types TO authenticated;

INSERT INTO public.transaction_types (code, label_fr, label_ar, label_en, badge_color, sort_order) VALUES
  ('sale', 'À vendre', 'للبيع', 'For sale', 'corail', 1),
  ('rent', 'À louer', 'للإيجار', 'For rent', 'corail', 2),
  ('seasonal_rent', 'Location saisonnière', 'إيجار موسمي', 'Seasonal rent', 'corail', 3),
  ('colocation', 'Colocation', 'سكن مشترك', 'Co-living', 'corail', 4)
ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr,
  label_ar = EXCLUDED.label_ar,
  label_en = EXCLUDED.label_en,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
