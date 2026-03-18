
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { Experience } from "@/src/types/experience";
import type { TourismPackage } from "@/src/types/package";

export type CulturalSite = {
  id: string;
  site_name: string;
  description?: string | null;
  location?: string | null;
  logo_url?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  verification_status: string;
  experiences_count?: number;
  packages_count?: number;
  followers_count?: number;
  following?: boolean;
  created_at: string;
};

export type CulturalSiteDetail = CulturalSite & {
  experiences: Experience[];
  packages: TourismPackage[];
};

type SitesListResponse = {
  items: CulturalSite[];
};

export async function getSites() {
  const response = await apiClient.get<ApiSuccessResponse<SitesListResponse>>(
    "/sites"
  );
  return response.data;
}

export async function getSiteDetail(siteId: string) {
  const response = await apiClient.get<ApiSuccessResponse<CulturalSiteDetail>>(
    `/sites/${siteId}`
  );
  return response.data;
}

export async function followSite(siteId: string) {
  const response = await apiClient.post<ApiSuccessResponse<{
    site_id: string;
    followers_count: number;
    following: boolean;
  }>>(`/sites/${siteId}/follow`);
  return response.data;
}

export async function unfollowSite(siteId: string) {
  const response = await apiClient.delete<ApiSuccessResponse<{
    site_id: string;
    followers_count: number;
    following: boolean;
  }>>(`/sites/${siteId}/follow`);
  return response.data;
}


