"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/data/supabase/client";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type AuthContextValue = {
  user: User | null;
  profile: ProfileRow | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
  initialUser: User | null;
  initialProfile: ProfileRow | null;
};

export function AuthProvider({
  children,
  initialUser,
  initialProfile,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<ProfileRow | null>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const {
      data: { user: refreshedUser },
    } = await supabase.auth.getUser();
    setUser(refreshedUser);

    if (!refreshedUser) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", refreshedUser.id)
      .single();

    setProfile(data);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, isLoading, refreshProfile, signOut }),
    [user, profile, isLoading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
