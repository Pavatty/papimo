import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

function sanitizeRedirectPath(value: string | null, fallback: string) {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const tokenType = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const redirectTo =
    requestUrl.searchParams.get("redirect_to") ??
    requestUrl.searchParams.get("next");
  const next = sanitizeRedirectPath(redirectTo, `/${locale}/dashboard`);
  const errorParam = requestUrl.searchParams.get("error");

  console.info("[auth/callback] params", {
    locale,
    url: request.url,
    code: Boolean(code),
    tokenHash: Boolean(tokenHash),
    tokenType,
    redirectTo,
    errorParam,
  });

  if (errorParam) {
    const errorRedirect = new URL(
      `/${locale}/login?error=${encodeURIComponent(errorParam)}`,
      request.url,
    );
    console.info("[auth/callback] provider_error_redirect", {
      finalRedirect: errorRedirect.toString(),
    });
    return NextResponse.redirect(errorRedirect);
  }

  const response = NextResponse.redirect(new URL(next, request.url));
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    console.info("[auth/callback] exchangeCodeForSession", {
      hasSession: Boolean(data.session),
      error: error?.message ?? null,
    });
    if (!error) {
      console.info("[auth/callback] success_redirect", {
        finalRedirect: new URL(next, request.url).toString(),
      });
      return response;
    }
  }

  if (tokenHash && tokenType) {
    const { error, data } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: tokenType,
    });
    console.info("[auth/callback] verifyOtp", {
      tokenType,
      hasSession: Boolean(data.session),
      error: error?.message ?? null,
    });
    if (!error) {
      console.info("[auth/callback] success_redirect", {
        finalRedirect: new URL(next, request.url).toString(),
      });
      return response;
    }
  }

  const failedRedirect = new URL(
    `/${locale}/login?error=auth_callback_failed`,
    request.url,
  );
  console.info("[auth/callback] failed_redirect", {
    finalRedirect: failedRedirect.toString(),
  });
  return NextResponse.redirect(failedRedirect);
}
