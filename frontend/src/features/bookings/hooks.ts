
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBooking, getTouristBookings } from "@/src/lib/api/bookings";

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