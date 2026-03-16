
"use client";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { BookingCard } from "@/src/features/bookings/booking-card";
import { useTouristBookings } from "@/src/features/bookings/hooks";

export default function TouristBookingsPage() {
  const { data, isLoading, isError } = useTouristBookings();

  return (
    <main className="py-2">
      <PageContainer className="max-w-4xl px-0 sm:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Review your upcoming and past cultural tourism bookings.
          </p>
        </div>

        {isLoading ? <LoadingState label="Loading your bookings..." /> : null}
        {isError ? (
          <ErrorState description="We could not load your bookings right now." />
        ) : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            description="When you book a tourism package, it will appear here."
          />
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-5">
            {data.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}