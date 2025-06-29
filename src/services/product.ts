/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api";

// In-memory cache for API responses
interface ApiCache {
  concentrations?: {
    data: string[];
    timestamp: number;
    ttl: number; // Time-to-live in milliseconds
  };
}  

const apiCache: ApiCache = {};

export type ProductType = "prime" | "premium";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  brandId?: string;
  categoryId?: string;
  noteIds?: string[];
  type?: ProductType;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  search?: string;
  scentTypeSlugs?: string | undefined;
  occasionSlugs?: string | undefined;
  fragranceFamilySlugs?: string | undefined;
  moodSlugs?: string | undefined;
  
  // Additional filter parameters for shop filters
  minPrice?: string | number;
  maxPrice?: string | number;
  brandSlugs?: string[];   // Brand slugs for API filtering using semicolon delimiter
  brands?: string[];      // Legacy brand IDs (to be deprecated)
  noteSlugs?: string[];   // Note slugs for API filtering using semicolon delimiter
  notes?: string[];       // Legacy note IDs (to be deprecated)
  concentrations?: string[]; // Array of concentration values like ['eau_de_parfum', 'parfum']
  onSale?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string | object;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
}
export interface ProductAttribute {
  id: string;
  name: string;
  iconUrl: string;
}
export interface DescriptionResponse {
  attributes: ProductAttribute[];
}

export interface Note {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  nairaPrice: string;
  priceFullBottle: string | null;
  brand: Brand;
  categories: Category[];
  topNotes: Note[];
  middleNotes: Note[];
  baseNotes: Note[];
  type: "prime" | "premium";
  isBestSeller: boolean;
  isFeatured: boolean;
  imageUrls: string[];
  scentCharacteristics: any;
  inventoryQuantity: number;
  concentration: string | null;
  slug: string;
  fragranceStory: string | null;
  fragrance: any;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface Discount {
  id: string;
  title: string;
  summary: string;
  type: string;
  discountCode: string;
  minimumRequirementType: string;
  minimumSubtotalValue: string;
  minimumQuantityValue: string | null;
}

const productService = {
  /**
   * Get available product concentrations
   */
  async getConcentrations(): Promise<string[]> {
    // Check if we have cached data that's still valid
    const cachedData = apiCache.concentrations;
    const now = Date.now();
    
    if (cachedData && now - cachedData.timestamp < cachedData.ttl) {
      console.log('Using cached concentrations data:', cachedData.data);
      return cachedData.data;
    }
    
    console.log('Fetching concentrations from API endpoint /products/concentrations...');
    try {
      // Fetch from API if no valid cache exists
      const concentrations = await apiRequest<string[]>('/products/concentrations', {
        requiresAuth: false
      });
      
      console.log('API Response for concentrations:', concentrations);
      
      // Temporary fallback if API returns empty or invalid data
      if (!concentrations || !Array.isArray(concentrations) || concentrations.length === 0) {
        console.warn('API returned empty or invalid concentrations, using fallback data');
        const fallbackData = ['eau_de_parfum', 'eau_de_toilette', 'parfum', 'parfum_extrait'];
        
        // Cache the fallback data
        apiCache.concentrations = {
          data: fallbackData,
          timestamp: now,
          ttl: 60 * 60 * 1000 // 1 hour in milliseconds
        };
        
        return fallbackData;
      }
      
      // Cache the result with a 1-hour TTL
      apiCache.concentrations = {
        data: concentrations,
        timestamp: now,
        ttl: 60 * 60 * 1000 // 1 hour in milliseconds
      };
      
      return concentrations;
    } catch (error) {
      console.error('Error fetching concentrations:', error);
      // Return fallback data in case of error
      const fallbackData = ['eau_de_parfum', 'eau_de_toilette', 'parfum', 'parfum_extrait'];
      return fallbackData;
    }
  },
  /**
   * Get products with optional filters
   */
  async getProducts(
    filters: ProductFilterParams = {}
  ): Promise<ProductsResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.noteIds) params.noteIds = filters.noteIds.join(",");
    if (filters.type) params.type = filters.type;
    if (filters.isBestSeller !== undefined)
      params.isBestSeller = filters.isBestSeller;
    if (filters.isFeatured !== undefined)
      params.isFeatured = filters.isFeatured;
    if (filters.search) params.search = filters.search;
    if (filters.noteSlugs && filters.noteSlugs.length > 0) params.noteSlugs = filters.noteSlugs.join(";"); // Using semicolons as per API requirement
    if (filters.concentrations && filters.concentrations.length > 0) params.concentrations = filters.concentrations.join(";"); // Using semicolons as per API requirement

    return apiRequest<ProductsResponse>("/products", {
      params,
      requiresAuth: false,
    });
  },
  async getComprehensiveProducts(
    filters: ProductFilterParams = {}
  ): Promise<ProductsResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.noteIds) params.noteIds = filters.noteIds.join(",");
    if (filters.type) params.type = filters.type;
    if (filters.isBestSeller !== undefined)
      params.isBestSeller = filters.isBestSeller;
    if (filters.isFeatured !== undefined)
      params.isFeatured = filters.isFeatured;
    if (filters.search) params.search = filters.search;
    if (filters.scentTypeSlugs) params.scentTypeSlugs = filters.scentTypeSlugs;
    if (filters.occasionSlugs) params.occasionSlugs = filters.occasionSlugs;
    if (filters.fragranceFamilySlugs)
      params.fragranceFamilySlugs = filters.fragranceFamilySlugs;
    if (filters.moodSlugs) params.moodSlugs = filters.moodSlugs;
    
    // Additional filter parameters for the comprehensive endpoint
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.brandSlugs && filters.brandSlugs.length > 0) 
      params.brandSlugs = filters.brandSlugs.join(";"); // Using semicolons as per API requirement
    if (filters.noteSlugs && filters.noteSlugs.length > 0) 
      params.noteSlugs = filters.noteSlugs.join(";"); // Using semicolons as per API requirement
    if (filters.concentrations && filters.concentrations.length > 0) 
      params.concentrations = filters.concentrations.join(";"); // Using semicolons as per API requirement
    if (filters.onSale !== undefined) 
      params.onSale = filters.onSale;
    if (filters.sortBy)
      params.sortBy = filters.sortBy;
    if (filters.sortOrder)
      params.sortOrder = filters.sortOrder;

    return apiRequest<ProductsResponse>("/products/filter/comprehensive", {
      params,
      requiresAuth: false,
    });
  },
  async getBestSellingProducts(
    filters: ProductFilterParams = {}
  ): Promise<ProductsResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};

    if (filters.type) params.type = filters.type;

    return apiRequest<ProductsResponse>("/products/bestsellers", {
      params,
      requiresAuth: false,
    });
  },
  async getFeaturedProducts(
    filters: ProductFilterParams = {}
  ): Promise<ProductsResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};

    if (filters.type) params.type = filters.type;

    return apiRequest<ProductsResponse>("/products/featured", {
      params,
      requiresAuth: false,
    });
  },
  async getCurrentDiscount(): Promise<Discount[]> {
    return apiRequest<Discount[]>("/store/discounts/free-shipping-offers", {
      requiresAuth: false,
    });
  },

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return apiRequest<Product>(`/products/slug/${slug}`, {
      requiresAuth: false,
    });
  },
  async getProductDescriptionByOthers(
    id: string
  ): Promise<DescriptionResponse> {
    return apiRequest<DescriptionResponse>(
      `/products/${id}/descriptive-attributes`,
      {
        requiresAuth: false,
      }
    );
  },
  async getProductrelatedProductsById(
    id: string,
    filters: ProductFilterParams = {}
  ): Promise<Product[]> {
    const params: Record<string, string | number | boolean> = {};

    if (filters.limit) params.limit = filters.limit;
    return apiRequest<Product[]>(`/products/${id}/related`, {
      params,
      requiresAuth: false,
    });
  },

  /**
   * Get brands for filtering
   */
  async getBrands(): Promise<Brand[]> {
    console.log('Fetching brands from API endpoint /products/brands...');
    try {
      // The endpoint returns a paginated response with data wrapped in an object
      const response = await apiRequest<{ data: Brand[], total: number, page: number, limit: number }>('/products/brands', {
        requiresAuth: false
      });
      
      console.log('API Response for brands:', response);
      
      // Extract the brands array from the data property of the response
      const brands = response;
      
      // Return the brands if valid
      if (brands && Array.isArray(brands) && brands.length > 0) {
        return brands;
      }
      
      // Fallback if API returns empty or invalid data
      console.warn('API returned empty or invalid brands data, using fallback data');
      return [
        { 
          id: '1', 
          name: 'Chanel', 
          slug: 'chanel',
          description: 'Luxury French fashion house founded by Coco Chanel.'
        }, 
        { 
          id: '2', 
          name: 'Dior', 
          slug: 'dior',
          description: 'French luxury goods company controlled by LVMH.'
        }
      ];
    } catch (error) {
      console.error('Error fetching brands:', error);
      // Return fallback data in case of error
      return [
        { 
          id: '1', 
          name: 'Chanel', 
          slug: 'chanel',
          description: 'Luxury French fashion house founded by Coco Chanel.'
        }, 
        { 
          id: '2', 
          name: 'Dior', 
          slug: 'dior',
          description: 'French luxury goods company controlled by LVMH.'
        }
      ];
    }
  },

  /**
   * Get categories for filtering
   */
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>("/categories", {
      requiresAuth: false,
    });
  },

  /**
   * Get notes for filtering
   */
  async getNotes(): Promise<Note[]> {
    console.log('Fetching notes from API endpoint /fragrance-notes...');
    try {
      // This endpoint returns a direct array of Note objects
      const notes = await apiRequest<Note[]>('/fragrance-notes', {
        requiresAuth: false
      });
      
      console.log('API Response for notes:', notes);
      
      // Return the notes if valid
      if (notes && Array.isArray(notes) && notes.length > 0) {
        return notes;
      }
      
      // Fallback if API returns empty or invalid data
      console.warn('API returned empty or invalid notes data, using fallback data');
      return [
        { id: '1', name: 'Vanilla', slug: 'vanilla', description: 'Sweet, warm vanilla scent', iconUrl: '/images/notes/vanilla.png' },
        { id: '2', name: 'Rose', slug: 'rose', description: 'Classic floral rose scent', iconUrl: '/images/notes/rose.png' }
      ];
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Return fallback data in case of error
      return [
        { id: '1', name: 'Vanilla', slug: 'vanilla', description: 'Sweet, warm vanilla scent', iconUrl: '/images/notes/vanilla.png' },
        { id: '2', name: 'Rose', slug: 'rose', description: 'Classic floral rose scent', iconUrl: '/images/notes/rose.png' }
      ];
    }
  },
  /**
   * Get fragrance families with optional pagination
   */
  async getFragranceFamilies(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<any> {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    return apiRequest<any>("/products/fragrance-families", {
      params,
      requiresAuth: false,
    });
  },
  /**
   * Get product occasions with optional pagination and search
   */
  async getProductOccasions(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<any> {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    return apiRequest<any>("/products/occasions", {
      params,
      requiresAuth: false,
    });
  },
  /**
   * Get scent types with optional pagination and search
   */
  async getScentTypes(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<any> {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    return apiRequest<any>("/products/scent-types", {
      params,
      requiresAuth: false,
    });
  },
  /**
   * Get product moods with optional pagination and search
   */
  async getProductMoods(
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<any> {
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;

    return apiRequest<any>("/products/moods", {
      params,
      requiresAuth: false,
    });
  },
};

export default productService;
