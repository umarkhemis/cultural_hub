

"use client";

import { useQuery } from "@tanstack/react-query";
import { getExperienceDetail, getPublicFeed } from "@/src/lib/api/experiences";

export function usePublicFeed(cursor?: string | null, limit = 12) {
  return useQuery({
    queryKey: ["public-feed", cursor, limit],
    queryFn: async () => {
      const response = await getPublicFeed(cursor, limit);

      return (
        response?.data ?? {
          items: [],
          next_cursor: null,
        }
      );
    },
  });
}

export function useExperienceDetail(experienceId: string) {
  return useQuery({
    queryKey: ["experience", experienceId],
    queryFn: async () => {
      const response = await getExperienceDetail(experienceId);

      if (!response?.data) {
        throw new Error("Experience detail response is missing data.");
      }

      return response.data;
    },
    enabled: Boolean(experienceId),
  });
}




