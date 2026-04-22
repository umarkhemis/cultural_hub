
"use client";

import { useLanguageStore } from "@/src/store/language-store";
import { messagesByLanguage } from "@/src/i18n/messages";
import { DEFAULT_LANGUAGE } from "@/src/i18n/config";

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

export function useT() {
  const { language } = useLanguageStore();

  return (key: string): string => {
    const selectedMessages = messagesByLanguage[language] || messagesByLanguage[DEFAULT_LANGUAGE];
    const fallbackMessages = messagesByLanguage[DEFAULT_LANGUAGE];

    const value =
      getNestedValue(selectedMessages as Record<string, unknown>, key) ??
      getNestedValue(fallbackMessages as Record<string, unknown>, key) ??
      key;

    return String(value);
  };
}