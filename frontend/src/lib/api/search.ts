
// Add to your existing api file, e.g. src/lib/api/search.ts

import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";

export type SearchSiteResult = {
  id: string;
  site_name: string;
  location?: string | null;
  logo_url?: string | null;
  verification_status?: string | null;
};

export type SearchExperienceResult = {
  id: string;
  caption: string;
  location?: string | null;
  provider_id: string;
};

export type SearchResults = {
  sites: SearchSiteResult[];
  experiences: SearchExperienceResult[];
};

export async function searchAll(q: string) {
  const response = await apiClient.get<ApiSuccessResponse<SearchResults>>(
    "/search",
    { params: { q } }
  );
  return response.data;
}