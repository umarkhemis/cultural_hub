
"use client";

import { useAuth } from "@/src/hooks/useAuth";

export default function TouristProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-slate-100 text-xl font-semibold text-slate-700">
            {user?.full_name?.slice(0, 2).toUpperCase() || "TU"}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              My Profile
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage your account and view your registered details.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {user?.full_name || "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {user?.email || "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {user?.phone || "Not provided"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
            <p className="mt-2 text-sm font-medium capitalize text-slate-900">
              {user?.role || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Coming next</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This profile screen can later support profile editing, saved experiences,
          and personalized preferences.
        </p>
      </div>
    </div>
  );
}