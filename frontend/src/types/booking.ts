
export type BookingParticipant = {
  id: string;
  participant_name: string;
  participant_email?: string | null;
  participant_phone?: string | null;
  special_requests?: string | null;
};

export type Booking = {
  id: string;
  tourist_id: string;
  package_id: string;
  booking_status: string;
  payment_status: string;
  participants_count: number;
  total_price: number;
  booking_date: string;
  package_title_snapshot: string;
  provider_name_snapshot: string;
  event_date_snapshot?: string | null;
  participants: BookingParticipant[];
};