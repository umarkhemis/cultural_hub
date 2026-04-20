
export type BookingParticipant = {
  id: string;
  participant_name: string;
  participant_email?: string | null;
  participant_phone?: string | null;
  special_requests?: string | null;
};

export type Booking = {
  id: string;
  booking_reference: string;
  tourist_id: string;
  package_id: string;
  booking_status: string;
  payment_status: string;
  participants_count: number;
  base_price: number;
  platform_fee: number;
  total_price: number;
  provider_payout_amount: number;
  currency: string;
  booking_date: string;
  created_at: string;        
  updated_at?: string | null;
  reserved_until?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  booking_notes?: string | null;
  package_title_snapshot: string;
  provider_name_snapshot: string;
  event_date_snapshot?: string | null;
  participants: BookingParticipant[];
};


