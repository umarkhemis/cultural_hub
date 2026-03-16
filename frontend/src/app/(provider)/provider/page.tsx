
"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { ProviderDashboardCards } from "@/src/features/provider/dashboard-cards";
import {
  useProviderBookings,
  useProviderNotifications,
  useProviderPackages,
} from "@/src/features/provider/hooks";

export default function ProviderDashboardPage() {
  const packagesQuery = useProviderPackages();
  const bookingsQuery = useProviderBookings();
  const notificationsQuery = useProviderNotifications(10);

  const isLoading =
    packagesQuery.isLoading || bookingsQuery.isLoading || notificationsQuery.isLoading;

  const isError =
    packagesQuery.isError || bookingsQuery.isError || notificationsQuery.isError;

  if (isLoading) {
    return <LoadingState label="Loading provider dashboard..." />;
  }

  if (isError) {
    return (
      <ErrorState description="We could not load your provider dashboard right now." />
    );
  }

  const totalPackages = packagesQuery.data?.length ?? 0;
  const totalBookings = bookingsQuery.data?.length ?? 0;
  const totalNotifications = notificationsQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Provider Dashboard
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage your cultural experiences, packages, and booking activity.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={ROUTES.providerNewExperience}>
            <Button variant="secondary">New Experience</Button>
          </Link>
          <Link href={ROUTES.providerNewPackage}>
            <Button>Create Package</Button>
          </Link>
        </div>
      </div>

      <ProviderDashboardCards
        totalPackages={totalPackages}
        totalBookings={totalBookings}
        totalNotifications={totalNotifications}
      />
    </div>
  );
}