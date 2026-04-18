
// src/utils/auth-cookies.ts
//
// Writes the JWT access token to a cookie so Next.js middleware
// can read it at the edge to protect /admin/* routes.
//
// NOT httpOnly (JS must read it for API calls).
// Security comes from:
//   • SameSite=Strict → no cross-site request forgery
//   • Secure in production → HTTPS only
//   • Short expiry matching your JWT TTL
//   • FastAPI verifying the signature on every single API call

export function writeTokenCookie(
  accessToken: string,
  expiryMinutes = 60
): void {
  if (typeof document === "undefined") return;

  const expires = new Date(Date.now() + expiryMinutes * 60 * 1000).toUTCString();
  const secure  = process.env.NODE_ENV === "production" ? "; Secure" : "";

  document.cookie = [
    `access_token=${accessToken}`,
    `expires=${expires}`,
    `path=/`,
    `SameSite=Strict`,
    secure,
  ].filter(Boolean).join("; ");
}

export function clearTokenCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie =
    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
}