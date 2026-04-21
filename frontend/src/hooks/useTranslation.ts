
// src/hooks/useTranslation.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api/client";
import { useLanguageStore } from "@/src/store/language-store";

function useContentTranslation(
  type: "experiences" | "packages" | "sites",
  id: string | undefined
) {
  const { language } = useLanguageStore();

  return useQuery({
    queryKey: ["translation", type, id, language],
    queryFn: async () => {
      const response = await apiClient.get(
        `/translations/${type}/${id}?lang=${encodeURIComponent(language)}`
      );
      return response.data.data;
    },
    enabled: !!id && language !== "en",
    staleTime: 1000 * 60 * 60, // cache for 1 hour
  });
}

export function useTranslatedExperience(id: string | undefined) {
  return useContentTranslation("experiences", id);
}

export function useTranslatedPackage(id: string | undefined) {
  return useContentTranslation("packages", id);
}

export function useTranslatedSite(id: string | undefined) {
  return useContentTranslation("sites", id);
}