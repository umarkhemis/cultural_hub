
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminBookings,
  getAdminExperiences,
  getAdminOverview,
  getAdminPackages,
  getAdminReports,
  getAdminSites,
  getAdminUsers,
} from "@/src/lib/api/admin";

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const response = await getAdminOverview();
      return response.data;
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await getAdminUsers();
      return response.data.items;
    },
  });
}

export function useAdminSites() {
  return useQuery({
    queryKey: ["admin-sites"],
    queryFn: async () => {
      const response = await getAdminSites();
      return response.data.items;
    },
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const response = await getAdminBookings();
      return response.data.items;
    },
  });
}

export function useAdminExperiences() {
  return useQuery({
    queryKey: ["admin-experiences"],
    queryFn: async () => {
      const response = await getAdminExperiences();
      return response.data.items;
    },
  });
}

export function useAdminPackages() {
  return useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const response = await getAdminPackages();
      return response.data.items;
    },
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const response = await getAdminReports();
      return response.data.items;
    },
  });
}