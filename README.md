# papimo

**papimo** est une place de marché immobilière 100 % entre particuliers (sans agence, sans intermédiaire).  
Slogan : _L'immobilier entre particuliers._ — [papimo.com](https://papimo.com)

## Stack

- **Next.js** (App Router) + **TypeScript** (mode strict) + **React 19**
- **Tailwind CSS v4** + **shadcn/ui** (Base UI) + thème papimo (`src/app/globals.css`)
- **next-intl** : locales `fr` (défaut), `ar` (RTL), `en` — URLs préfixées (`/fr`, `/ar`, `/en`)
- **Supabase** (à brancher) : base PostgreSQL, auth, storage, Realtime, Edge Functions
- Qualité : **ESLint** + **Prettier** (Tailwind) + **Husky** + **lint-staged** + **Vitest** + **Playwright** (Chromium)

> Le dépôt est initialisé avec **Next.js 16** et **Turbopack** en `npm run dev` (aligné sur `create-next-app@latest` au moment du bootstrap).

## Démarrage local

```bash
npm install
cp .env.local.example .env.local
# Renseigner au minimum les variables Supabase et NEXT_PUBLIC_APP_URL
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) : redirection vers `/fr/`.

## Scripts

| Commande           | Rôle                                   |
| ------------------ | -------------------------------------- |
| `npm run dev`      | Dev avec Turbopack                     |
| `npm run build`    | Build production                       |
| `npm run start`    | Sert le build                          |
| `npm run lint`     | ESLint                                 |
| `npm run format`   | Prettier (écriture)                    |
| `npm run test`     | Vitest (watch)                         |
| `npm run test:run` | Vitest une fois                        |
| `npm run e2e`      | Playwright (démarre le serveur de dev) |

## Structure des dossiers (principale)

```text
src/
  app/
    [locale]/
      (public)/          # pages accessibles sans compte
      (authed)/          # espace membre (ex. /dashboard)
      (admin)/           # administration (ex. /admin)
    layout.tsx           # layout racine (next-intl)
    globals.css         # thème + tokens @theme Tailwind v4
  components/
    ui/                  # primitives shadcn
    shared/              # en-tête, pied, logo, etc.
  config/                # marque, site, feature flags
  i18n/
    messages/            # fr.json, ar.json, en.json
    routing.ts
    request.ts
    navigation.ts
  lib/                   # utilitaires partagés
  middleware.ts          # détection de locale
tests/e2e/                # scénarios Playwright
```

## Route admin

L’espace d’administration de démonstration est exposé sous **`/[locale]/admin`** (et non sur la racine), car deux groupes de routes parallèles ne peuvent pas chacun définir un `page.tsx` pour le même segment.

## Palette de marque (extraits)

| Rôle         | Token / classe | Hex       |
| ------------ | -------------- | --------- |
| Bleu (PAP)   | `bleu`         | `#1E5A96` |
| Corail (IMO) | `corail`       | `#E63946` |
| Fond crème   | `creme`        | `#FBF6EC` |
| Encre        | `ink`          | `#1F2937` |
| Secondaire   | `ink-soft`     | `#6B7280` |
| Ligne        | `line`         | `#E8DDC9` |
| Succès       | `green`        | `#10B981` |
| Erreur       | `danger`       | `#DC2626` |

Polices (via `next/font`) : **Geist** (titres / chiffres), **Manrope** (texte), **JetBrains Mono** (technique / code).

## Tests

- **Unitaires** : `src/lib/tests/example.test.ts` (câblage Vitest)
- **E2E** : `tests/e2e/home.spec.ts` (titre de page contenant `papimo` sur `/fr/`)

## Licence

Projet privé — droits réservés.
