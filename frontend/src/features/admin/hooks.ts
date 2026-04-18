
"use client";


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOverview,
  getAdminUsers,
  getAdminSites,
  getAdminBookings,
  getAdminExperiences,
  getAdminPackages,
  getAdminReports,
  patchAdminUser,
  patchAdminSite,
  patchAdminExperience,
  patchAdminPackage,
  patchAdminReport,
} from "@/src/lib/api/admin";

// ─── READ queries ─────────────────────────────────────────

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await getAdminOverview()).data,
    staleTime: 30_000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await getAdminUsers()).data.items,
  });
}

export function useAdminSites() {
  return useQuery({
    queryKey: ["admin-sites"],
    queryFn: async () => (await getAdminSites()).data.items,
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => (await getAdminBookings()).data.items,
  });
}

export function useAdminExperiences() {
  return useQuery({
    queryKey: ["admin-experiences"],
    queryFn: async () => (await getAdminExperiences()).data.items,
  });
}

export function useAdminPackages() {
  return useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => (await getAdminPackages()).data.items,
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => (await getAdminReports()).data.items,
  });
}

// ─── PATCH mutations ──────────────────────────────────────

export function usePatchAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof patchAdminUser>[1] }) =>
      patchAdminUser(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function usePatchAdminSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof patchAdminSite>[1] }) =>
      patchAdminSite(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sites"] }),
  });
}

export function usePatchAdminExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status: string } }) =>
      patchAdminExperience(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-experiences"] }),
  });
}

export function usePatchAdminPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status: string } }) =>
      patchAdminPackage(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-packages"] }),
  });
}

export function usePatchAdminReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { status: "resolved" | "dismissed" } }) =>
      patchAdminReport(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reports"] }),
  });
}