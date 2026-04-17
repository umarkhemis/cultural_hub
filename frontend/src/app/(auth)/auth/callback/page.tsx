
// frontend/src/app/auth/callback/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { Loader2 } from "lucide-react";
import type { CurrentUser, AuthTokens } from "@/src/types/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    // Backend can pass this flag when a provider hasn't set up their site yet
    const needsSiteDetails = searchParams.get("needs_site_details") === "true";

    if (token && userParam) {
      try {
        const user: CurrentUser = JSON.parse(atob(userParam));
        const tokens: AuthTokens = { access_token: token };
        setSession(user, tokens);

        if (user.role === "provider" && needsSiteDetails) {
          // Provider signed up with Google — they still need to fill in cultural site info
          router.replace("/register/provider-complete");
        } else if (user.role === "provider") {
          router.replace("/dashboard/provider");
        } else {
          router.replace("/dashboard");
        }
      } catch {
        router.replace("/login?error=google_failed");
      }
    } else {
      router.replace("/login?error=google_failed");
    }
  }, [searchParams, setSession, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      <p className="text-sm text-slate-500">Signing you in with Google…</p>
    </div>
  );
}

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    <p className="text-sm text-slate-500">Signing you in with Google…</p>
  </div>
);

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackContent />
    </Suspense>
  );
}


