-- LODGE — feature flags pour activer/désactiver les couleurs émotionnelles
-- (joie / cœur / urgence / nouveauté / confiance / douceur) et leur application
-- contextuelle (favoris, badges Nouveau, badges Vérifié, compteurs).

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('use_emotional_colors', true, 'Active les couleurs émotionnelles LODGE (joie, cœur, urgence, nouveauté, confiance, douceur).'),
  ('show_favorite_heart', true, 'Affiche le cœur favoris rose chaud (couleur cœur) sur les annonces.'),
  ('show_new_badge', true, 'Badge "Nouveau" cyan (couleur nouveauté) sur les annonces récentes (<7j).'),
  ('show_verified_badge', true, 'Badge "Vérifié" teal (couleur confiance) sur les profils certifiés.'),
  ('show_popularity_counter', true, 'Compteur visites/jour orange (couleur urgence) sur les annonces populaires.')
ON CONFLICT (key) DO NOTHING;
