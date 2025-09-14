import { apiRequest } from "./api";

export interface PaymentVerificationResponse {
  reference: string;
  status: string;
  amount: number;
  paidAt: string;
  gatewayResponse: string;
  channel: string;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
  };
}

export const paymentsService = {
  verifyPayment: async (reference: string): Promise<PaymentVerificationResponse> => {
    return apiRequest<PaymentVerificationResponse>(`/payments/verify?reference=${encodeURIComponent(reference)}`, {
      method: "GET",
      requiresAuth: true,
    });
  },
};
