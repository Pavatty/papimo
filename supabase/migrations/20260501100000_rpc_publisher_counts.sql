-- LODGE — RPC counts agrégés pour le filtre toggle PAP/PRO sur la home.
-- Calcule sur la TOTALITÉ des listings immobilier active, pas seulement les
-- 6/12 chargés côté client.

CREATE OR REPLACE FUNCTION public.get_immobilier_publisher_counts()
RETURNS TABLE(all_count BIGINT, pap_count BIGINT, pro_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*) AS all_count,
    COUNT(*) FILTER (WHERE p.publisher_type = 'pap') AS pap_count,
    COUNT(*) FILTER (WHERE p.publisher_type = 'pro') AS pro_count
  FROM public.listings l
  LEFT JOIN public.profiles p ON l.owner_id = p.id
  WHERE l.module_name = 'immobilier' AND l.status = 'active';
$$;

GRANT EXECUTE ON FUNCTION public.get_immobilier_publisher_counts() TO anon, authenticated;
