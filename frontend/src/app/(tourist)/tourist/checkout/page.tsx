
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Smartphone, CreditCard, TestTube, Loader2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ROUTES } from "@/src/constants/routes";
import {
  useInitializePaymentMutation,
  useCheckMoMoStatusMutation,
  useMockPaymentWebhookMutation,
} from "@/src/features/bookings/payment-hooks";
import { useTouristBookings } from "@/src/features/bookings/hooks";
import { useBookingStore } from "@/src/store/booking-store";
import { useToastStore } from "@/src/store/toast-store";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

type PaymentMethod = "mtn_momo" | "pesapal" | "mock";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdFromQuery = searchParams.get("bookingId");
  const { addToast } = useToastStore();

  const {
    bookingId, bookingReference, packageName,
    packagePrice, participants, reservedUntil, setBookingResult,
  } = useBookingStore();

  const { data: bookings = [] } = useTouristBookings();
  const initializePaymentMutation = useInitializePaymentMutation();
  const checkMoMoMutation = useCheckMoMoStatusMutation();
  const mockWebhookMutation = useMockPaymentWebhookMutation();

  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pesapal");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [momoPolling, setMomoPolling] = useState(false);
  const [currentTxRef, setCurrentTxRef] = useState<string | null>(null);

  const activeBooking =
    bookings.find((b) => b.id === bookingIdFromQuery) ||
    bookings.find((b) => b.id === bookingId) ||
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
  const effectiveParticipantsCount = activeBooking?.participants_count || participants.length;
  const effectiveAmount = activeBooking?.total_price || ((packagePrice || 0) * (participants.length || 1));

  const now = useMemo(() => new Date(), []);
  const reservationExpired = useMemo(() => {
    if (!effectiveReservedUntil) return false;
    return new Date(effectiveReservedUntil).getTime() < now.getTime();
  }, [effectiveReservedUntil, now]);

  // Poll MoMo status every 5 seconds
  useEffect(() => {
    if (!momoPolling || !currentTxRef) return;
    const interval = setInterval(async () => {
      try {
        const result = await checkMoMoMutation.mutateAsync({
          transaction_reference: currentTxRef,
        });
        const payStatus = result.data.payment_status;
        if (payStatus === "paid") {
          setMomoPolling(false);
          addToast({ type: "success", title: "Payment successful!" });
          router.push(ROUTES.bookingSuccess);
        } else if (payStatus === "failed") {
          setMomoPolling(false);
          setError("MoMo payment failed. Please try again.");
        }
      } catch {
        setMomoPolling(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [momoPolling, currentTxRef]);

  if (!effectiveBookingId || !effectivePackageName || !effectiveAmount) {
    return (
      <EmptyState
        title="No active checkout"
        description="Start from a package detail page to create a booking."
      />
    );
  }

  const isBusy = initializePaymentMutation.isPending || mockWebhookMutation.isPending || momoPolling;

  const handlePay = async () => {
    setError("");

    if (reservationExpired) {
      setError("Reservation expired. Please create a new booking.");
      return;
    }

    try {
      if (paymentMethod === "mtn_momo") {
        if (!phoneNumber.trim()) {
          setError("Please enter your MTN MoMo phone number.");
          return;
        }
        const result = await initializePaymentMutation.mutateAsync({
          booking_id: effectiveBookingId!,
          payment_gateway: "mtn_momo",
          currency: "EUR", // sandbox only accepts EUR
          phone_number: phoneNumber.trim(),
        });
        setCurrentTxRef(result.data.transaction_reference);
        setMomoPolling(true);
        addToast({
          type: "success",
          title: "Check your phone",
          description: "A MoMo prompt has been sent. Approve it to confirm.",
        });

      } else if (paymentMethod === "pesapal") {
        const result = await initializePaymentMutation.mutateAsync({
          booking_id: effectiveBookingId!,
          payment_gateway: "pesapal",
          currency: "UGX",
          phone_number: phoneNumber.trim() || undefined,
          redirect_url: `${window.location.origin}/bookings/payment-callback`,
        });
        // Redirect to Pesapal hosted payment page
        if (result.data.payment_url) {
          window.location.href = result.data.payment_url;
        } else {
          setError("Could not get payment URL. Please try again.");
        }

      } else {
        // Mock flow
        const paymentResponse = await initializePaymentMutation.mutateAsync({
          booking_id: effectiveBookingId!,
          payment_gateway: "mock",
          currency: "UGX",
        });
        await mockWebhookMutation.mutateAsync({
          transaction_reference: paymentResponse.data.transaction_reference,
          payment_status: "completed",
          gateway_response: "Mock approved",
        });
        addToast({ type: "success", title: "Payment successful!" });
        router.push(ROUTES.bookingSuccess);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Payment could not be processed.";
      setError(message);
      addToast({ type: "error", title: "Payment error", description: message });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Complete payment before the reservation expires.
        </p>
      </div>

      {/* Booking summary */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <p className="text-sm text-slate-500">Package</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{effectivePackageName}</h2>
        </div>
        {effectiveBookingReference && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Booking reference</span>
            <span className="font-medium text-slate-900">{effectiveBookingReference}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Participants</span>
          <span className="font-medium text-slate-900">{effectiveParticipantsCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Total amount</span>
          <span className="font-semibold text-slate-900">{formatCurrency(effectiveAmount)}</span>
        </div>
        {effectiveReservedUntil && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Reservation expires</span>
            <span className={`font-medium ${reservationExpired ? "text-red-600" : "text-slate-900"}`}>
              {formatDate(effectiveReservedUntil)}
            </span>
          </div>
        )}
      </div>

      {/* Payment method selector */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <p className="text-sm font-semibold text-slate-700">Select Payment Method</p>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Pesapal — card + MoMo */}
          <button
            onClick={() => setPaymentMethod("pesapal")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
              paymentMethod === "pesapal"
                ? "border-blue-400 bg-blue-50 text-blue-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <CreditCard className="h-6 w-6" />
            <span>Card / MoMo</span>
            <span className="text-[10px] text-slate-400">via Pesapal</span>
          </button>

          {/* MTN MoMo direct */}
          <button
            onClick={() => setPaymentMethod("mtn_momo")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
              paymentMethod === "mtn_momo"
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <Smartphone className="h-6 w-6" />
            <span>MTN MoMo</span>
            <span className="text-[10px] text-slate-400">direct prompt</span>
          </button>

          {/* Mock / Test */}
          <button
            onClick={() => setPaymentMethod("mock")}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
              paymentMethod === "mock"
                ? "border-slate-400 bg-slate-50 text-slate-700"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <TestTube className="h-6 w-6" />
            <span>Test Mode</span>
            <span className="text-[10px] text-slate-400">dev only</span>
          </button>
        </div>

        {/* Phone input */}
        {(paymentMethod === "mtn_momo" || paymentMethod === "pesapal") && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {paymentMethod === "mtn_momo"
                ? "MTN MoMo Phone Number *"
                : "Phone Number (optional for Pesapal)"}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0771234567"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20"
            />
          </div>
        )}

        {/* MoMo polling status */}
        {momoPolling && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            Waiting for MoMo approval on your phone...
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className={`rounded-[28px] border p-5 text-sm ${
        reservationExpired
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}>
        {reservationExpired
          ? "Reservation expired. Please create a new booking."
          : paymentMethod === "mtn_momo"
          ? "You will receive a prompt on your MTN phone to approve the payment."
          : paymentMethod === "pesapal"
          ? "You will be redirected to Pesapal's secure page to pay via card or mobile money."
          : "This is test mode — no real money is charged."}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        onClick={handlePay}
        disabled={isBusy || reservationExpired}
        className="w-full"
      >
        {isBusy ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {momoPolling ? "Waiting for approval..." : "Processing..."}
          </span>
        ) : paymentMethod === "mtn_momo" ? (
          "Pay with MTN MoMo"
        ) : paymentMethod === "pesapal" ? (
          "Pay with Pesapal"
        ) : (
          "Pay (Test Mode)"
        )}
      </Button>
    </div>
  );
}













































// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Smartphone, CreditCard, TestTube, Loader2 } from "lucide-react";

// import { Button } from "@/src/components/ui/button";
// import { EmptyState } from "@/src/components/shared/empty-state";
// import { ROUTES } from "@/src/constants/routes";
// import {
//   useInitializePaymentMutation,
//   useCheckMoMoStatusMutation,
//   useMockPaymentWebhookMutation,
// } from "@/src/features/bookings/payment-hooks";
// import { useTouristBookings } from "@/src/features/bookings/hooks";
// import { useBookingStore } from "@/src/store/booking-store";
// import { useToastStore } from "@/src/store/toast-store";
// import { formatCurrency } from "@/src/utils/formatCurrency";
// import { formatDate } from "@/src/utils/formatDate";

// type PaymentMethod = "mtn_momo" | "flutterwave" | "mock";

// export default function CheckoutPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const bookingIdFromQuery = searchParams.get("bookingId");
//   const { addToast } = useToastStore();

//   const {
//     bookingId, bookingReference, packageName,
//     packagePrice, participants, reservedUntil, setBookingResult,
//   } = useBookingStore();

//   const { data: bookings = [] } = useTouristBookings();
//   const initializePaymentMutation = useInitializePaymentMutation();
//   const checkMoMoMutation = useCheckMoMoStatusMutation();
//   const mockWebhookMutation = useMockPaymentWebhookMutation();

//   const [error, setError] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mtn_momo");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [momoPolling, setMomoPolling] = useState(false);
//   const [currentTxRef, setCurrentTxRef] = useState<string | null>(null);

//   const activeBooking =
//     bookings.find((b) => b.id === bookingIdFromQuery) ||
//     bookings.find((b) => b.id === bookingId) ||
//     null;

//   useEffect(() => {
//     if (activeBooking) {
//       setBookingResult({
//         bookingId: activeBooking.id,
//         bookingReference: activeBooking.booking_reference,
//         reservedUntil: activeBooking.reserved_until,
//       });
//     }
//   }, [activeBooking, setBookingResult]);

//   const effectiveBookingId = activeBooking?.id || bookingId;
//   const effectiveBookingReference = activeBooking?.booking_reference || bookingReference;
//   const effectivePackageName = activeBooking?.package_title_snapshot || packageName;
//   const effectiveReservedUntil = activeBooking?.reserved_until || reservedUntil;
//   const effectiveParticipantsCount = activeBooking?.participants_count || participants.length;
//   const effectiveAmount = activeBooking?.total_price || ((packagePrice || 0) * (participants.length || 1));

//   const now = useMemo(() => new Date(), []);
//   const reservationExpired = useMemo(() => {
//     if (!effectiveReservedUntil) return false;
//     return new Date(effectiveReservedUntil).getTime() < now.getTime();
//   }, [effectiveReservedUntil, now]);

//   // Poll MoMo status every 5 seconds
//   useEffect(() => {
//     if (!momoPolling || !currentTxRef) return;
//     const interval = setInterval(async () => {
//       try {
//         const result = await checkMoMoMutation.mutateAsync({ transaction_reference: currentTxRef });
//         const status = result.data.payment_status;
//         if (status === "paid") {
//           setMomoPolling(false);
//           addToast({ type: "success", title: "Payment successful!", description: "Your booking is confirmed." });
//           router.push(ROUTES.bookingSuccess);
//         } else if (status === "failed") {
//           setMomoPolling(false);
//           setError("MoMo payment failed. Please try again.");
//           addToast({ type: "error", title: "Payment failed", description: "Please retry." });
//         }
//       } catch {
//         setMomoPolling(false);
//       }
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [momoPolling, currentTxRef]);

//   if (!effectiveBookingId || !effectivePackageName || !effectiveAmount) {
//     return (
//       <EmptyState
//         title="No active checkout"
//         description="Start from a package detail page to create a booking."
//       />
//     );
//   }

//   const isBusy = initializePaymentMutation.isPending || mockWebhookMutation.isPending || momoPolling;

//   const handlePay = async () => {
//     setError("");
//     if (reservationExpired) {
//       setError("Reservation expired. Please create a new booking.");
//       return;
//     }

//     try {
//       if (paymentMethod === "mtn_momo") {
//         if (!phoneNumber.trim()) {
//           setError("Please enter your MTN MoMo phone number.");
//           return;
//         }
//         // const result = await initializePaymentMutation.mutateAsync({
//         //   booking_id: effectiveBookingId!,
//         //   payment_gateway: "mtn_momo",
//         //   currency: "UGX",
//         //   phone_number: phoneNumber.trim(),
//         // });
        
//         const result = await initializePaymentMutation.mutateAsync({
//           booking_id: effectiveBookingId!,
//           payment_gateway: "mtn_momo",
//           currency: "EUR",  // MTN sandbox only accepts EUR
//           phone_number: phoneNumber.trim(),
//         });



//         setCurrentTxRef(result.data.transaction_reference);
//         setMomoPolling(true);
//         addToast({
//           type: "success",
//           title: "Check your phone",
//           description: "A MoMo prompt has been sent. Approve it to confirm.",
//         });

//       } else if (paymentMethod === "flutterwave") {
//         const result = await initializePaymentMutation.mutateAsync({
//           booking_id: effectiveBookingId!,
//           payment_gateway: "flutterwave",
//           currency: "UGX",
//           phone_number: phoneNumber.trim() || undefined,
//           redirect_url: `${window.location.origin}/bookings/payment-callback`,
//         });
//         // Redirect to Flutterwave hosted page
//         if (result.data.payment_url) {
//           window.location.href = result.data.payment_url;
//         }

//       } else {
//         // Mock flow
//         const paymentResponse = await initializePaymentMutation.mutateAsync({
//           booking_id: effectiveBookingId!,
//           payment_gateway: "mock",
//           currency: "UGX",
//         });
//         await mockWebhookMutation.mutateAsync({
//           transaction_reference: paymentResponse.data.transaction_reference,
//           payment_status: "completed",
//           gateway_response: "Mock approved",
//         });
//         addToast({ type: "success", title: "Payment successful!" });
//         router.push(ROUTES.bookingSuccess);
//       }
//     } catch (err: unknown) {
//       const message =
//         (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
//         "Payment could not be processed.";
//       setError(message);
//       addToast({ type: "error", title: "Payment error", description: message });
//     }
//   };

//   return (
//     <div className="mx-auto max-w-3xl space-y-6">
//       <div>
//         <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Checkout</h1>
//         <p className="mt-2 text-sm text-slate-600">Complete payment before the reservation expires.</p>
//       </div>

//       {/* Booking summary */}
//       <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
//         <div>
//           <p className="text-sm text-slate-500">Package</p>
//           <h2 className="mt-1 text-xl font-semibold text-slate-900">{effectivePackageName}</h2>
//         </div>
//         {effectiveBookingReference && (
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-600">Booking reference</span>
//             <span className="font-medium text-slate-900">{effectiveBookingReference}</span>
//           </div>
//         )}
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-slate-600">Participants</span>
//           <span className="font-medium text-slate-900">{effectiveParticipantsCount}</span>
//         </div>
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-slate-600">Total amount</span>
//           <span className="font-semibold text-slate-900">{formatCurrency(effectiveAmount)}</span>
//         </div>
//         {effectiveReservedUntil && (
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-slate-600">Reservation expires</span>
//             <span className={`font-medium ${reservationExpired ? "text-red-600" : "text-slate-900"}`}>
//               {formatDate(effectiveReservedUntil)}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Payment method selector */}
//       <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
//         <p className="text-sm font-semibold text-slate-700">Select Payment Method</p>

//         <div className="grid gap-3 sm:grid-cols-3">
//           {/* MTN MoMo */}
//           <button
//             onClick={() => setPaymentMethod("mtn_momo")}
//             className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
//               paymentMethod === "mtn_momo"
//                 ? "border-amber-400 bg-amber-50 text-amber-700"
//                 : "border-slate-200 text-slate-600 hover:border-slate-300"
//             }`}
//           >
//             <Smartphone className="h-6 w-6" />
//             MTN MoMo
//           </button>

//           {/* Card / Flutterwave */}
//           <button
//             onClick={() => setPaymentMethod("flutterwave")}
//             className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
//               paymentMethod === "flutterwave"
//                 ? "border-blue-400 bg-blue-50 text-blue-700"
//                 : "border-slate-200 text-slate-600 hover:border-slate-300"
//             }`}
//           >
//             <CreditCard className="h-6 w-6" />
//             Card / Mobile
//           </button>

//           {/* Mock (dev only) */}
//           <button
//             onClick={() => setPaymentMethod("mock")}
//             className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
//               paymentMethod === "mock"
//                 ? "border-slate-400 bg-slate-50 text-slate-700"
//                 : "border-slate-200 text-slate-600 hover:border-slate-300"
//             }`}
//           >
//             <TestTube className="h-6 w-6" />
//             Test / Mock
//           </button>
//         </div>

//         {/* Phone input for MoMo or Flutterwave MoMo option */}
//         {(paymentMethod === "mtn_momo" || paymentMethod === "flutterwave") && (
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1">
//               {paymentMethod === "mtn_momo" ? "MTN MoMo Phone Number *" : "Phone Number (optional)"}
//             </label>
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="e.g. 0771234567"
//               className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20"
//             />
//           </div>
//         )}

//         {/* MoMo polling status */}
//         {momoPolling && (
//           <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//             <Loader2 className="h-4 w-4 animate-spin shrink-0" />
//             Waiting for MoMo approval on your phone...
//           </div>
//         )}
//       </div>

//       {/* Reservation warning */}
//       <div className={`rounded-[28px] border p-5 text-sm ${
//         reservationExpired
//           ? "border-red-200 bg-red-50 text-red-700"
//           : "border-amber-200 bg-amber-50 text-amber-800"
//       }`}>
//         {reservationExpired
//           ? "Reservation expired. Please create a new booking."
//           : paymentMethod === "mtn_momo"
//           ? "You will receive a prompt on your phone to approve the payment."
//           : paymentMethod === "flutterwave"
//           ? "You will be redirected to a secure payment page to complete payment."
//           : "This is a mock/test payment for development purposes."}
//       </div>

//       {error && (
//         <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <Button
//         onClick={handlePay}
//         disabled={isBusy || reservationExpired}
//         className="w-full"
//       >
//         {isBusy ? (
//           <span className="flex items-center gap-2">
//             <Loader2 className="h-4 w-4 animate-spin" />
//             {momoPolling ? "Waiting for approval..." : "Processing..."}
//           </span>
//         ) : paymentMethod === "mtn_momo" ? (
//           "Pay with MTN MoMo"
//         ) : paymentMethod === "flutterwave" ? (
//           "Pay with Card / Mobile"
//         ) : (
//           "Pay (Test Mode)"
//         )}
//       </Button>
//     </div>
//   );
// }











































// // "use client";

// // import { useEffect, useMemo, useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";

// // import { Button } from "@/src/components/ui/button";
// // import { EmptyState } from "@/src/components/shared/empty-state";
// // import { ROUTES } from "@/src/constants/routes";
// // import {
// //   useInitializePaymentMutation,
// //   useMockPaymentWebhookMutation,
// // } from "@/src/features/bookings/payment-hooks";
// // import { useTouristBookings } from "@/src/features/bookings/hooks";
// // import { useBookingStore } from "@/src/store/booking-store";
// // import { useToastStore } from "@/src/store/toast-store";
// // import { formatCurrency } from "@/src/utils/formatCurrency";
// // import { formatDate } from "@/src/utils/formatDate";

// // export default function CheckoutPage() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const bookingIdFromQuery = searchParams.get("bookingId");
// //   const { addToast } = useToastStore();

// //   const {
// //     bookingId,
// //     bookingReference,
// //     packageName,
// //     packagePrice,
// //     participants,
// //     reservedUntil,
// //     setBookingResult,
// //   } = useBookingStore();

// //   const { data: bookings = [] } = useTouristBookings();

// //   const initializePaymentMutation = useInitializePaymentMutation();
// //   const mockWebhookMutation = useMockPaymentWebhookMutation();

// //   const [error, setError] = useState("");

// //   const activeBooking =
// //     bookings.find((item) => item.id === bookingIdFromQuery) ||
// //     bookings.find((item) => item.id === bookingId) ||
// //     null;

// //   useEffect(() => {
// //     if (activeBooking) {
// //       setBookingResult({
// //         bookingId: activeBooking.id,
// //         bookingReference: activeBooking.booking_reference,
// //         reservedUntil: activeBooking.reserved_until,
// //       });
// //     }
// //   }, [activeBooking, setBookingResult]);

// //   const effectiveBookingId = activeBooking?.id || bookingId;
// //   const effectiveBookingReference = activeBooking?.booking_reference || bookingReference;
// //   const effectivePackageName = activeBooking?.package_title_snapshot || packageName;
// //   const effectiveReservedUntil = activeBooking?.reserved_until || reservedUntil;
// //   const effectiveParticipantsCount =
// //     activeBooking?.participants_count || participants.length;
// //   const effectiveAmount =
// //     activeBooking?.total_price ||
// //     ((packagePrice || 0) * (participants.length || 1));

// //   const now = useMemo(() => new Date(), []);
// //   const reservationExpired = useMemo(() => {
// //     if (!effectiveReservedUntil) return false;
// //     return new Date(effectiveReservedUntil).getTime() < now.getTime();
// //   }, [effectiveReservedUntil, now]);

// //   if (!effectiveBookingId || !effectivePackageName || !effectiveAmount) {
// //     return (
// //       <EmptyState
// //         title="No active checkout"
// //         description="Start from a package detail page to create a booking and continue to payment."
// //       />
// //     );
// //   }

// //   const isBusy =
// //     initializePaymentMutation.isPending || mockWebhookMutation.isPending;

// //   const handleMockPayment = async (status: "completed" | "failed") => {
// //     setError("");

// //     if (reservationExpired) {
// //       setError("This booking reservation has expired. Please create a new booking.");
// //       return;
// //     }

// //     try {
// //       const paymentResponse = await initializePaymentMutation.mutateAsync({
// //         booking_id: effectiveBookingId,
// //         payment_gateway: "mock",
// //         currency: "UGX",
// //       });

// //       const transactionReference = paymentResponse.data.transaction_reference;

// //       setBookingResult({
// //         bookingId: effectiveBookingId,
// //         bookingReference: effectiveBookingReference,
// //         reservedUntil: effectiveReservedUntil,
// //         paymentReference: transactionReference,
// //       });

// //       await mockWebhookMutation.mutateAsync({
// //         transaction_reference: transactionReference,
// //         payment_status: status,
// //         gateway_response:
// //           status === "completed"
// //             ? "Mock gateway payment approved"
// //             : "Mock gateway payment failed",
// //       });

// //       if (status === "completed") {
// //         addToast({
// //           type: "success",
// //           title: "Payment successful",
// //           description: "Your booking has been confirmed successfully.",
// //         });
// //         router.push(ROUTES.bookingSuccess);
// //       } else {
// //         addToast({
// //           type: "error",
// //           title: "Payment failed",
// //           description:
// //             "Your payment attempt failed. You can retry before the reservation expires.",
// //         });
// //       }
// //     } catch (err: unknown) {
// //       const message =
// //         (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
// //         "We could not process this payment right now.";

// //       setError(message);
// //       addToast({
// //         type: "error",
// //         title: "Payment error",
// //         description: message,
// //       });
// //     }
// //   };

// //   return (
// //     <div className="mx-auto max-w-3xl space-y-6">
// //       <div>
// //         <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
// //           Checkout
// //         </h1>
// //         <p className="mt-2 text-sm leading-6 text-slate-600">
// //           Your booking has been created and is awaiting payment confirmation.
// //           Complete payment before the reservation expires.
// //         </p>
// //       </div>

// //       <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
// //         <div className="space-y-4">
// //           <div>
// //             <p className="text-sm text-slate-500">Package</p>
// //             <h2 className="mt-1 text-xl font-semibold text-slate-900">
// //               {effectivePackageName}
// //             </h2>
// //           </div>

// //           {effectiveBookingReference ? (
// //             <div className="flex items-center justify-between text-sm">
// //               <span className="text-slate-600">Booking reference</span>
// //               <span className="font-medium text-slate-900">
// //                 {effectiveBookingReference}
// //               </span>
// //             </div>
// //           ) : null}

// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-slate-600">Participants</span>
// //             <span className="font-medium text-slate-900">
// //               {effectiveParticipantsCount}
// //             </span>
// //           </div>

// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-slate-600">Total amount</span>
// //             <span className="font-semibold text-slate-900">
// //               {formatCurrency(effectiveAmount)}
// //             </span>
// //           </div>

// //           {effectiveReservedUntil ? (
// //             <div className="flex items-center justify-between text-sm">
// //               <span className="text-slate-600">Reservation expires</span>
// //               <span
// //                 className={`font-medium ${
// //                   reservationExpired ? "text-red-600" : "text-slate-900"
// //                 }`}
// //               >
// //                 {formatDate(effectiveReservedUntil)}
// //               </span>
// //             </div>
// //           ) : null}
// //         </div>
// //       </div>

// //       <div
// //         className={`rounded-[28px] border p-5 text-sm ${
// //           reservationExpired
// //             ? "border-red-200 bg-red-50 text-red-700"
// //             : "border-amber-200 bg-amber-50 text-amber-800"
// //         }`}
// //       >
// //         {reservationExpired
// //           ? "This booking reservation has expired. Please return to the package page and create a new booking."
// //           : "This is currently using a mock payment flow for MVP integration. It follows a realistic payment lifecycle and can later be connected to a live payment gateway."}
// //       </div>

// //       {error ? (
// //         <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// //           {error}
// //         </div>
// //       ) : null}

// //       <div className="grid gap-3 sm:grid-cols-2">
// //         <Button
// //           onClick={() => handleMockPayment("completed")}
// //           disabled={isBusy || reservationExpired}
// //         >
// //           {isBusy ? "Processing..." : "Pay Successfully (Mock)"}
// //         </Button>

// //         <Button
// //           variant="secondary"
// //           onClick={() => handleMockPayment("failed")}
// //           disabled={isBusy || reservationExpired}
// //         >
// //           {isBusy ? "Processing..." : "Simulate Payment Failure"}
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

