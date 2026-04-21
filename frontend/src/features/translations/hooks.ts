
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api/client";
import { useLanguageStore } from "@/src/store/language-store";

export function useTranslatedExperience(experienceId: string) {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["translated-experience", experienceId, language],
    queryFn: async () => {
      if (language === "en") {
        return null;
      }

      const response = await apiClient.get(
        `/translations/experiences/${experienceId}?lang=${encodeURIComponent(language)}`
      );
      return response.data.data;
    },
    enabled: !!experienceId && language !== "en",
  });
}