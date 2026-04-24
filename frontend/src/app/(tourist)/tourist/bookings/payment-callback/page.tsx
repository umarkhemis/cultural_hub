
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/src/constants/routes";
import { apiClient } from "@/src/lib/api/client";
import { useToastStore } from "@/src/store/toast-store";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    const orderTrackingId = searchParams.get("orderTrackingId");
    const orderMerchantReference = searchParams.get("orderMerchantReference");

    if (!orderTrackingId || !orderMerchantReference) {
      router.push(ROUTES.touristBookings);
      return;
    }

    const verify = async () => {
      try {
        const response = await apiClient.get("/payments/callback/pesapal", {
          params: { orderTrackingId, orderMerchantReference },
        });

        const paymentStatus = response.data?.data?.payment_status;

        if (paymentStatus === "paid") {
          setStatus("success");
          addToast({ type: "success", title: "Payment successful!", description: "Your booking is confirmed." });
          setTimeout(() => router.push(ROUTES.bookingSuccess), 1500);
        } else {
          setStatus("failed");
          addToast({ type: "error", title: "Payment not completed", description: "Please try again." });
          setTimeout(() => router.push(ROUTES.touristBookings), 3000);
        }
      } catch {
        setStatus("failed");
        addToast({ type: "error", title: "Verification failed", description: "Please check your bookings." });
        setTimeout(() => router.push(ROUTES.touristBookings), 3000);
      }
    };

    verify();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        {status === "verifying" && (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-amber-400 mx-auto" />
            <p className="text-slate-600 text-sm">Verifying your payment...</p>
          </>
        )}
        {status === "success" && (
          <p className="text-emerald-600 font-semibold">Payment confirmed! Redirecting...</p>
        )}
        {status === "failed" && (
          <p className="text-red-600 font-semibold">Payment not completed. Redirecting...</p>
        )}
      </div>
    </div>
  );
}