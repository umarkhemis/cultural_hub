
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExperience, getProviderExperiences } from "@/src/lib/api/experiences";
import { createPackage, getProviderPackages } from "@/src/lib/api/packages";
import { getProviderBookings } from "@/src/lib/api/bookings";
import { getNotifications } from "@/src/lib/api/notifications";
// import { createExperience, getProviderExperiences } from "@/src/lib/api/experiences";

export function useProviderPackages() {
  return useQuery({
    queryKey: ["provider-packages"],
    queryFn: async () => {
      const response = await getProviderPackages();
      return response.data.items;
    },
  });
}

export function useProviderBookings() {
  return useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => {
      const response = await getProviderBookings();
      return response.data.items;
    },
  });
}

export function useProviderNotifications(limit = 20) {
  return useQuery({
    queryKey: ["provider-notifications", limit],
    queryFn: async () => {
      const response = await getNotifications(limit);
      return response.data.items;
    },
  });
}

export function useCreateExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExperience,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["public-feed"] });
      await queryClient.invalidateQueries({ queryKey: ["provider-experiences"] });
    },
  });
}

export function useCreatePackageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["provider-packages"] });
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}

export function useProviderExperiences() {
  return useQuery({
    queryKey: ["provider-experiences"],
    queryFn: async () => {
      const response = await getProviderExperiences();
      return response.data.items;
    },
  });
}