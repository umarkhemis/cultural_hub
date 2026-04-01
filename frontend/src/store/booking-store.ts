
"use client";

import { create } from "zustand";

type BookingParticipantInput = {
  participant_name: string;
  participant_email?: string;
  participant_phone?: string;
  special_requests?: string;
};

type PendingBookingState = {
  packageId: string | null;
  packageName: string | null;
  packagePrice: number | null;
  participants: BookingParticipantInput[];
  bookingId: string | null;
  bookingReference: string | null;
  reservedUntil: string | null;
  paymentReference: string | null;

  setDraftBooking: (payload: {
    packageId: string;
    packageName: string;
    packagePrice: number;
    participants: BookingParticipantInput[];
  }) => void;

  setBookingResult: (payload: {
    bookingId: string;
    bookingReference?: string | null;
    reservedUntil?: string | null;
    paymentReference?: string | null;
  }) => void;

  clearBookingFlow: () => void;
};

export const useBookingStore = create<PendingBookingState>((set) => ({
  packageId: null,
  packageName: null,
  packagePrice: null,
  participants: [],
  bookingId: null,
  bookingReference: null,
  reservedUntil: null,
  paymentReference: null,

  setDraftBooking: ({ packageId, packageName, packagePrice, participants }) =>
    set({
      packageId,
      packageName,
      packagePrice,
      participants,
    }),

  setBookingResult: ({
    bookingId,
    bookingReference,
    reservedUntil,
    paymentReference,
  }) =>
    set({
      bookingId,
      bookingReference: bookingReference ?? null,
      reservedUntil: reservedUntil ?? null,
      paymentReference: paymentReference ?? null,
    }),

  clearBookingFlow: () =>
    set({
      packageId: null,
      packageName: null,
      packagePrice: null,
      participants: [],
      bookingId: null,
      bookingReference: null,
      reservedUntil: null,
      paymentReference: null,
    }),
}));