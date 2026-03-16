
"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/src/constants/routes";
import { RoleSelector } from "./role-selector";
import { TouristRegisterForm } from "./tourist-register-form";
import { ProviderRegisterForm } from "./provider-register-form";

type AuthRole = "tourist" | "provider";

export function RegisterView() {
  const [role, setRole] = useState<AuthRole>("tourist");

  return (
    <div className="space-y-6">
      <RoleSelector value={role} onChange={setRole} />

      {role === "tourist" ? (
        <div className="space-y-3">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Create your tourist account
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Discover cultural experiences, save favorites, and book packages.
            </p>
          </div>
          <TouristRegisterForm />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Register as a cultural service provider
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Share your experiences, create packages, and manage bookings.
            </p>
          </div>
          <ProviderRegisterForm />
        </div>
      )}

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-slate-900 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}