
import type { UserRole } from "@/src/types/auth";
import { ROUTES } from "@/src/constants/routes";

export function getRedirectPathByRole(role: UserRole) {
  if (role === "provider") return ROUTES.providerRoot;
  if (role === "tourist") return ROUTES.feed;
  return ROUTES.feed;
}