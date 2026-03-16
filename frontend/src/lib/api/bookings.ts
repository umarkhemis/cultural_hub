
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { Booking } from "@/src/types/booking";

type BookingListResponse = {
  items: Booking[];
};

type CreateBookingPayload = {
  package_id: string;
  participants: Array<{
    participant_name: string;
    participant_email?: string;
    participant_phone?: string;
    special_requests?: string;
  }>;
};

export async function getTouristBookings() {
  const response = await apiClient.get<ApiSuccessResponse<BookingListResponse>>(
    "/bookings/me"
  );
  return response.data;
}

export async function getProviderBookings() {
  const response = await apiClient.get<ApiSuccessResponse<BookingListResponse>>(
    "/bookings/provider"
  );
  return response.data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await apiClient.post<ApiSuccessResponse<Booking>>(
    "/bookings",
    payload
  );
  return response.data;
}