WITH gov AS (
  SELECT gr.id AS region_id, gr.code AS region_code
  FROM public.geo_regions gr
  JOIN public.geo_countries gc ON gr.country_id = gc.id
  WHERE gc.code = 'TN'
)
INSERT INTO public.geo_cities (region_id, code, label_fr, label_ar, sort_order)
SELECT g.region_id, v.code, v.label_fr, v.label_ar, v.sort_order
FROM gov g
JOIN (VALUES
  ('tunis','tunis_centre','Tunis Centre','تونس الوسطى',1),
  ('tunis','bab_bhar','Bab Bhar','باب بحر',2),
  ('tunis','lafayette','Lafayette','لافاييت',3),
  ('tunis','el_menzah','El Menzah','المنزه',4),
  ('tunis','cite_olympique','Cité Olympique','المدينة الأولمبية',5),
  ('ariana','ariana_ville','Ariana Ville','أريانة المدينة',1),
  ('ariana','ennasr','Ennasr','النصر',2),
  ('ariana','ghazela','Ghazela','الغزالة',3),
  ('ariana','raoued','Raoued','راوض',4),
  ('ben_arous','ben_arous_ville','Ben Arous Ville','بن عروس المدينة',1),
  ('ben_arous','rades','Radès','رادس',2),
  ('ben_arous','hammam_lif','Hammam Lif','حمام الأنف',3),
  ('ben_arous','bou_mhel','Bou Mhel','بومهل',4),
  ('manouba','manouba_ville','Manouba Ville','منوبة المدينة',1),
  ('manouba','oued_ellil','Oued Ellil','وادي الليل',2),
  ('manouba','la_manouba','La Manouba','المنوبة',3),
  ('nabeul','nabeul_ville','Nabeul Ville','نابل المدينة',1),
  ('nabeul','hammamet','Hammamet','الحمامات',2),
  ('nabeul','kelibia','Kélibia','قليبية',3),
  ('nabeul','grombalia','Grombalia','قرمبالية',4),
  ('bizerte','bizerte_ville','Bizerte Ville','بنزرت المدينة',1),
  ('bizerte','menzel_bourguiba','Menzel Bourguiba','منزل بورقيبة',2),
  ('sousse','sousse_ville','Sousse Ville','سوسة المدينة',1),
  ('sousse','hammam_sousse','Hammam Sousse','حمام سوسة',2),
  ('sousse','akouda','Akouda','أكودة',3),
  ('sousse','kalaa_kebira','Kalâa Kebira','القلعة الكبرى',4),
  ('monastir','monastir_ville','Monastir Ville','المنستير المدينة',1),
  ('monastir','skanes','Skanès','سكانس',2),
  ('monastir','ksar_hellal','Ksar Hellal','قصر هلال',3),
  ('mahdia','mahdia_ville','Mahdia Ville','المهدية المدينة',1),
  ('mahdia','el_jem','El Jem','الجم',2),
  ('sfax','sfax_ville','Sfax Ville','صفاقس المدينة',1),
  ('sfax','sfax_sud','Sfax Sud','صفاقس الجنوبية',2),
  ('sfax','sakiet_eddaier','Sakiet Eddaier','ساقية الدائر',3),
  ('sfax','el_ain','El Aïn','العين',4),
  ('kairouan','kairouan_ville','Kairouan Ville','القيروان المدينة',1),
  ('kairouan','chebika','Chébika','الشبيكة',2),
  ('kasserine','kasserine_ville','Kasserine Ville','القصرين المدينة',1),
  ('kasserine','feriana','Feriana','فريانة',2),
  ('gabes','gabes_ville','Gabès Ville','قابس المدينة',1),
  ('gabes','gabes_medina','Gabès Médina','قابس المدينة القديمة',2),
  ('medenine','medenine_ville','Medenine Ville','مدنين المدينة',1),
  ('medenine','djerba_houmt_souk','Djerba - Houmt Souk','جربة حومة السوق',2),
  ('medenine','djerba_midoun','Djerba - Midoun','جربة ميدون',3),
  ('medenine','zarzis','Zarzis','جرجيس',4),
  ('gafsa','gafsa_ville','Gafsa Ville','قفصة المدينة',1),
  ('tozeur','tozeur_ville','Tozeur Ville','توزر المدينة',1),
  ('kebili','kebili_ville','Kebili Ville','قبلي المدينة',1),
  ('tataouine','tataouine_ville','Tataouine Ville','تطاوين المدينة',1),
  ('zaghouan','zaghouan_ville','Zaghouan Ville','زغوان المدينة',1),
  ('beja','beja_ville','Béja Ville','باجة المدينة',1),
  ('jendouba','jendouba_ville','Jendouba Ville','جندوبة المدينة',1),
  ('le_kef','le_kef_ville','Le Kef Ville','الكاف المدينة',1),
  ('siliana','siliana_ville','Siliana Ville','سليانة المدينة',1),
  ('sidi_bouzid','sidi_bouzid_ville','Sidi Bouzid Ville','سيدي بوزيد المدينة',1)
) AS v(region_code, code, label_fr, label_ar, sort_order)
ON g.region_code = v.region_code
ON CONFLICT (region_id, code) DO NOTHING;
