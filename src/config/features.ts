export const FEATURES = {
  authEnabled: false,
  dashboardEnabled: true,
  adminEnabled: true,
  i18nEnabled: true,
} as const;

export type FeatureFlags = typeof FEATURES;
