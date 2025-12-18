import { apiRequest } from './api';
import posthog from 'posthog-js';

export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

const contactService = {
  /**
   * Submit contact form data
   */
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    const response = await apiRequest<ContactResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      requiresAuth: false
    });

    // PostHog: Track contact form submission event
    posthog.capture('contact_form_submitted', {
      subject: formData.subject,
      email: formData.email,
    });

    return response;
  }
};

export default contactService;
