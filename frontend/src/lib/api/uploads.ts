
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";

export type UploadedMedia = {
  resource_type: "image" | "video";
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
};

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiSuccessResponse<UploadedMedia>>(
    "/uploads/media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}