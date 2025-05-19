import { apiRequest } from './api';

export type ProductType = 'prime' | 'premium';

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
}

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  name: string;
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
  type: 'prime' | 'premium';
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

const productService = {
  /**
   * Get products with optional filters
   */
  async getProducts(filters: ProductFilterParams = {}): Promise<ProductsResponse> {
    // Convert ProductFilterParams to Record<string, string | number | boolean>
    const params: Record<string, string | number | boolean> = {};
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.brandId) params.brandId = filters.brandId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.noteIds) params.noteIds = filters.noteIds.join(',');
    if (filters.type) params.type = filters.type;
    if (filters.isBestSeller !== undefined) params.isBestSeller = filters.isBestSeller;
    if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured;
    if (filters.search) params.search = filters.search;
    
    return apiRequest<ProductsResponse>('/products', {
      params,
      requiresAuth: false
    });
  },

  /**
   * Get a single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    return apiRequest<Product>(`/products/${slug}`, {
      requiresAuth: false
    });
  },

  /**
   * Get brands for filtering
   */
  async getBrands(): Promise<Brand[]> {
    return apiRequest<Brand[]>('/brands', {
      requiresAuth: false
    });
  },

  /**
   * Get categories for filtering
   */
  async getCategories(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories', {
      requiresAuth: false
    });
  },

  /**
   * Get notes for filtering
   */
  async getNotes(): Promise<Note[]> {
    return apiRequest<Note[]>('/notes', {
      requiresAuth: false
    });
  }
};

export default productService;
