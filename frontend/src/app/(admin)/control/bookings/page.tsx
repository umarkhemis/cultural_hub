
"use client";

/**
 * Admin Bookings Page
 * Full table: reference, package, provider, participants,
 * total, platform fee, payout, booking & payment status.
 */

import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { AdminPageHeader, DataTable, AdminBadge, StatCard } from "@/src/components/admin/admin-ui";
import { useAdminBookings } from "@/src/features/admin/hooks";
import { formatDate } from "@/src/utils/formatDate";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { BookOpen, DollarSign, Users, TrendingUp } from "lucide-react";
import type { Booking } from "@/src/types/booking";

export default function AdminBookingsPage() {
  const { data, isLoading, isError } = useAdminBookings();

  if (isLoading) return <LoadingState label="Loading bookings..." />;
  if (isError)   return <ErrorState description="Could not load bookings." />;

  const bookings = data ?? [];

  // Aggregate financials
  const totalRevenue  = bookings.reduce((acc, b) => acc + (b.total_price ?? 0), 0);
  const totalFees     = bookings.reduce((acc, b) => acc + (b.platform_fee ?? 0), 0);
  const totalPayouts  = bookings.reduce((acc, b) => acc + (b.provider_payout_amount ?? 0), 0);
  const totalParticip = bookings.reduce((acc, b) => acc + (b.participants_count ?? 0), 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Bookings"
        description="Complete booking ledger with payment tracking and financial breakdown."
      />

      {/* Financial summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Revenue"     value={formatCurrency(totalRevenue)}  icon={DollarSign} iconColor="bg-emerald-500" />
        <StatCard label="Platform Fees"     value={formatCurrency(totalFees)}     icon={TrendingUp} iconColor="bg-amber-400"   />
        <StatCard label="Provider Payouts"  value={formatCurrency(totalPayouts)}  icon={BookOpen}   iconColor="bg-blue-500"    />
        <StatCard label="Total Participants" value={totalParticip}                icon={Users}      iconColor="bg-violet-500"  />
      </div>

      <DataTable
        data={bookings}
        searchKeys={[
          "booking_reference", "package_title_snapshot", "provider_name_snapshot",
        ] as (keyof Booking)[]}
        searchPlaceholder="Search by reference or package..."
        emptyMessage="No bookings found."
        columns={[
          {
            key: "booking_reference",
            label: "Reference",
            sortable: true,
            render: (b) => (
              <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                {b.booking_reference}
              </span>
            ),
          },
          {
            key: "package_title_snapshot",
            label: "Package",
            sortable: true,
            render: (b) => (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-[160px]">{b.package_title_snapshot}</p>
                <p className="text-xs text-slate-500 truncate">{b.provider_name_snapshot}</p>
              </div>
            ),
          },
          {
            key: "booking_status",
            label: "Booking",
            sortable: true,
            render: (b) => <AdminBadge value={b.booking_status} />,
          },
          {
            key: "payment_status",
            label: "Payment",
            sortable: true,
            render: (b) => <AdminBadge value={b.payment_status} />,
          },
          {
            key: "participants_count",
            label: "Pax",
            hideOnMobile: true,
            sortable: true,
            render: (b) => (
              <span className="text-sm font-medium text-slate-300">{b.participants_count}</span>
            ),
          },
          {
            key: "total_price",
            label: "Total",
            sortable: true,
            hideOnMobile: true,
            render: (b) => (
              <span className="text-sm font-semibold text-white">{formatCurrency(b.total_price)}</span>
            ),
          },
          {
            key: "platform_fee",
            label: "Fee",
            hideOnMobile: true,
            render: (b) => (
              <span className="text-xs text-slate-500">{formatCurrency(b.platform_fee)}</span>
            ),
          },
          {
            key: "provider_payout_amount",
            label: "Payout",
            hideOnMobile: true,
            render: (b) => (
              <span className="text-xs text-emerald-400 font-medium">{formatCurrency(b.provider_payout_amount)}</span>
            ),
          },
          {
            key: "created_at",
            label: "Date",
            sortable: true,
            hideOnMobile: true,
            render: (b) => <span className="text-xs text-slate-500">{formatDate(b.created_at)}</span>,
          },
        ]}
      />
    </div>
  );
}