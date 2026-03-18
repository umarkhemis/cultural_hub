
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrentUser, AuthTokens } from "@/src/types/auth";
import { setAuthToken } from "@/src/lib/api/client";

type AuthState = {
  user: CurrentUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setSession: (user: CurrentUser, tokens: AuthTokens) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      hasHydrated: false,

      setSession: (user, tokens) => {
        setAuthToken(tokens.access_token);
        set({
          user,
          tokens,
          isAuthenticated: true,
        });
      },

      clearSession: () => {
        setAuthToken(null);
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "tourism-auth",
      onRehydrateStorage: () => (state) => {
        const token = state?.tokens?.access_token;
        if (token) setAuthToken(token);
        state?.setHasHydrated(true);
      },
    }
  )
);





