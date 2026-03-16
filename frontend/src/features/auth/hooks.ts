
"use client";

import { useMutation } from "@tanstack/react-query";
import { loginUser, registerProvider, registerTourist } from "@/src/lib/api/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
  });
}

export function useTouristRegisterMutation() {
  return useMutation({
    mutationFn: registerTourist,
  });
}

export function useProviderRegisterMutation() {
  return useMutation({
    mutationFn: registerProvider,
  });
}