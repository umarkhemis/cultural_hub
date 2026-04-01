
"use client";

import { CalendarCheck } from "lucide-react";
import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { BookingCard } from "@/src/features/bookings/booking-card";
import { useCancelBookingMutation, useTouristBookings } from "@/src/features/bookings/hooks";
import { useToastStore } from "@/src/store/toast-store";

export default function TouristBookingsPage() {
  const { data, isLoading, isError } = useTouristBookings();
  const cancelMutation = useCancelBookingMutation();
  const { addToast } = useToastStore();

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelMutation.mutateAsync({ bookingId });
      addToast({
        type: "success",
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    } catch {
      addToast({
        type: "error",
        title: "Cancellation failed",
        description: "We could not cancel this booking.",
      });
    }
  };

  return (
    <main className="bg-slate-50 pb-16">

      {/* Header */}
      <div className="bg-slate-900 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400">
              <CalendarCheck className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Tourist
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Review your upcoming, confirmed, pending, and past bookings.
          </p>

          {!isLoading && data?.length ? (
            <div className="mt-5 flex gap-5 text-sm text-slate-500">
              <span>
                <span className="text-lg font-bold text-white">{data.length}</span>
                {" "}total
              </span>
              <span>
                <span className="text-lg font-bold text-emerald-400">
                  {data.filter((b) => b.booking_status === "confirmed").length}
                </span>
                {" "}confirmed
              </span>
              <span>
                <span className="text-lg font-bold text-amber-400">
                  {data.filter((b) => b.booking_status === "awaiting_payment").length}
                </span>
                {" "}pending payment
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <PageContainer className="max-w-4xl mt-8">
        {isLoading && <LoadingState label="Loading your bookings..." />}
        {isError && <ErrorState description="We could not load your bookings right now." />}

        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="No bookings yet"
            description="When you book a tourism package, it will appear here."
          />
        )}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-4">
            {data.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancel}
                isCancelling={cancelMutation.isPending}
              />
            ))}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}

