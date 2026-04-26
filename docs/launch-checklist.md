# Launch checklist papimo

## Plateforme

- [x] `robots.txt`, `sitemap.xml`, `sitemap-images.xml`
- [x] `humans.txt`, `security.txt`
- [x] manifest PWA + icônes 192/512 + favicon (`ico/png/svg`)
- [x] image OG par défaut (`/og-default.png`)
- [x] headers sécurité (CSP, HSTS, X-Frame-Options, nosniff)
- [x] redirection `www -> apex`
- [ ] certificat SSL vérifié en prod Vercel

## Monitoring

- [ ] Alertes Sentry configurées (5xx, frontend crash rate, webhook failures)
- [ ] Dashboards Posthog (acquisition, activation, rétention)
- [ ] Plausible public via `/stats`
- [ ] UptimeRobot ping home toutes les 5 minutes

## Data & backups

- [ ] Vérifier backup Supabase quotidien + rétention >= 7 jours
- [ ] Cron export images vers stockage froid activé (`/api/cron/cold-export`)

## Business ops

- [ ] Konnect prod + webhooks prod
- [ ] Stripe prod + webhooks prod
- [ ] Domaine `papimo.com` acheté et DNS propagé
- [ ] Admin principal promu en production
