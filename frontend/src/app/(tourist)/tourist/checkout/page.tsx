
"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/shared/empty-state";
import { useInitializePaymentMutation, useMockPaymentWebhookMutation } from "@/src/features/bookings/payment-hooks";
import { useBookingStore } from "@/src/store/booking-store";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { ROUTES } from "@/src/constants/routes";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    bookingId,
    packageName,
    packagePrice,
    participants,
    setBookingResult,
  } = useBookingStore();

  const initializePaymentMutation = useInitializePaymentMutation();
  const mockWebhookMutation = useMockPaymentWebhookMutation();

  if (!bookingId || !packageName || !packagePrice) {
    return (
      <EmptyState
        title="No active checkout"
        description="Start from a package detail page to create a booking and continue to payment."
      />
    );
  }

  const handleMockPayment = async (status: "completed" | "failed") => {
    const paymentResponse = await initializePaymentMutation.mutateAsync({
      booking_id: bookingId,
      payment_gateway: "mock",
      currency: "UGX",
    });

    const transactionReference = paymentResponse.data.transaction_reference;

    setBookingResult({
      bookingId,
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
      router.push(ROUTES.bookingSuccess);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review your booking and continue with payment.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Package</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{packageName}</h2>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Participants</span>
            <span className="font-medium text-slate-900">{participants.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Amount</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(packagePrice * participants.length)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        This is currently using a mock payment flow for MVP integration. It will later
        be replaced with a real payment gateway such as Flutterwave or Paystack.
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          onClick={() => handleMockPayment("completed")}
          disabled={initializePaymentMutation.isPending || mockWebhookMutation.isPending}
        >
          {initializePaymentMutation.isPending || mockWebhookMutation.isPending
            ? "Processing..."
            : "Pay Successfully (Mock)"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleMockPayment("failed")}
          disabled={initializePaymentMutation.isPending || mockWebhookMutation.isPending}
        >
          {initializePaymentMutation.isPending || mockWebhookMutation.isPending
            ? "Processing..."
            : "Simulate Payment Failure"}
        </Button>
      </div>
    </div>
  );
}