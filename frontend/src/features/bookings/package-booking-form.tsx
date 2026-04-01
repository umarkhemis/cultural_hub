
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import {
  User, Mail, Phone, MessageSquare,
  ArrowRight, ShieldCheck, Tag,
} from "lucide-react";

import { FormField } from "@/src/components/ui/form-field";
import { Textarea } from "@/src/components/ui/textarea";
import { ROUTES } from "@/src/constants/routes";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";
import { useAuth } from "@/src/hooks/useAuth";
import { useCreateBookingMutation } from "./hooks";
import { useBookingStore } from "@/src/store/booking-store";
import { formatCurrency } from "@/src/utils/formatCurrency";

type PackageBookingFormProps = {
  packageId: string;
  packageName: string;
  packagePrice: number;
};

export function PackageBookingForm({
  packageId,
  packageName,
  packagePrice,
}: PackageBookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { runProtectedAction } = useProtectedAction();
  const createBookingMutation = useCreateBookingMutation();
  const { setDraftBooking, setBookingResult } = useBookingStore();

  const [participantName, setParticipantName] = useState(user?.full_name || "");
  const [participantEmail, setParticipantEmail] = useState(user?.email || "");
  const [participantPhone, setParticipantPhone] = useState(user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    runProtectedAction(async () => {
      setError("");

      if (user?.role !== "tourist") {
        setError("Only tourists can book packages.");
        return;
      }

      if (!participantName.trim()) {
        setError("Participant name is required.");
        return;
      }

      const participants = [{
        participant_name: participantName.trim(),
        participant_email: participantEmail.trim() || undefined,
        participant_phone: participantPhone.trim() || undefined,
        special_requests: specialRequests.trim() || undefined,
      }];

      try {
        setDraftBooking({ packageId, packageName, packagePrice, participants });

          const bookingResponse = await createBookingMutation.mutateAsync({
            package_id: packageId,
            participants,
          });

          setBookingResult({
            bookingId: bookingResponse.data.id,
            bookingReference: bookingResponse.data.booking_reference,
            reservedUntil: bookingResponse.data.reserved_until,
          });

        setBookingResult({ bookingId: bookingResponse.data.id });
        router.push(ROUTES.bookingCheckout);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "We could not create your booking. Please try again.");
        } else {
          setError("We could not create your booking. Please try again.");
        }
      }
    }, "Login as a tourist to book this package.");
  };

  const inputClass = "w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20";

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
        <h2 className="text-base font-bold text-slate-900">Book this Package</h2>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your details to continue to payment.
        </p>
      </div>

      <div className="p-6 space-y-5">

        {/* Package summary */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200">
              <Tag className="h-4 w-4 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">Selected Package</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{packageName}</p>
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 text-sm font-bold text-white">
            {formatCurrency(packagePrice)}
          </span>
        </div>

        {/* Participant name */}
        <FormField label="Full Name" htmlFor="participant_name">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="participant_name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter full name"
              className={inputClass}
            />
          </div>
        </FormField>

        {/* Email */}
        <FormField label="Email Address" htmlFor="participant_email">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="participant_email"
              type="email"
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </FormField>

        {/* Phone */}
        <FormField label="Phone Number" htmlFor="participant_phone">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              id="participant_phone"
              value={participantPhone}
              onChange={(e) => setParticipantPhone(e.target.value)}
              placeholder="0700000000"
              className={inputClass}
            />
          </div>
        </FormField>

        {/* Special requests */}
        <FormField label="Special Requests" htmlFor="special_requests" hint="Optional">
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <Textarea
              id="special_requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Dietary needs, accessibility requests, or other notes..."
              className="pl-10"
            />
          </div>
        </FormField>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          Your information is encrypted and securely processed.
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createBookingMutation.isPending}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createBookingMutation.isPending ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating booking...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

