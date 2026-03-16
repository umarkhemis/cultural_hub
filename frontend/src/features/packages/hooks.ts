
"use client";

import { useQuery } from "@tanstack/react-query";
import { getPackageDetail, getPackages } from "@/src/lib/api/packages";

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await getPackages();
      return response.data;
    },
  });
}

export function usePackageDetail(packageId: string) {
  return useQuery({
    queryKey: ["package", packageId],
    queryFn: async () => {
      const response = await getPackageDetail(packageId);
      return response.data;
    },
    enabled: Boolean(packageId),
  });
}