
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";
import type { Booking } from "@/src/types/booking";

type BookingCardProps = {
  booking: Booking;
};

export function BookingCard({ booking }: BookingCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            {booking.package_title_snapshot}
          </h3>
          <p className="text-sm text-slate-600">
            Provider: {booking.provider_name_snapshot}
          </p>
          <p className="text-sm text-slate-600">
            Booking date: {formatDate(booking.booking_date)}
          </p>
          {booking.event_date_snapshot ? (
            <p className="text-sm text-slate-600">
              Event date: {formatDate(booking.event_date_snapshot)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 text-sm sm:text-right">
          <p className="font-medium text-slate-900">
            {formatCurrency(booking.total_price)}
          </p>
          <p className="text-slate-600">
            Booking status: <span className="font-medium">{booking.booking_status}</span>
          </p>
          <p className="text-slate-600">
            Payment status: <span className="font-medium">{booking.payment_status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}