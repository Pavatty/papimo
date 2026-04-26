# Operations Runbook papimo

## Incident response (P1/P2)

1. Confirmer l'incident (Sentry, logs Vercel, alert uptime).
2. Identifier impact (routes, paiement, auth, admin).
3. Mitigation immédiate:
   - rollback Vercel si release en cause;
   - désactiver feature flag concerné.
4. Communication interne + suivi ticket incident.
5. Post-mortem sous 48h.

## Gestion des bans / modération

- Toute action admin sensible doit créer un événement `audit_log`.
- Pour un compte abusif:
  1. Suspendre via `/admin/users`.
  2. Noter justification dans audit.
  3. Réexaminer contenu associé (annonces/messages/reports).

## Escalades

- Paiement: escalade fintech (Konnect/Stripe) si webhook KO > 15 min.
- Auth: escalade infra si magic links non délivrés > 10 min.
- DB: escalade Supabase si erreurs SQL globales > 2 min.

## Recovery checklist

- Vérifier `npm run lint`, `npm run test:coverage`, `npm run e2e`.
- Vérifier status des webhooks en prod.
- Vérifier dashboards Sentry/Posthog/Plausible.
- Documenter résolution et action préventive.

## Post-launch 30 jours (SLO cibles)

- Taux d'erreur global < 0.5%
- p95 API + pages critiques < 1s
- Conversion signup > 15%
- Conversion publish > 30%
- Temps moyen de modération < 24h
