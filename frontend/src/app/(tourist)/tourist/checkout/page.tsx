
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ROUTES } from "@/src/constants/routes";
import {
  useInitializePaymentMutation,
  useMockPaymentWebhookMutation,
} from "@/src/features/bookings/payment-hooks";
import { useTouristBookings } from "@/src/features/bookings/hooks";
import { useBookingStore } from "@/src/store/booking-store";
import { useToastStore } from "@/src/store/toast-store";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdFromQuery = searchParams.get("bookingId");
  const { addToast } = useToastStore();

  const {
    bookingId,
    bookingReference,
    packageName,
    packagePrice,
    participants,
    reservedUntil,
    setBookingResult,
  } = useBookingStore();

  const { data: bookings = [] } = useTouristBookings();

  const initializePaymentMutation = useInitializePaymentMutation();
  const mockWebhookMutation = useMockPaymentWebhookMutation();

  const [error, setError] = useState("");

  const activeBooking =
    bookings.find((item) => item.id === bookingIdFromQuery) ||
    bookings.find((item) => item.id === bookingId) ||
    null;

  useEffect(() => {
    if (activeBooking) {
      setBookingResult({
        bookingId: activeBooking.id,
        bookingReference: activeBooking.booking_reference,
        reservedUntil: activeBooking.reserved_until,
      });
    }
  }, [activeBooking, setBookingResult]);

  const effectiveBookingId = activeBooking?.id || bookingId;
  const effectiveBookingReference = activeBooking?.booking_reference || bookingReference;
  const effectivePackageName = activeBooking?.package_title_snapshot || packageName;
  const effectiveReservedUntil = activeBooking?.reserved_until || reservedUntil;
  const effectiveParticipantsCount =
    activeBooking?.participants_count || participants.length;
  const effectiveAmount =
    activeBooking?.total_price ||
    ((packagePrice || 0) * (participants.length || 1));

  const reservationExpired = useMemo(() => {
    if (!effectiveReservedUntil) return false;
    return new Date(effectiveReservedUntil).getTime() < Date.now();
  }, [effectiveReservedUntil]);

  if (!effectiveBookingId || !effectivePackageName || !effectiveAmount) {
    return (
      <EmptyState
        title="No active checkout"
        description="Start from a package detail page to create a booking and continue to payment."
      />
    );
  }

  const isBusy =
    initializePaymentMutation.isPending || mockWebhookMutation.isPending;

  const handleMockPayment = async (status: "completed" | "failed") => {
    setError("");

    if (reservationExpired) {
      setError("This booking reservation has expired. Please create a new booking.");
      return;
    }

    try {
      const paymentResponse = await initializePaymentMutation.mutateAsync({
        booking_id: effectiveBookingId,
        payment_gateway: "mock",
        currency: "UGX",
      });

      const transactionReference = paymentResponse.data.transaction_reference;

      setBookingResult({
        bookingId: effectiveBookingId,
        bookingReference: effectiveBookingReference,
        reservedUntil: effectiveReservedUntil,
        paymentReference: transactionReference,
      });

      await mockWebhookMutation.mutateAsync({
        transaction_reference: transactionReference,
        payment_status: status,
        gateway_response:
          status === "completed"
            ? "Mock gateway payment approved"
            : "Mock gateway payment failed",
      });

      if (status === "completed") {
        addToast({
          type: "success",
          title: "Payment successful",
          description: "Your booking has been confirmed successfully.",
        });
        router.push(ROUTES.bookingSuccess);
      } else {
        addToast({
          type: "error",
          title: "Payment failed",
          description:
            "Your payment attempt failed. You can retry before the reservation expires.",
        });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "We could not process this payment right now.";

      setError(message);
      addToast({
        type: "error",
        title: "Payment error",
        description: message,
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your booking has been created and is awaiting payment confirmation.
          Complete payment before the reservation expires.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Package</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {effectivePackageName}
            </h2>
          </div>

          {effectiveBookingReference ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Booking reference</span>
              <span className="font-medium text-slate-900">
                {effectiveBookingReference}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Participants</span>
            <span className="font-medium text-slate-900">
              {effectiveParticipantsCount}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Amount</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(effectiveAmount)}
            </span>
          </div>

          {effectiveReservedUntil ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Reservation expires</span>
              <span
                className={`font-medium ${
                  reservationExpired ? "text-red-600" : "text-slate-900"
                }`}
              >
                {formatDate(effectiveReservedUntil)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`rounded-[28px] border p-5 text-sm ${
          reservationExpired
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        {reservationExpired
          ? "This booking reservation has expired. Please return to the package page and create a new booking."
          : "This is currently using a mock payment flow for MVP integration. It follows a realistic payment lifecycle and can later be connected to a live payment gateway."}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          onClick={() => handleMockPayment("completed")}
          disabled={isBusy || reservationExpired}
        >
          {isBusy ? "Processing..." : "Pay Successfully (Mock)"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleMockPayment("failed")}
          disabled={isBusy || reservationExpired}
        >
          {isBusy ? "Processing..." : "Simulate Payment Failure"}
        </Button>
      </div>
    </div>
  );
}