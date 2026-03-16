
import { apiClient } from "./client";
import type {
  AuthPayload,
  LoginPayload,
  ProviderRegisterPayload,
  TouristRegisterPayload,
  CurrentUser,
} from "@/src/types/auth";
// import { AuthPayload } from "@/src/types/auth";
// import type { ApiSuccessResponse } from "@/types/api";
import type { ApiSuccessResponse } from "@/src/types/api";

export async function registerTourist(payload: TouristRegisterPayload) {
  const response = await apiClient.post<ApiSuccessResponse<AuthPayload>>(
    "/auth/register",
    payload
  );
  return response.data;
}

export async function registerProvider(payload: ProviderRegisterPayload) {
  const response = await apiClient.post<ApiSuccessResponse<AuthPayload>>(
    "/auth/register",
    payload
  );
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post<ApiSuccessResponse<AuthPayload>>(
    "/auth/login",
    payload
  );
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiSuccessResponse<CurrentUser>>(
    "/auth/me"
  );
  return response.data;
}