"use client";

import { useAuth } from "@/components/providers/AuthProvider";

export function useProfile() {
  return useAuth().profile;
}
