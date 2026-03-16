
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/src/types/auth";
import { ROUTES } from "@/src/constants/routes";

export function useRequireRole(allowedRoles: UserRole[]) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace(ROUTES.login);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(ROUTES.feed);
    }
  }, [allowedRoles, hasHydrated, isAuthenticated, router, user]);

  return { user, isAuthenticated, hasHydrated };
}