
"use client";

import { Calendar, User, Hash, Clock, AlertCircle, ArrowRight, XCircle } from "lucide-react";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";
import type { Booking } from "@/src/types/booking";
import { cn } from "@/src/utils/cn";

type BookingCardProps = {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isCancelling?: boolean;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
  },
  awaiting_payment: {
    label: "Awaiting Payment",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
  completed: {
    label: "Completed",
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
  },
  pending: {
    label: "Pending",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
  },
};

const paymentConfig: Record<string, { label: string; color: string }> = {
  paid: { label: "Paid", color: "text-emerald-600" },
  unpaid: { label: "Unpaid", color: "text-amber-600" },
  refunded: { label: "Refunded", color: "text-slate-500" },
  failed: { label: "Failed", color: "text-red-600" },
};

export function BookingCard({ booking, onCancel, isCancelling = false }: BookingCardProps) {
  const canCancel =
    booking.booking_status === "awaiting_payment" ||
    booking.booking_status === "confirmed";

  const status = statusConfig[booking.booking_status] ?? {
    label: booking.booking_status,
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
  };

  const payment = paymentConfig[booking.payment_status] ?? {
    label: booking.payment_status,
    color: "text-slate-500",
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">

      {/* Top accent — colored by status */}
      <div className={cn("h-1 w-full", {
        "bg-emerald-400": booking.booking_status === "confirmed",
        "bg-amber-400": booking.booking_status === "awaiting_payment",
        "bg-red-400": booking.booking_status === "cancelled",
        "bg-slate-300": booking.booking_status === "completed",
        "bg-blue-400": booking.booking_status === "pending",
      })} />

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {booking.package_title_snapshot}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{booking.provider_name_snapshot}</p>
          </div>

          {/* Status badge */}
          <span className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            status.bg, status.color
          )}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
        </div>

        {/* Info grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Hash className="h-3 w-3 text-slate-400" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ref</p>
            </div>
            <p className="text-xs font-mono font-medium text-slate-700 truncate">
              {booking.booking_reference}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Booked</p>
            </div>
            <p className="text-xs font-medium text-slate-700">{formatDate(booking.booking_date)}</p>
          </div>

          {booking.event_date_snapshot && (
            <div className="rounded-2xl bg-amber-50 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="h-3 w-3 text-amber-500" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">Event</p>
              </div>
              <p className="text-xs font-medium text-amber-700">
                {formatDate(booking.event_date_snapshot)}
              </p>
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="h-3 w-3 text-slate-400" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Guests</p>
            </div>
            <p className="text-xs font-medium text-slate-700">{booking.participants_count}</p>
          </div>
        </div>

        {/* Reserved until */}
        {booking.reserved_until && (
          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              Reserved until <span className="font-semibold">{formatDate(booking.reserved_until)}</span>
            </p>
          </div>
        )}

        {/* Cancellation reason */}
        {booking.cancellation_reason && (
          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{booking.cancellation_reason}</p>
          </div>
        )}

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(booking.total_price)}
            </p>
            <span className={cn("text-xs font-semibold", payment.color)}>
              {payment.label}
            </span>
          </div>

          {canCancel && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              disabled={isCancelling}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              {isCancelling ? "Cancelling..." : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


