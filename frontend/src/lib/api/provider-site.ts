
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { CulturalSite } from "./sites";

export async function getMyProviderSite() {
  const response = await apiClient.get<ApiSuccessResponse<CulturalSite>>("/sites/me");
  return response.data;
}

export async function updateMyProviderSite(payload: {
  site_name?: string;
  description?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
}) {
  const response = await apiClient.patch<ApiSuccessResponse<CulturalSite>>(
    "/sites/me",
    payload
  );
  return response.data;
}