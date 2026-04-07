
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminBookings } from "@/src/features/admin/hooks";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminBookingsPage() {
  const { data, isLoading, isError } = useAdminBookings();

  if (isLoading) return <LoadingState label="Loading bookings..." />;
  if (isError) return <ErrorState description="Could not load bookings." />;

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="Review booking activity, payment state, and customer lifecycle."
      />

      <div className="grid gap-4">
        {data?.map((booking) => (
          <AdminListCard
            key={booking.id}
            title={`${booking.package_title_snapshot} • ${booking.booking_reference}`}
            subtitle={`Provider: ${booking.provider_name_snapshot}`}
            meta={booking.booking_status}
          >
            <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-5">
              <span>Payment: {booking.payment_status}</span>
              <span>Participants: {booking.participants_count}</span>
              <span>Total paid: {formatCurrency(booking.total_price)}</span>
              <span>Platform fee: {formatCurrency(booking.platform_fee)}</span>
              <span>Provider payout: {formatCurrency(booking.provider_payout_amount)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}