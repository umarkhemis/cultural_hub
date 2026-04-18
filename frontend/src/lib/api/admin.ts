

import { apiClient } from "@/src/lib/api/client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { Booking } from "@/src/types/booking";
import type { Experience } from "@/src/types/experience";
import type { TourismPackage } from "@/src/types/package";
import type { CulturalSite } from "@/src/lib/api/sites";

// ─── Types ────────────────────────────────────────────────

export type AdminOverview = {
  total_users: number;
  total_providers: number;
  total_sites: number;
  total_packages: number;
  total_experiences: number;
  total_bookings: number;
  total_reports: number;
};

export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
};

export type AdminReport = {
  id: string;
  reporter_id: string;
  reason: string;
  status: string;
  created_at: string;
};

type ListResponse<T> = { items: T[] };

// ─── GET endpoints ────────────────────────────────────────

export async function getAdminOverview() {
  const r = await apiClient.get<ApiSuccessResponse<AdminOverview>>("/admin/overview");
  return r.data;
}

export async function getAdminUsers() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<AdminUser>>>("/admin/users");
  return r.data;
}

export async function getAdminSites() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<CulturalSite>>>("/admin/sites");
  return r.data;
}

export async function getAdminBookings() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<Booking>>>("/admin/bookings");
  return r.data;
}

export async function getAdminExperiences() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<Experience>>>("/admin/experiences");
  return r.data;
}

export async function getAdminPackages() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<TourismPackage>>>("/admin/packages");
  return r.data;
}

export async function getAdminReports() {
  const r = await apiClient.get<ApiSuccessResponse<ListResponse<AdminReport>>>("/admin/reports");
  return r.data;
}

// ─── PATCH mutations ──────────────────────────────────────

export async function patchAdminUser(
  userId: string,
  body: { is_active?: boolean; is_verified?: boolean }
) {
  const r = await apiClient.patch<ApiSuccessResponse<AdminUser>>(`/admin/users/${userId}`, body);
  return r.data;
}

export async function patchAdminSite(
  siteId: string,
  body: { verification_status?: "verified" | "unverified" | "pending" }
) {
  const r = await apiClient.patch<ApiSuccessResponse<CulturalSite>>(`/admin/sites/${siteId}`, body);
  return r.data;
}

export async function patchAdminExperience(
  experienceId: string,
  body: { status?: string }
) {
  const r = await apiClient.patch<ApiSuccessResponse<Experience>>(`/admin/experiences/${experienceId}`, body);
  return r.data;
}

export async function patchAdminPackage(
  packageId: string,
  body: { status?: string }
) {
  const r = await apiClient.patch<ApiSuccessResponse<TourismPackage>>(`/admin/packages/${packageId}`, body);
  return r.data;
}

export async function patchAdminReport(
  reportId: string,
  body: { status?: "resolved" | "dismissed" }
) {
  const r = await apiClient.patch<ApiSuccessResponse<AdminReport>>(`/admin/reports/${reportId}`, body);
  return r.data;
}