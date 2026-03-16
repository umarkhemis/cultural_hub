
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
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
    runProtectedAction(
      async () => {
        setError("");

        if (user?.role !== "tourist") {
          setError("Only tourists can book packages.");
          return;
        }

        if (!participantName.trim()) {
          setError("Participant name is required.");
          return;
        }

        const participants = [
          {
            participant_name: participantName.trim(),
            participant_email: participantEmail.trim() || undefined,
            participant_phone: participantPhone.trim() || undefined,
            special_requests: specialRequests.trim() || undefined,
          },
        ];

        try {
          setDraftBooking({
            packageId,
            packageName,
            packagePrice,
            participants,
          });

          const bookingResponse = await createBookingMutation.mutateAsync({
            package_id: packageId,
            participants,
          });

          setBookingResult({
            bookingId: bookingResponse.data.id,
          });

          router.push(ROUTES.bookingCheckout);
        } catch {
          setError("We could not create your booking. Please try again.");
        }
      },
      "Login as a tourist to book this package."
    );
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Book this package</h2>
        <p className="text-sm text-slate-600">
          Complete your participant details to continue to payment.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Selected package</p>
            <p className="mt-1 font-semibold text-slate-900">{packageName}</p>
          </div>

          <p className="text-sm font-semibold text-slate-900">
            {formatCurrency(packagePrice)}
          </p>
        </div>
      </div>

      <FormField label="Participant Name" htmlFor="participant_name">
        <Input
          id="participant_name"
          value={participantName}
          onChange={(e) => setParticipantName(e.target.value)}
          placeholder="Enter full name"
        />
      </FormField>

      <FormField label="Participant Email" htmlFor="participant_email">
        <Input
          id="participant_email"
          type="email"
          value={participantEmail}
          onChange={(e) => setParticipantEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </FormField>

      <FormField label="Participant Phone" htmlFor="participant_phone">
        <Input
          id="participant_phone"
          value={participantPhone}
          onChange={(e) => setParticipantPhone(e.target.value)}
          placeholder="0700000000"
        />
      </FormField>

      <FormField label="Special Requests" htmlFor="special_requests" hint="Optional">
        <Textarea
          id="special_requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Dietary needs, accessibility request, or other note"
        />
      </FormField>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={createBookingMutation.isPending}>
          {createBookingMutation.isPending ? "Creating booking..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}