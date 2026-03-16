
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { TourismPackage } from "@/src/types/package";

type PackageListResponse = {
  items: TourismPackage[];
};

type ProviderPackagePayload = {
  package_name: string;
  description: string;
  price: number;
  duration?: string;
  event_date?: string;
  includes_text?: string;
  media_items?: Array<{
    media_url: string;
    thumbnail_url?: string;
    media_order: number;
  }>;
};

export async function getPackages() {
  const response = await apiClient.get<ApiSuccessResponse<PackageListResponse>>(
    "/packages"
  );
  return response.data;
}

export async function getPackageDetail(packageId: string) {
  const response = await apiClient.get<ApiSuccessResponse<TourismPackage>>(
    `/packages/${packageId}`
  );
  return response.data;
}

export async function getProviderPackages() {
  const response = await apiClient.get<ApiSuccessResponse<PackageListResponse>>(
    "/providers/me/packages"
  );
  return response.data;
}

export async function createPackage(payload: ProviderPackagePayload) {
  const response = await apiClient.post<ApiSuccessResponse<TourismPackage>>(
    "/packages",
    payload
  );
  return response.data;
}