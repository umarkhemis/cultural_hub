
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      router.replace("/login?error=google_failed");
      return;
    }


    const exchangeCode = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/exchange`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          }
        );

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          console.error("Exchange failed:", res.status, errorBody);
          router.replace("/login?error=google_failed");
          return;
        }

        const json = await res.json();
        console.log("Exchange response:", json); 
        const { data } = json;
        const { auth_payload, needs_site_details } = data;

        setSession(auth_payload.user, {
          access_token: auth_payload.tokens.access_token,
          refresh_token: auth_payload.tokens.refresh_token,
        });

        if (auth_payload.user.role === "provider" && needs_site_details) {
          router.replace("/register/provider-complete");
        } else if (auth_payload.user.role === "provider") {
          router.replace("/provider");
        } else {
          // router.replace("/tourist");
          router.replace("/feed");
        }
      } catch (err) {
        console.error("Exchange error:", err); 
        router.replace("/login?error=google_failed");
      }
    };

    exchangeCode();
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
































// // frontend/src/app/auth/callback/page.tsx
// "use client";

// import { Suspense, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuthStore } from "@/src/store/auth-store";
// import { Loader2 } from "lucide-react";
// import type { CurrentUser, AuthTokens } from "@/src/types/auth";

// function CallbackContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { setSession } = useAuthStore();

//   useEffect(() => {
//     const token = searchParams.get("token");
//     const userParam = searchParams.get("user");
//     // Backend can pass this flag when a provider hasn't set up their site yet
//     const needsSiteDetails = searchParams.get("needs_site_details") === "true";

    

//     if (token && userParam) {
//       try {
//         const normalized = userParam.replace(/-/g, "+").replace(/_/g, "/");
//         const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
//         const user: CurrentUser = JSON.parse(atob(padded));

//         const tokens: AuthTokens = { access_token: token };
//         setSession(user, tokens);

//         if (user.role === "provider" && needsSiteDetails) {
//           router.replace("/register/provider-complete");
//         } else if (user.role === "provider") {
//           router.replace("/dashboard/provider");
//         } else {
//           router.replace("/dashboard");
//         }
//       } catch {
//         router.replace("/login?error=google_failed");
//       }
//     }


//     // if (token && userParam) {
//     //   try {
//     //     const user: CurrentUser = JSON.parse(atob(userParam));
//     //     const tokens: AuthTokens = { access_token: token };
//     //     setSession(user, tokens);

//     //     if (user.role === "provider" && needsSiteDetails) {
//     //       // Provider signed up with Google — they still need to fill in cultural site info
//     //       router.replace("/register/provider-complete");
//     //     } else if (user.role === "provider") {
//     //       router.replace("/dashboard/provider");
//     //     } else {
//     //       router.replace("/dashboard");
//     //     }
//     //   } catch {
//     //     router.replace("/login?error=google_failed");
//     //   }
//     // } else {
//     //   router.replace("/login?error=google_failed");
//     // }
//   }, [searchParams, setSession, router]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//       <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
//       <p className="text-sm text-slate-500">Signing you in with Google…</p>
//     </div>
//   );
// }

// const LoadingFallback = () => (
//   <div className="min-h-screen flex flex-col items-center justify-center gap-4">
//     <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
//     <p className="text-sm text-slate-500">Signing you in with Google…</p>
//   </div>
// );

// export default function AuthCallbackPage() {
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <CallbackContent />
//     </Suspense>
//   );
// }


