
"use client";

import { create } from "zustand";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/src/i18n/config";

type LanguageState = {
  language: LanguageCode;
  hydrated: boolean;
  setLanguage: (language: LanguageCode) => void;
  hydrateLanguage: () => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: DEFAULT_LANGUAGE,
  hydrated: false,

  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_language", language);
    }
    set({ language });
  },

  hydrateLanguage: () => {
    if (typeof window === "undefined") {
      set({ hydrated: true });
      return;
    }

    const stored = localStorage.getItem("preferred_language") as LanguageCode | null;
    set({
      language: stored || DEFAULT_LANGUAGE,
      hydrated: true,
    });
  },
}));