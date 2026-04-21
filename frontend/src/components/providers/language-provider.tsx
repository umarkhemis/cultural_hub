
// src/components/providers/language-provider.tsx
"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/src/store/language-store";
import { isRtlLanguage } from "@/src/i18n/config";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language, hydrateLanguage } = useLanguageStore();

  // Hydrate from localStorage on first mount
  useEffect(() => {
    hydrateLanguage();
  }, [hydrateLanguage]);

  // Apply RTL and lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.dir = isRtlLanguage(language) ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}