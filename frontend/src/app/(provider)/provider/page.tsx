
"use client";

import Link from "next/link";
import { Plus, Sparkles, Package, CalendarCheck, Bell, ArrowRight } from "lucide-react";

import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { ProviderDashboardCards } from "@/src/features/provider/dashboard-cards";
import {
  useProviderBookings,
  useProviderNotifications,
  useProviderPackages,
} from "@/src/features/provider/hooks";
import { useAuth } from "@/src/hooks/useAuth";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const packagesQuery = useProviderPackages();
  const bookingsQuery = useProviderBookings();
  const notificationsQuery = useProviderNotifications(10);

  const isLoading =
    packagesQuery.isLoading || bookingsQuery.isLoading || notificationsQuery.isLoading;
  const isError =
    packagesQuery.isError || bookingsQuery.isError || notificationsQuery.isError;

  if (isLoading) return <LoadingState label="Loading provider dashboard..." />;
  if (isError) return <ErrorState description="We could not load your provider dashboard right now." />;

  const totalPackages = packagesQuery.data?.length ?? 0;
  const totalBookings = bookingsQuery.data?.length ?? 0;
  const totalNotifications = notificationsQuery.data?.length ?? 0;
  const providerName = user?.full_name?.split(" ")[0] ?? "Provider";

  const quickStats = [
    {
      label: "Packages",
      value: totalPackages,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
    {
      label: "Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Alerts",
      value: totalNotifications,
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 lg:px-8"> */}
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 sm:pt-16 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-3 sm:mb-10">

          {/* Greeting badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 mb-3">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">Provider Dashboard</span>
          </div>

          {/* Title row — stacks on mobile, side-by-side on sm+ */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {providerName}
              </h1>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-lg sm:text-sm">
                Manage your cultural experiences, packages, and booking activity all in one place.
              </p>
            </div>

            {/* Action buttons — full-width on mobile */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link href={ROUTES.providerNewExperience} className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all sm:px-4 sm:text-sm">
                  <Plus className="h-3.5 w-3.5" />
                  New Experience
                </button>
              </Link>
              <Link href={ROUTES.providerNewPackage} className="flex-1 sm:flex-none">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-400 transition-all sm:px-4 sm:text-sm">
                  <Package className="h-3.5 w-3.5" />
                  Create Package
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick stat pills ── */}
       
        <div className="grid grid-cols-3 gap-2 mb-6 sm:gap-4 sm:mb-8">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-2 rounded-2xl border ${stat.border} ${stat.bg} px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3.5`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:h-9 sm:w-9">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 leading-none sm:text-xl">{stat.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 sm:text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Quick links ── */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2">
          <Link
            href={ROUTES.providerPackages}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">View All Packages</p>
                <p className="text-xs text-slate-400">Manage your tourism packages</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href={ROUTES.providerBookings}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">View All Bookings</p>
                <p className="text-xs text-slate-400">Track and manage reservations</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

      </div>
    </div>
  );
}