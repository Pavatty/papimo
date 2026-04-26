# papimo

Plateforme immobiliere entre particuliers, multilingue (fr/ar/en), construite avec Next.js App Router.

## Stack

- Next.js (App Router, TypeScript strict, Turbopack)
- Tailwind CSS + shadcn/ui
- next-intl (fr par defaut, ar RTL, en)
- Supabase SDK (`@supabase/supabase-js`, `@supabase/ssr`)
- React Query
- ESLint + Prettier + Husky + lint-staged
- Vitest + Testing Library
- Playwright (smoke E2E)

## Demarrage local

1. Installer les dependances:
   ```bash
   npm install
   ```
2. Copier les variables d'environnement:
   ```bash
   cp .env.local.example .env.local
   ```
3. Lancer l'app:
   ```bash
   npm run dev
   ```
4. Ouvrir [http://localhost:3000/fr](http://localhost:3000/fr)

## Commandes utiles

- Lint: `npm run lint`
- Format: `npm run format`
- Tests unitaires: `npm run test:run`
- Tests E2E: `npm run e2e`
- Build production: `npm run build`
- Start production: `npm run start`

## Structure du projet

- `src/app/[locale]/(public)` pages publiques
- `src/app/[locale]/(authed)` espace utilisateur authentifie
- `src/app/[locale]/(admin)` espace administration
- `src/components/shared` composants de layout (Header, Footer, Logo)
- `src/config` configuration marque, site, feature flags
- `src/i18n` routing, request config et messages
- `src/lib` utilitaires et tests unitaires
- `tests/e2e` tests Playwright

## Palette de marque

- Bleu `#1E5A96`
- Bleu soft `#DCEAF7`
- Bleu pale `#EFF5FB`
- Corail `#E63946`
- Corail soft `#FDE3E5`
- Corail pale `#FEF3F4`
- Creme `#FBF6EC`
- Creme pale `#FEFCF8`
- Paper `#FFFFFF`
- Ink `#1F2937`
- Ink soft `#6B7280`
- Line `#E8DDC9`
- Green `#10B981`
- Danger `#DC2626`
