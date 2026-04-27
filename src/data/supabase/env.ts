type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (!url.startsWith("https://")) {
    throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL format");
  }

  if (publishableKey.startsWith("sb_secret_")) {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: expected publishable key, got secret key",
    );
  }

  return { url, publishableKey };
}
