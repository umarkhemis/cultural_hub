
"use client";

import { useAuthStore } from "@/src/store/auth-store";
import { useEffect } from "react";


export function useAuth() {


  const { user, tokens, isAuthenticated, hasHydrated, setSession, clearSession } =
    useAuthStore();

    useEffect(() => {
      const handleLogout = () => {
        clearSession(); 
      };

      window.addEventListener("auth:logout", handleLogout);
      return () => window.removeEventListener("auth:logout", handleLogout);
    }, []);

  return {
    user,
    tokens,
    isAuthenticated,
    hasHydrated,
    setSession,
    clearSession,
  };
}