
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExperienceComment,
  getExperienceComments,
  likeExperience,
  unlikeExperience,
} from "@/src/lib/api/experiences";

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