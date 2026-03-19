
"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "@/src/lib/api/uploads";

export function useUploadMediaMutation() {
  return useMutation({
    mutationFn: uploadMedia,
  });
}