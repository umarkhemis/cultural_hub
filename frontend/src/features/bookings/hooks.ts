
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, createBooking, getTouristBookings } from "@/src/lib/api/bookings";

export function useTouristBookings() {
  return useQuery({
    queryKey: ["tourist-bookings"],
    queryFn: async () => {
      const response = await getTouristBookings();
      return response.data.items;
    },
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tourist-bookings"] });
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      cancelBooking(bookingId, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tourist-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}

