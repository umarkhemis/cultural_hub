
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { NotificationItem } from "@/src/types/notification";

type NotificationsResponse = {
  items: NotificationItem[];
};

export async function getNotifications(limit = 20) {
  const response = await apiClient.get<ApiSuccessResponse<NotificationsResponse>>(
    "/notifications",
    { params: { limit } }
  );
  return response.data;
}

export async function markNotificationRead(notificationId: string) {
  const response = await apiClient.patch<ApiSuccessResponse<NotificationItem>>(
    `/notifications/${notificationId}/read`
  );
  return response.data;
}