import { apiRequest } from "./api";

export interface Country {
  id: string;
  code: string;
  name: string;
  phoneCode: string;
  flagEmoji: string;
  isRestOfWorld: boolean;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxConfiguration {
  id: string;
  countryId: string;
  country: Country;
  provinceCode: string | null;
  zip: string | null;
  title: string;
  rate: string;
  isActive: boolean;
  shopifyCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
}

const taxService = {
  // Get tax configuration for a country
  getTaxConfigurationByCountry: async (countryCode: string): Promise<TaxConfiguration[]> => {
    return apiRequest<TaxConfiguration[]>(`/tax/configurations/country/${countryCode}`, {
      requiresAuth: false,
    });
  },

  // Calculate tax amount based on subtotal and tax rate
  calculateTaxAmount: (subtotal: number, taxRate: string): number => {
    return subtotal * parseFloat(taxRate);
  }
};

export default taxService;
