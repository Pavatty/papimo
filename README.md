# papimo

Marketplace immobilier entre particuliers, multilingue (`fr`, `ar`, `en`), avec publication d'annonces, messagerie, paiements et administration.

## Local setup

```bash
npm install
cp .env.local.example .env.local
# remplir les variables (Supabase minimum)
npm run dev
```

App locale par défaut: `http://localhost:3000/fr`.

## Scripts principaux

- `npm run dev`: développement Turbopack.
- `npm run build`: build production.
- `npm run start`: run build.
- `npm run lint`: ESLint.
- `npm run typecheck`: TypeScript strict.
- `npm run test:run`: tests unitaires.
- `npm run test:coverage`: unitaires + coverage (seuil min 60%).
- `npm run e2e`: Playwright end-to-end.
- `npm run seed`: seed de données démo.

## Architecture

- Front: Next.js App Router + React 19 + TypeScript strict.
- UI: Tailwind v4 + shadcn + design tokens papimo.
- i18n: `next-intl` + RTL natif arabe.
- Backend: Supabase Auth/Postgres/Storage/Realtime.
- Monitoring: Sentry, Posthog, Plausible (conditionnés au consentement cookies).
- PWA: `manifest`, service worker `next-pwa`.

Voir `docs/architecture.md` pour les diagrammes de flux.

## Qualité & CI/CD

- Coverage métier ciblé `lib/` + `hooks/` avec seuil global >= 60%.
- Hook Git pre-push: exécute `npm run test:coverage`.
- GitHub Actions:
  - `ci.yml`: lint + typecheck + tests + e2e.
  - `preview-deploy.yml`: déploiement Preview Vercel sur PR.

## Déploiement Vercel (production)

1. Créer un projet Vercel lié au repo `Pavatty/papimo` branche `main`.
2. Ajouter les variables d'environnement (alignées avec `.env.local.example`).
3. Ajouter secrets GitHub pour CI:
   - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - clés paiement / analytics / monitoring.
4. Configurer domaine:
   - apex `papimo.com` + `www` (redirection `www -> apex` gérée côté app).
5. Activer Vercel Analytics.

Guide détaillé: `docs/deployment-vercel.md`.

## Production operations

- Runbook incident: `docs/operations.md`.
- Architecture: `docs/architecture.md`.
- Security discovery:
  - `/humans.txt`
  - `/.well-known/security.txt`
- SEO assets:
  - `/sitemap.xml`
  - `/sitemap-images.xml`
  - `/robots.txt`

## Démo seed

`npm run seed` insère:

- 30 annonces réalistes (vente/location, plusieurs villes/catégories),
- 5 vendeurs démo,
- 1 admin démo.

Optionnel: définir `UNSPLASH_ACCESS_KEY` pour images via API Unsplash.

## Contribuer

1. Créer une branche feature.
2. Respecter lint + typecheck + tests.
3. Ouvrir une PR avec plan de test clair.
4. Utiliser un message de commit conventionnel `feat|fix|chore(scope): ...`.

## Roadmap court terme

- Renforcer notifications utilisateur (modération, paiements, messages).
- Compléter les scénarios e2e de charge et résilience.
- Ajouter export photos vers stockage froid automatisé.

## Workflow Git

- `main`: production.
- `develop`: branche d'intégration/staging.
- `feat/xxx`: nouvelles fonctionnalités.
- `fix/xxx`: correctifs.

### Créer une nouvelle feature

```bash
git checkout develop
git pull
git checkout -b feat/nom-feature
# développer
git push -u origin feat/nom-feature
```

Ensuite:

1. Ouvrir une PR `feat/nom-feature -> develop`.
2. Merger vers `develop` après validation.
3. Quand `develop` est stable, ouvrir une PR `develop -> main`.
