
"use client";

import { useQuery } from "@tanstack/react-query";
// import { getExperienceDetail, getPublicFeed } from "@/src/lib/api/experiences";
import { getExperienceDetail, getPublicFeed } from "@/src/lib/api/experiences";
// import { getPublicFeed } from "@/src/types/experiences";

export function usePublicFeed(cursor?: string | null, limit = 12) {
  return useQuery({
    queryKey: ["public-feed", cursor, limit],
    queryFn: async () => {
      const response = await getPublicFeed(cursor, limit);
      return response.data;
    },
  });
}

export function useExperienceDetail(experienceId: string) {
  return useQuery({
    queryKey: ["experience", experienceId],
    queryFn: async () => {
      const response = await getExperienceDetail(experienceId);
      return response.data;
    },
    enabled: Boolean(experienceId),
  });
}