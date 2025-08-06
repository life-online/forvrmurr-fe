import { apiRequest } from './api';

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
  submitGiftRequest(formData: GiftRequestData): Promise<GiftRequestResponse> {
    return apiRequest<GiftRequestResponse>('/gifts/request', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      requiresAuth: false
    });
  }
};

export default giftingService;
