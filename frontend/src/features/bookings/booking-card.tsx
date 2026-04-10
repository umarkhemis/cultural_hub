
"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";
import { useBookingStore } from "@/src/store/booking-store";
import type { Booking } from "@/src/types/booking";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";
import { BookingStatusBadge, PaymentStatusBadge } from "./booking-badges";




type BookingCardProps = {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  isCancelling?: boolean;
  showProviderPayout?: boolean;
};
import { useMemo } from "react";


export function BookingCard({
  booking,
  onCancel,
  isCancelling = false,
  showProviderPayout = false,
}: BookingCardProps) {
  const { setBookingResult } = useBookingStore();

  const canCancel =
    booking.booking_status === "awaiting_payment" ||
    booking.booking_status === "confirmed";

  const canRetryPayment =
    booking.booking_status === "awaiting_payment" &&
    (booking.payment_status === "unpaid" || booking.payment_status === "failed");


  const now = useMemo(() => new Date(), []);
  const reservationExpired =
    !!booking.reserved_until &&
    new Date(booking.reserved_until).getTime() < now.getTime();

  // const reservationExpired =
  //   booking.reserved_until &&
  //   new Date(booking.reserved_until).getTime() < Date.now();

  const retryHref = `${ROUTES.bookingCheckout}?bookingId=${booking.id}`;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {booking.package_title_snapshot}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Booking Ref: {booking.booking_reference}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <BookingStatusBadge status={booking.booking_status} />
            <PaymentStatusBadge status={booking.payment_status} />
          </div>

          <div className="grid gap-2 text-sm text-slate-600">
            <p>Provider: {booking.provider_name_snapshot}</p>
            <p>Booking date: {formatDate(booking.booking_date)}</p>

            {booking.event_date_snapshot ? (
              <p>Event date: {formatDate(booking.event_date_snapshot)}</p>
            ) : null}

            {booking.reserved_until ? (
              <p className={reservationExpired ? "text-red-600" : ""}>
                Reserved until: {formatDate(booking.reserved_until)}
              </p>
            ) : null}

            {booking.cancelled_at ? (
              <p className="text-red-600">
                Cancelled at: {formatDate(booking.cancelled_at)}
              </p>
            ) : null}

            {booking.cancellation_reason ? (
              <p className="text-red-600">
                Cancellation reason: {booking.cancellation_reason}
              </p>
            ) : null}

            {booking.booking_notes ? (
              <p>Notes: {booking.booking_notes}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-3 sm:text-right">
          <p className="text-lg font-semibold text-slate-900">
            {formatCurrency(booking.total_price)}
          </p>

          {showProviderPayout ? (
            <p className="text-sm text-slate-600">
              Provider payout:{" "}
              <span className="font-medium text-slate-900">
                {formatCurrency(booking.provider_payout_amount)}
              </span>
            </p>
          ) : null}


          <p className="text-sm text-slate-600">
            Participants: <span className="font-medium">{booking.participants_count}</span>
          </p>

          <div className="flex flex-col gap-2 sm:items-end">
            {canRetryPayment && !reservationExpired ? (
              <Link
                href={retryHref}
                onClick={() =>
                  setBookingResult({
                    bookingId: booking.id,
                    bookingReference: booking.booking_reference,
                    reservedUntil: booking.reserved_until,
                  })
                }
              >
                <Button>Retry Payment</Button>
              </Link>
            ) : null}

            {canCancel && onCancel ? (
              <Button
                variant="secondary"
                onClick={() => onCancel(booking.id)}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}



