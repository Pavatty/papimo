// Mode bêta : désactive toute la monétisation côté UI et routes (pricing, checkout, billing, pack du wizard).
// Lu côté serveur ET côté client via process.env (NEXT_PUBLIC_ → exposé au bundle client).
export const IS_BETA =
  process.env.NEXT_PUBLIC_BETA_DISABLE_MONETIZATION === "true";
