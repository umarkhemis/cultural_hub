
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProviderSite, updateMyProviderSite } from "@/src/lib/api/provider-site";

export function useMyProviderSite() {
  return useQuery({
    queryKey: ["provider-site"],
    queryFn: async () => {
      const response = await getMyProviderSite();
      return response.data;
    },
  });
}

export function useUpdateMyProviderSiteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProviderSite,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["provider-site"] });
    },
  });
}