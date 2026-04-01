
import { apiClient } from "@/src/lib/api/client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { Booking } from "@/src/types/booking";
import type { Experience } from "@/src/types/experience";
import type { TourismPackage } from "@/src/types/package";
import type { CulturalSite } from "@/src/lib/api/sites";

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

type ListResponse<T> = {
  items: T[];
};

export async function getAdminOverview() {
  const response = await apiClient.get<ApiSuccessResponse<AdminOverview>>(
    "/admin/overview"
  );
  return response.data;
}

export async function getAdminUsers() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<AdminUser>>>(
    "/admin/users"
  );
  return response.data;
}

export async function getAdminSites() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<CulturalSite>>>(
    "/admin/sites"
  );
  return response.data;
}

export async function getAdminBookings() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<Booking>>>(
    "/admin/bookings"
  );
  return response.data;
}

export async function getAdminExperiences() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<Experience>>>(
    "/admin/experiences"
  );
  return response.data;
}

export async function getAdminPackages() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<TourismPackage>>>(
    "/admin/packages"
  );
  return response.data;
}

export async function getAdminReports() {
  const response = await apiClient.get<ApiSuccessResponse<ListResponse<AdminReport>>>(
    "/admin/reports"
  );
  return response.data;
}