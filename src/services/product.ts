/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api";

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
}

export interface Brand {
  id: string;
  name: string;
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
    return apiRequest<Brand[]>("/brands", {
      requiresAuth: false,
    });
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
    return apiRequest<Note[]>("/notes", {
      requiresAuth: false,
    });
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
