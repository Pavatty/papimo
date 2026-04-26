# Déploiement production sur Vercel

## 1) Créer le projet

1. Ouvrir Vercel Dashboard.
2. `Add New Project` -> importer `Pavatty/papimo`.
3. Branch production: `main`.
4. Build command: `npm run build`.
5. Output: `.next`.

## 2) Variables d'environnement

Renseigner toutes les variables de `.env.local.example` (hors valeurs locales de dev), incluant:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Paiements: `KONNECT_*`, `STRIPE_*`
- Analytics/monitoring: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_POSTHOG_KEY`, `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`
- App: `NEXT_PUBLIC_APP_URL=https://papimo.com`
- Sécurité cron: `CRON_SECRET`

## 3) Domaines custom

Après achat du domaine:

1. Ajouter `papimo.com` et `www.papimo.com` dans Vercel Domains.
2. Configurer DNS:
   - Apex: enregistrement A vers Vercel (ou ALIAS/ANAME selon registrar)
   - `www`: CNAME vers `cname.vercel-dns.com`
3. Vérifier SSL auto émis par Vercel.

## 4) Supabase Edge Functions

Déployer les Edge Functions côté Supabase si utilisées (webhooks, modération async, etc.), puis configurer leurs variables en environnement production.

## 5) Analytics Vercel

Activer Vercel Analytics depuis le dashboard du projet.
