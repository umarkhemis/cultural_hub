
"use client";

import { useLanguageStore } from "@/src/store/language-store";
import { messagesByLanguage } from "@/src/i18n/messages";
import { DEFAULT_LANGUAGE } from "@/src/i18n/config";

function getNestedValue(obj: Record<string, any>, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function useT() {
  const { language } = useLanguageStore();

  return (key: string) => {
    const selectedMessages = messagesByLanguage[language] || messagesByLanguage[DEFAULT_LANGUAGE];
    const fallbackMessages = messagesByLanguage[DEFAULT_LANGUAGE];

    return (
      getNestedValue(selectedMessages, key) ??
      getNestedValue(fallbackMessages, key) ??
      key
    );
  };
}