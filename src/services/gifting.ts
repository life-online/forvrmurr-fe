import { apiRequest } from './api';
import posthog from 'posthog-js';

export interface GiftRequestData {
  fullName: string;
  email: string;
  phoneNumber: string;
  occasion: string;
  preferredDeliveryDate?: string;
  quantityNeeded?: number;
  budgetRangePerPiece?: string;
  preferredFragranceTiers?: string[];
  notes?: string;
}

export interface GiftRequestResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  occasion: string;
  preferredDeliveryDate?: string;
  quantityNeeded?: number;
  budgetRangePerPiece?: string;
  preferredFragranceTiers?: string[];
  notes?: string;
  status: string;
  createdAt: string;
}

const giftingService = {
  /**
   * Submit gift request form data
   */
  async submitGiftRequest(formData: GiftRequestData): Promise<GiftRequestResponse> {
    const response = await apiRequest<GiftRequestResponse>('/gifts/request', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      requiresAuth: false
    });

    // PostHog: Track gift request submission event
    posthog.capture('gift_request_submitted', {
      occasion: formData.occasion,
      quantity_needed: formData.quantityNeeded,
      budget_range: formData.budgetRangePerPiece,
      fragrance_tiers: formData.preferredFragranceTiers,
    });

    return response;
  }
};

export default giftingService;
