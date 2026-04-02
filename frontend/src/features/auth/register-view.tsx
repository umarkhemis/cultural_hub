
"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import { RoleSelector } from "./role-selector";
import { TouristRegisterForm } from "./tourist-register-form";
import { ProviderRegisterForm } from "./provider-register-form";

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
        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-950/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5">
          <Link href={ROUTES.welcome} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400 shadow-lg shadow-amber-400/30">
              <Globe className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-base font-bold text-white">CulturalHub</span>
          </Link>
          <Link
            href={ROUTES.login}
            className="text-sm text-slate-300 hover:text-white transition-colors"
          >
            Have an account?{" "}
            <span className="font-semibold text-amber-400">Sign in</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center max-w-md">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400">Join CulturalHub</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How will you use CulturalHub?
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-6">
            Choose your role to get started. You can always create a second account later.
          </p>
        </div>

        {/* Role selector */}
        <div className="w-full max-w-xl">
          <RoleSelector value={null} onChange={setRole} />
        </div>

        {/* Legal */}
        <p className="mt-10 text-center text-xs text-slate-400 leading-5">
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

