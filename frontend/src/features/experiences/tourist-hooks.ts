
"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Experience } from "@/src/types/experience";
import {
  createExperienceComment,
  getExperienceComments,
  getPublicFeed,
  likeExperience,
  unlikeExperience,
} from "@/src/lib/api/experiences";

import type { ApiSuccessResponse } from "@/src/types/api";

type PublicFeedPage = ApiSuccessResponse<{ items: Experience[]; next_cursor: string | null }>;

export function useInfinitePublicFeed() {
  return useInfiniteQuery<PublicFeedPage, Error, { pages: PublicFeedPage[] }, string[], string | null>({
    queryKey: ["public-feed"],
    queryFn: ({ pageParam }) => getPublicFeed(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.data.next_cursor ?? null,
  });
}

export function useExperienceComments(experienceId: string, limit = 20) {
  return useQuery({
    queryKey: ["experience-comments", experienceId, limit],
    queryFn: async () => {
      const response = await getExperienceComments(experienceId, limit);
      return response.data.items;
    },
    enabled: Boolean(experienceId),
  });
}

export function useLikeExperienceMutation(experienceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => likeExperience(experienceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      await queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
    },
  });
}

export function useUnlikeExperienceMutation(experienceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unlikeExperience(experienceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      await queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
    },
  });
}

export function useCreateCommentMutation(experienceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { comment_text: string }) =>
      createExperienceComment(experienceId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["experience-comments", experienceId],
      });
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      await queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
    },
  });
}

