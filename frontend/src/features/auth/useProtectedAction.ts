
"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useUIStore } from "@/src/store/ui-store";

export function useProtectedAction() {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useUIStore();

  function runProtectedAction(
    action?: () => void,
    message = "Login to interact with experiences."
  ) {
    if (!isAuthenticated) {
      openAuthPrompt(message);
      return;
    }

    action?.();
  }

  return { isAuthenticated, runProtectedAction };
}