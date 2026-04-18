


import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE      = "access_token";
const ADMIN_LOGIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "/sys/owner/access";  
const ADMIN_ROOT = "/control"; 
const PUBLIC_LOGIN      = "/login";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    // atob is available in Edge runtime
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(token: string): { valid: boolean; role?: string } {
  const payload = decodeJwtPayload(token);
  if (!payload) return { valid: false };

  const exp = payload["exp"] as number | undefined;
  if (exp && Date.now() / 1000 > exp) return { valid: false };

  return { valid: true, role: payload["role"] as string };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  // ── 1. Already-authenticated admin visiting the secret login page ──────────
  //    Silently redirect to dashboard (don't let the page render)
  if (pathname === ADMIN_LOGIN_PATH) {
    if (token) {
      const { valid, role } = isTokenValid(token);
      if (valid && role === "admin") {
        return NextResponse.redirect(new URL(ADMIN_ROOT, req.url));
      }
    }
    // Not authenticated — let the login page render normally
    return NextResponse.next();
  }

  // ── 2. Protect all /admin/* routes ────────────────────────────────────────
  if (pathname.startsWith(ADMIN_ROOT)) {
    // No token
    if (!token) {
      // Redirect to PUBLIC login — not the secret admin login
      // This reveals nothing about the admin login URL
      const url = new URL(PUBLIC_LOGIN, req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { valid, role } = isTokenValid(token);

    if (!valid || role !== "admin") {
      // Expired or wrong role — also goes to public login
      const url = new URL(PUBLIC_LOGIN, req.url);
      url.searchParams.set("redirect", pathname);
      if (!valid) url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }

    // Valid admin — allow through, add security headers
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control", "/control/:path*", "/sys/owner/access"],
};