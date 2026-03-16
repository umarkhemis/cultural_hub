
"use client";

import { useAuthStore } from "@/src/store/auth-store";

export function useAuth() {
  const { user, tokens, isAuthenticated, hasHydrated, setSession, clearSession } =
    useAuthStore();

  return {
    user,
    tokens,
    isAuthenticated,
    hasHydrated,
    setSession,
    clearSession,
  };
}