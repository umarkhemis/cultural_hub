
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
  paymentReference: string | null;

  setDraftBooking: (payload: {
    packageId: string;
    packageName: string;
    packagePrice: number;
    participants: BookingParticipantInput[];
  }) => void;

  setBookingResult: (payload: {
    bookingId: string;
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
  paymentReference: null,

  setDraftBooking: ({ packageId, packageName, packagePrice, participants }) =>
    set({
      packageId,
      packageName,
      packagePrice,
      participants,
    }),

  setBookingResult: ({ bookingId, paymentReference }) =>
    set({
      bookingId,
      paymentReference: paymentReference ?? null,
    }),

  clearBookingFlow: () =>
    set({
      packageId: null,
      packageName: null,
      packagePrice: null,
      participants: [],
      bookingId: null,
      paymentReference: null,
    }),
}));