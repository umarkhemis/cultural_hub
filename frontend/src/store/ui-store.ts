
"use client";

import { create } from "zustand";

type UIState = {
  mobileMenuOpen: boolean;
  authPromptOpen: boolean;
  authPromptMessage: string;
  setMobileMenuOpen: (open: boolean) => void;
  openAuthPrompt: (message?: string) => void;
  closeAuthPrompt: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  authPromptOpen: false,
  authPromptMessage: "Login to interact with experiences.",
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openAuthPrompt: (message = "Login to interact with experiences.") =>
    set({ authPromptOpen: true, authPromptMessage: message }),
  closeAuthPrompt: () => set({ authPromptOpen: false }),
}));