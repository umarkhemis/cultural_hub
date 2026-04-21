
"use client";

import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import {
  User, Mail, Phone, Shield, CalendarCheck,
  Bell, Settings, ChevronRight, LogOut,
} from "lucide-react";
import { ROUTES } from "@/src/constants/routes";

export default function TouristProfilePage() {
  const { user, clearSession } = useAuth();

  const initials = user?.full_name?.slice(0, 2).toUpperCase() || "TU";

  const infoFields = [
    { icon: User, label: "Full Name", value: user?.full_name || "—" },
    { icon: Mail, label: "Email Address", value: user?.email || "—" },
    { icon: Phone, label: "Phone Number", value: user?.phone || "Not provided" },
    { icon: Shield, label: "Account Role", value: user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "—" },
  ];

  const quickLinks = [
    { icon: CalendarCheck, label: "My Bookings", href: ROUTES.touristBookings, description: "View and manage your bookings" },
    { icon: Bell, label: "Notifications", href: ROUTES.touristNotifications, description: "Stay updated on your activity" },
  ];

  return (
    <div className="bg-slate-50 pb-16 pt-16">

      {/* Profile hero */}
      <div className="bg-slate-900 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-amber-400 text-2xl font-black text-slate-900 shadow-xl shadow-amber-400/20">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-400">
                <div className="h-2 w-2 rounded-full bg-emerald-900" />
              </div>
            </div>

            {/* Name + role */}
            <div>
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {user?.full_name || "Tourist User"}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-white/80">
                  {user?.role || "tourist"}
                </span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-6 sm:px-6 lg:px-8">

        {/* Account info */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Account Details
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {infoFields.map((field) => (
              <div key={field.label} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                  <field.icon className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400">{field.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Quick Access
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50">
                  <link.icon className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                  <p className="text-xs text-slate-400">{link.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon card */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Coming Soon
            </p>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <Settings className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Profile Editing</p>
                <p className="mt-1 text-sm text-slate-400 leading-6">
                  Update your name, photo, saved experiences, and notification preferences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={clearSession}
          className="flex w-full items-center justify-center gap-2 rounded-[28px] border border-red-200 bg-red-50 py-4 text-sm font-semibold text-red-600 transition-all hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>

      </div>
    </div>
  );
}