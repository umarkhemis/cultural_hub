
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  initializePayment,
  processMockPaymentWebhook,
} from "@/src/lib/api/payments";

export function useInitializePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializePayment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tourist-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMockPaymentWebhookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processMockPaymentWebhook,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tourist-bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
}