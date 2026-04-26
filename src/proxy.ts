import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

const intlMiddleware = createIntlMiddleware(routing);
const protectedPrefixes = ["/dashboard", "/publish", "/messages", "/checkout"];
const adminPrefix = "/admin";

function getLocaleFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return routing.locales.includes(segment as (typeof routing.locales)[number])
    ? segment
    : routing.defaultLocale;
}

function removeLocalePrefix(pathname: string, locale: string) {
  return pathname.replace(new RegExp(`^/${locale}`), "") || "/";
}

export async function proxy(request: NextRequest) {
  const callbackPathPattern = /^\/(fr|ar|en)\/auth\/callback$/;
  if (callbackPathPattern.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { url, publishableKey } = getSupabaseEnv();
  const response = intlMiddleware(request);
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  const pathWithoutLocale = removeLocalePrefix(
    request.nextUrl.pathname,
    locale,
  );

  const supabase = createServerClient<Database>(url, publishableKey, {
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
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const needsAuth = protectedPrefixes.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(`${prefix}/`),
  );
  const needsAdmin =
    pathWithoutLocale === adminPrefix ||
    pathWithoutLocale.startsWith("/admin/");

  if (needsAuth && !user) {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("redirect_to", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (needsAdmin) {
    if (!user) {
      const url = new URL(`/${locale}/login`, request.url);
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const url = new URL(`/${locale}/login`, request.url);
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Next.js 16 : le matcher doit être défini ici (fichier `proxy.ts` unique).
// Ne pas utiliser un second `src/middleware.ts` qui réexporte `config` depuis ce fichier.
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
