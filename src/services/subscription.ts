import { api } from "./api";

/**
 * Subscription interest data for waitlist
 */
export interface SubscriptionInterest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  preferredTier: 'prime' | 'premium' | 'undecided';
}

/**
 * Response from subscription interest submission
 */
export interface SubscriptionInterestResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    createdAt: string;
  };
}

/**
 * Subscription service for managing subscription-related operations
 */
export const subscriptionService = {
  /**
   * Submit interest for subscription waitlist
   */
  async submitInterest(data: SubscriptionInterest): Promise<SubscriptionInterestResponse> {
    return api.post<SubscriptionInterestResponse>('/subscriptions/interest', {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      preferredTier: data.preferredTier,
    }, {
      requiresAuth: false,
    });
  },
};
