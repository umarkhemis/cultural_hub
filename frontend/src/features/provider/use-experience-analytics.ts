
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/api/client";

export function useProviderExperienceAnalytics(experienceId: string) {
  return useQuery({
    queryKey: ["provider-experience-analytics", experienceId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/providers/me/experiences/${experienceId}/analytics`
      );
      return response.data.data;
    },
    enabled: !!experienceId,
    staleTime: 1000 * 60 * 5,    // cache for 5 minutes
    refetchOnWindowFocus: false,  // don't refetch on tab switch
  });
}