import { apiRequest } from './api';

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
  submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    return apiRequest<ContactResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      },
      requiresAuth: false
    });
  }
};

export default contactService;
