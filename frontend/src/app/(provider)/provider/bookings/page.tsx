
"use client";

import { BookingCard } from "@/src/features/bookings/booking-card";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useProviderBookings } from "@/src/features/provider/hooks";

export default function ProviderBookingsPage() {
  const { data, isLoading, isError } = useProviderBookings();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Bookings
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review bookings made for your published tourism packages.
        </p>
      </div>

      {isLoading ? <LoadingState label="Loading bookings..." /> : null}
      {isError ? (
        <ErrorState description="We could not load provider bookings right now." />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="When tourists start booking your packages, they will appear here."
        />
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className="grid gap-5">
          {data.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : null}
    </div>
  );
}