
"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/constants/routes";
import { useBookingStore } from "@/src/store/booking-store";

export default function BookingSuccessPage() {
  const { packageName, clearBookingFlow } = useBookingStore();

  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
        ✓
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
        Booking Confirmed
      </h1>

      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
        Your booking{packageName ? ` for ${packageName}` : ""} has been created and
        payment was completed successfully.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={ROUTES.touristBookings} onClick={clearBookingFlow}>
          <Button>View My Bookings</Button>
        </Link>

        <Link href={ROUTES.feed} onClick={clearBookingFlow}>
          <Button variant="secondary">Back to Feed</Button>
        </Link>
      </div>
    </div>
  );
}