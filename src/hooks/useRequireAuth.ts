"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/components/providers/AuthProvider";

export function useRequireAuth(locale: string) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/${locale}/login`);
    }
  }, [isLoading, user, locale, router]);

  return { user, isLoading };
}
