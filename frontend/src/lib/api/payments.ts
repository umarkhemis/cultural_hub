
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";

export type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_gateway: string;
  payment_status: string;
  transaction_reference: string;
  gateway_transaction_id?: string | null;
  phone_number?: string | null;
  payment_url?: string | null;  // Flutterwave redirect URL
  gateway_response?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
};

type InitializePaymentPayload = {
  booking_id: string;
  payment_gateway: "mock" | "mtn_momo" | "flutterwave";
  currency?: string;
  phone_number?: string;      // required for MoMo
  redirect_url?: string;      // optional for Flutterwave
};

type MockWebhookPayload = {
  transaction_reference: string;
  payment_status: "completed" | "failed";
  gateway_response?: string;
};

type MoMoStatusPayload = {
  transaction_reference: string;
};

export async function initializePayment(payload: InitializePaymentPayload) {
  const response = await apiClient.post<ApiSuccessResponse<Payment>>(
    "/payments/initialize",
    payload
  );
  return response.data;
}

export async function checkMoMoStatus(payload: MoMoStatusPayload) {
  const response = await apiClient.post<ApiSuccessResponse<Payment>>(
    "/payments/momo/status",
    payload
  );
  return response.data;
}

export async function processMockPaymentWebhook(payload: MockWebhookPayload) {
  const response = await apiClient.post<ApiSuccessResponse<Payment>>(
    "/payments/webhook/mock",
    payload
  );
  return response.data;
}

export async function getPaymentDetail(paymentId: string) {
  const response = await apiClient.get<ApiSuccessResponse<Payment>>(
    `/payments/${paymentId}`
  );
  return response.data;
}










































// import { apiClient } from "./client";
// import type { ApiSuccessResponse } from "@/src/types/api";

// export type Payment = {
//   id: string;
//   booking_id: string;
//   amount: number;
//   currency: string;
//   payment_gateway: string;
//   payment_status: string;
//   transaction_reference: string;
//   gateway_response?: string | null;
//   created_at: string;
//   updated_at: string;
// };

// type InitializePaymentPayload = {
//   booking_id: string;
//   payment_gateway: string;
//   currency: string;
// };

// type MockWebhookPayload = {
//   transaction_reference: string;
//   payment_status: "completed" | "failed";
//   gateway_response?: string;
// };

// export async function initializePayment(payload: InitializePaymentPayload) {
//   const response = await apiClient.post<ApiSuccessResponse<Payment>>(
//     "/payments/initialize",
//     payload
//   );
//   return response.data;
// }

// export async function processMockPaymentWebhook(payload: MockWebhookPayload) {
//   const response = await apiClient.post<ApiSuccessResponse<Payment>>(
//     "/payments/webhook/mock",
//     payload
//   );
//   return response.data;
// }

// export async function getPaymentDetail(paymentId: string) {
//   const response = await apiClient.get<ApiSuccessResponse<Payment>>(
//     `/payments/${paymentId}`
//   );
//   return response.data;
// }