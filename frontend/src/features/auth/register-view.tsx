// frontend\src\features\auth\register-view.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

import { ROUTES } from "@/src/constants/routes";
import { RoleSelector } from "./role-selector";
import { TouristRegisterForm } from "./tourist-register-form";
import { ProviderRegisterForm } from "./provider-register-form";
import { BrandLogo } from "@/src/components/common/brand-logo";

type AuthRole = "tourist" | "provider";

export function RegisterView() {
  const [role, setRole] = useState<AuthRole | null>(null);

  if (role === "tourist") return <TouristRegisterForm onBack={() => setRole(null)} />;
  if (role === "provider") return <ProviderRegisterForm onBack={() => setRole(null)} />;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/mock/kigezi_mountain.jpg"
          alt="Cultural landscape"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 py-0 sm:px-6">

        {/* Top bar */}
        <div className="flex w-full items-center justify-between py-4 sm:py-5">
          <BrandLogo size="sm" showTagline={false} />

          <Link
            href={ROUTES.login}
            className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
          >
            Have an account?{" "}
            <span className="font-semibold text-green-400">Sign in</span>
          </Link>
        </div>

        {/* Center content */}
        <div className="flex flex-1 flex-col items-center justify-center w-full py-6 sm:py-8">
          {/* Heading */}
          <div className="mb-8 sm:mb-10 text-center max-w-xs sm:max-w-md px-2">
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-amber-400">Join CulturalHub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              How will you use CulturalHub?
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-300 leading-5 sm:leading-6">
              Choose your role to get started. You can always create a second account later.
            </p>
          </div>

          {/* Role selector */}
          <div className="w-full max-w-xs sm:max-w-xl px-0">
            <RoleSelector value={null} onChange={setRole} />
          </div>
        </div>

        {/* Legal */}
        <p className="py-5 text-center text-xs text-slate-400 leading-5 px-4">
          By continuing you agree to our{" "}
          <Link href="/terms" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

