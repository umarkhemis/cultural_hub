
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followSite, getSiteDetail, getSites, unfollowSite } from "@/src/lib/api/sites";

export function useSites() {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const response = await getSites();
      return response.data.items;
    },
  });
}

export function useSiteDetail(siteId: string) {
  return useQuery({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const response = await getSiteDetail(siteId);
      return response.data;
    },
    enabled: Boolean(siteId),
  });
}

export function useFollowSiteMutation(siteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => followSite(siteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sites"] });
      await queryClient.invalidateQueries({ queryKey: ["site", siteId] });
    },
  });
}

export function useUnfollowSiteMutation(siteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unfollowSite(siteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sites"] });
      await queryClient.invalidateQueries({ queryKey: ["site", siteId] });
    },
  });
}







































// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { getSiteDetail, getSites } from "@/src/lib/api/sites";

// export function useSites() {
//   return useQuery({
//     queryKey: ["sites"],
//     queryFn: async () => {
//       const response = await getSites();
//       return response.data.items;
//     },
//   });
// }

// export function useSiteDetail(siteId: string) {
//   return useQuery({
//     queryKey: ["site", siteId],
//     queryFn: async () => {
//       const response = await getSiteDetail(siteId);
//       return response.data;
//     },
//     enabled: Boolean(siteId),
//   });
// }