"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import productService, {
  Product,
  ProductFilterParams,
  ProductType,
} from "@/services/product";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/ui/ProductCard";
import FragranceSelector from "@/components/shop/FragranceFilter";
import FilterSortBar from "@/components/shop/FilterSortBar";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredChildren from "@/components/animations/StaggeredChildren";
import { trackViewItemList } from "@/utils/analytics";

type FilterTabValue = "all" | ProductType;

const filterTabs = [
  { label: "All", value: "all" as FilterTabValue },
  { label: "Prime", value: "prime" as FilterTabValue },
  { label: "Premium", value: "premium" as FilterTabValue },
];

export default function ShopContent() {
  // Add a ref to track initialization state
  const isInitialized = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = useRef(searchParams.toString());
  const { error: showError } = useToast();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const typeFromUrl = (searchParams.get("type") as FilterTabValue) || "all";
  const searchFromUrl = searchParams.get("search") || "";
  const scentTypeSlugs = searchParams.get("scentTypeSlugs") || "";
  const occasionSlugs = searchParams.get("occasionSlugs") || "";
  const fragranceFamilySlugs = searchParams.get("fragranceFamilySlugs") || "";
  const moodSlugs = searchParams.get("moodSlugs") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Added for consistent naming
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState<FilterTabValue>(typeFromUrl);

  // Filter drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | null;
  }>({
    "Scent Type": scentTypeSlugs || null,
    Occasion: occasionSlugs || null,
    "Fragrance Family": fragranceFamilySlugs || null,
    Mood: moodSlugs || null,
  });

  // Filter and Sort state
  const sortByFromUrl = searchParams.get("sortBy") || 'default';
  const sortOrderFromUrl = searchParams.get("sortOrder") || 'ASC';
  const minPriceFromUrl = searchParams.get("minPrice") || '';
  const maxPriceFromUrl = searchParams.get("maxPrice") || '';
  const bestSellerFromUrl = searchParams.get("bestSeller") === 'true';
  const onSaleFromUrl = searchParams.get("onSale") === 'true';
  const concentrationsFromUrl = searchParams.get("concentrations")?.split(',') || [];
  const brandsFromUrl = searchParams.get("brands")?.split(',') || [];
  const brandSlugsFromUrl = searchParams.get("brandSlugs")?.split(';') || [];
  const notesFromUrl = searchParams.get("notes")?.split(',') || [];
  const noteSlugsFromUrl = searchParams.get("noteSlugs")?.split(';') || [];
  
  const [currentSortBy, setCurrentSortBy] = useState(sortByFromUrl);
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrderFromUrl);
  const [shopFilters, setShopFilters] = useState({
    minPrice: minPriceFromUrl,
    maxPrice: maxPriceFromUrl,
    bestSeller: bestSellerFromUrl,
    concentrations: concentrationsFromUrl,
    brands: brandsFromUrl,
    brandSlugs: brandSlugsFromUrl,
    notes: notesFromUrl,
    noteSlugs: noteSlugsFromUrl,
    onSale: onSaleFromUrl
  });

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    // Validate to prevent unnecessary re-renders
    if (sortBy === currentSortBy && sortOrder === currentSortOrder) return;

    // Update the sort state
    setCurrentSortBy(sortBy);
    setCurrentSortOrder(sortOrder);

    // Update URL
    const params = new URLSearchParams(window.location.search);
    if (sortBy !== 'default') {
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });

    // Update filters with new sort
    setFilters({
      ...filters,
      sortBy: sortBy !== 'default' ? sortBy : undefined,
      sortOrder: sortBy !== 'default' ? sortOrder : undefined,
      page: 1 // Reset to first page on sort change
    });
  };

  const handleFiltersChange = (newFilters: any) => {
    setShopFilters(newFilters);
    
    // Update filters with comprehensive filter values
    const comprehensiveFilters = {
      ...filters,
      minPrice: newFilters.minPrice || undefined,
      maxPrice: newFilters.maxPrice || undefined,
      isBestSeller: newFilters.bestSeller || undefined,
      onSale: newFilters.onSale || undefined,
      concentrations: newFilters.concentrations?.length > 0 ? newFilters.concentrations : undefined,
      brandSlugs: newFilters.brandSlugs?.length > 0 ? newFilters.brandSlugs : undefined,
      noteSlugs: newFilters.noteSlugs?.length > 0 ? newFilters.noteSlugs : undefined,
      sortBy: currentSortBy !== 'default' ? currentSortBy : undefined,
      sortOrder: currentSortBy !== 'default' ? currentSortOrder : undefined,
      page: 1 // Reset to first page when filters change
    };
    
    setFilters(comprehensiveFilters);
    updateUrl(comprehensiveFilters);
  };

  const initialFilters: ProductFilterParams = {
    page: pageFromUrl,
    limit: 12,
    ...(typeFromUrl !== "all" && { type: typeFromUrl as ProductType }),
    ...(searchFromUrl && { search: searchFromUrl }),
    ...(scentTypeSlugs && { scentTypeSlugs }),
    ...(occasionSlugs && { occasionSlugs }),
    ...(fragranceFamilySlugs && { fragranceFamilySlugs }),
    ...(moodSlugs && { moodSlugs }),
    ...(sortByFromUrl !== 'default' && { sortBy: sortByFromUrl }),
    ...(sortByFromUrl !== 'default' && { sortOrder: sortOrderFromUrl }),
    ...(minPriceFromUrl && { minPrice: minPriceFromUrl }),
    ...(maxPriceFromUrl && { maxPrice: maxPriceFromUrl }),
    ...(bestSellerFromUrl && { isBestSeller: bestSellerFromUrl }),
    ...(onSaleFromUrl && { onSale: onSaleFromUrl }),
    ...(concentrationsFromUrl.length > 0 && { concentrations: concentrationsFromUrl }),
    ...(brandsFromUrl.length > 0 && { brands: brandsFromUrl }),
    ...(brandSlugsFromUrl.length > 0 && { brandSlugs: brandSlugsFromUrl }),
    ...(notesFromUrl.length > 0 && { notes: notesFromUrl }),
    ...(noteSlugsFromUrl.length > 0 && { noteSlugs: noteSlugsFromUrl }),
  };

  const [filters, setFilters] = useState<ProductFilterParams>(initialFilters);

  // Listen for URL searchParams changes and update filters
  useEffect(() => {
    const currentSearchString = searchParams.toString();
    
    // Prevent unnecessary updates and infinite loops
    if (currentSearchString === searchParamsString.current) {
      return;
    }
    
    // Update the previous search params reference
    searchParamsString.current = currentSearchString;
    
    // Only update filters if component is already initialized (not during initial render)
    if (isInitialized.current) {
      // Parse search parameters
      const newPageFromUrl = Number(searchParams.get("page")) || 1;
      const newTypeFromUrl = (searchParams.get("type") as FilterTabValue) || "all";
      const newSearchFromUrl = searchParams.get("search") || "";
      const newScentTypeSlugs = searchParams.get("scentTypeSlugs") || "";
      const newOccasionSlugs = searchParams.get("occasionSlugs") || "";
      const newFragranceFamilySlugs = searchParams.get("fragranceFamilySlugs") || "";
      const newMoodSlugs = searchParams.get("moodSlugs") || "";
      const newSortByFromUrl = searchParams.get("sortBy") || 'default';
      const newSortOrderFromUrl = searchParams.get("sortOrder") || 'ASC';
      const newMinPriceFromUrl = searchParams.get("minPrice") || '';
      const newMaxPriceFromUrl = searchParams.get("maxPrice") || '';
      const newBestSellerFromUrl = searchParams.get("bestSeller") === 'true';
      const newOnSaleFromUrl = searchParams.get("onSale") === 'true';
      const newConcentrationsFromUrl = searchParams.get("concentrations")?.split(',').filter(Boolean) || [];
      const newBrandSlugsFromUrl = searchParams.get("brandSlugs")?.split(';').filter(Boolean) || [];
      const newNoteSlugsFromUrl = searchParams.get("noteSlugs")?.split(';').filter(Boolean) || [];
      
      // Update state for UI controls
      setCurrentPage(newPageFromUrl);
      setActiveTab(newTypeFromUrl);
      setCurrentSortBy(newSortByFromUrl);
      setCurrentSortOrder(newSortOrderFromUrl);
      
      // Update filter state for FragranceSelector
      setSelectedFilters({
        "Scent Type": newScentTypeSlugs || null,
        Occasion: newOccasionSlugs || null,
        "Fragrance Family": newFragranceFamilySlugs || null,
        Mood: newMoodSlugs || null,
      });
      
      // Update shop filter state
      setShopFilters({
        minPrice: newMinPriceFromUrl,
        maxPrice: newMaxPriceFromUrl,
        bestSeller: newBestSellerFromUrl,
        onSale: newOnSaleFromUrl,
        concentrations: newConcentrationsFromUrl,
        brands: [], // We don't have brand names in URL, only slugs
        brandSlugs: newBrandSlugsFromUrl,
        notes: [], // We don't have note names in URL, only slugs
        noteSlugs: newNoteSlugsFromUrl,
      });
      
      // Create new filters object
      const newFilters: ProductFilterParams = {
        page: newPageFromUrl,
        limit: 12,
        ...(newTypeFromUrl !== "all" && { type: newTypeFromUrl as ProductType }),
        ...(newSearchFromUrl && { search: newSearchFromUrl }),
        ...(newScentTypeSlugs && { scentTypeSlugs: newScentTypeSlugs }),
        ...(newOccasionSlugs && { occasionSlugs: newOccasionSlugs }),
        ...(newFragranceFamilySlugs && { fragranceFamilySlugs: newFragranceFamilySlugs }),
        ...(newMoodSlugs && { moodSlugs: newMoodSlugs }),
        ...(newSortByFromUrl !== 'default' && { sortBy: newSortByFromUrl }),
        ...(newSortByFromUrl !== 'default' && { sortOrder: newSortOrderFromUrl }),
        ...(newMinPriceFromUrl && { minPrice: newMinPriceFromUrl }),
        ...(newMaxPriceFromUrl && { maxPrice: newMaxPriceFromUrl }),
        ...(newBestSellerFromUrl && { isBestSeller: newBestSellerFromUrl }),
        ...(newOnSaleFromUrl && { onSale: newOnSaleFromUrl }),
        ...(newConcentrationsFromUrl.length > 0 && { concentrations: newConcentrationsFromUrl }),
        ...(newBrandSlugsFromUrl.length > 0 && { brandSlugs: newBrandSlugsFromUrl }),
        ...(newNoteSlugsFromUrl.length > 0 && { noteSlugs: newNoteSlugsFromUrl }),
      };
      
      // Update filters which will trigger data fetching
      setFilters(newFilters);
    }
  }, [searchParams]);
  
  // Set initialization flag after first render
  useEffect(() => {
    isInitialized.current = true;
    
    // Store initial search params
    searchParamsString.current = searchParams.toString();
    
    return () => {
      isInitialized.current = false;
    };
  }, []);

  // Define fetchProducts as a useCallback function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const response = await productService.getComprehensiveProducts(filters);
      setProducts(response.data);
      setTotalProducts(response.meta.total);
      setCurrentPage(response.meta.page);
      setTotalPages(response.meta.totalPages);

      // Track view_item_list event for analytics
      if (response.data && response.data.length > 0) {
        trackViewItemList(response.data, 'Shop');
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      showError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [filters, showError]);
  
  // Effect to fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateUrl = (newFilters: ProductFilterParams) => {
    const params = new URLSearchParams();
    
    // Basic filters
    if (newFilters.page && newFilters.page > 1)
      params.set("page", newFilters.page.toString());
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.search) params.set("search", newFilters.search);
    
    // Scent filters from FragranceSelector
    if (newFilters.scentTypeSlugs) params.set("scentTypeSlugs", newFilters.scentTypeSlugs);
    if (newFilters.occasionSlugs) params.set("occasionSlugs", newFilters.occasionSlugs);
    if (newFilters.fragranceFamilySlugs) params.set("fragranceFamilySlugs", newFilters.fragranceFamilySlugs);
    if (newFilters.moodSlugs) params.set("moodSlugs", newFilters.moodSlugs);
    
    // Advanced filters from FilterDrawer
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    if (newFilters.sortOrder) params.set("sortOrder", newFilters.sortOrder);
    if (newFilters.minPrice) params.set("minPrice", String(newFilters.minPrice));
    if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
    if (newFilters.isBestSeller) params.set("bestSeller", String(newFilters.isBestSeller));
    if (newFilters.onSale) params.set("onSale", String(newFilters.onSale));
    
    // Array filters - convert to comma-separated strings
    if (newFilters.concentrations?.length) params.set("concentrations", newFilters.concentrations.join(','));
    if (newFilters.brands?.length) params.set("brands", newFilters.brands.join(','));
    if (newFilters.brandSlugs?.length) params.set("brandSlugs", newFilters.brandSlugs.join(';'));
    if (newFilters.noteSlugs?.length) params.set("noteSlugs", newFilters.noteSlugs.join(';'));
    if (newFilters.notes?.length) params.set("notes", newFilters.notes.join(','));
    
    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  const handleTabChange = (tabValue: FilterTabValue) => {
    setActiveTab(tabValue);

    const newFilters: ProductFilterParams = {
      ...filters,
      page: 1,
      type: tabValue === "all" ? undefined : (tabValue as ProductType),
    };
    delete newFilters.categoryId; // Reset category on tab change for simplicity, or manage complex state
    setFilters(newFilters);
    
    // Update URL parameters to reflect the tab change
    updateUrl(newFilters);
  };

  // Handle URL fragrance filter parameter changes
  useEffect(() => {
    // Only run this effect when URL parameters actually change
    if (
      !isInitialized.current && // Only run before initialization
      (scentTypeSlugs || occasionSlugs || fragranceFamilySlugs || moodSlugs)
    ) {
      // Update selected filters state without triggering other state updates
      setSelectedFilters({
        "Scent Type": scentTypeSlugs || null,
        Occasion: occasionSlugs || null,
        "Fragrance Family": fragranceFamilySlugs || null,
        Mood: moodSlugs || null,
      });
    }
  }, [scentTypeSlugs, occasionSlugs, fragranceFamilySlugs, moodSlugs, isLoading]);
  
  // Single effect to handle all URL parameter changes and initialize state
  useEffect(() => {
    // Only run once on initial load or when URL params actually change
    if (!isInitialized.current) {
      // First time initialization
      setShopFilters({
        minPrice: minPriceFromUrl,
        maxPrice: maxPriceFromUrl,
        bestSeller: bestSellerFromUrl,
        concentrations: concentrationsFromUrl,
        brands: brandsFromUrl,
        brandSlugs: brandSlugsFromUrl,
        notes: notesFromUrl,
        noteSlugs: noteSlugsFromUrl,
        onSale: onSaleFromUrl
      });
      
      // Update sort when URL param changes
      if (sortByFromUrl !== currentSortBy) {
        setCurrentSortBy(sortByFromUrl);
      }
      if (sortOrderFromUrl !== currentSortOrder) {
        setCurrentSortOrder(sortOrderFromUrl);
      }
      
      // Build comprehensive filters from URL parameters
      const initialFilters: ProductFilterParams = {
        page: 1,
        type: activeTab === "all" ? undefined : (activeTab as ProductType),
        scentTypeSlugs: (scentTypeSlugs as string) || undefined,
        occasionSlugs: (occasionSlugs as string) || undefined,
        fragranceFamilySlugs: (fragranceFamilySlugs as string) || undefined,
        moodSlugs: (moodSlugs as string) || undefined,
        sortBy: sortByFromUrl !== 'default' ? sortByFromUrl : undefined,
        sortOrder: sortByFromUrl !== 'default' ? sortOrderFromUrl : undefined,
        minPrice: minPriceFromUrl || undefined,
        maxPrice: maxPriceFromUrl || undefined,
        isBestSeller: bestSellerFromUrl || undefined,
        onSale: onSaleFromUrl || undefined,
        concentrations: concentrationsFromUrl.length > 0 ? concentrationsFromUrl : undefined,
        brandSlugs: brandsFromUrl.length > 0 ? brandsFromUrl : undefined,
        noteSlugs: notesFromUrl.length > 0 ? notesFromUrl : undefined
      };
      
      // Set filters without triggering another URL update
      setFilters(initialFilters);
      isInitialized.current = true;
    }
  }, [
    // Include all URL parameters and required state
    minPriceFromUrl, maxPriceFromUrl, bestSellerFromUrl, onSaleFromUrl,
    concentrationsFromUrl, brandsFromUrl, notesFromUrl, sortByFromUrl, sortOrderFromUrl,
    scentTypeSlugs, occasionSlugs, fragranceFamilySlugs, moodSlugs,
    activeTab, currentSortBy, currentSortOrder
  ]);

  // Update search params function for filters
  const updateSearchParams = (updatedFilters: {
    [key: string]: string | null;
  }) => {
    const params = new URLSearchParams(window.location.search);
    
    // Update URL parameters
    if (updatedFilters["Scent Type"]) {
      params.set("scentTypeSlugs", updatedFilters["Scent Type"]!);
    } else {
      params.delete("scentTypeSlugs");
    }

    if (updatedFilters["Fragrance Family"]) {
      params.set("fragranceFamilySlugs", updatedFilters["Fragrance Family"]!);
    } else {
      params.delete("fragranceFamilySlugs");
    }

    if (updatedFilters["Mood"]) {
      params.set("moodSlugs", updatedFilters["Mood"]!);
    } else {
      params.delete("moodSlugs");
    }

    if (updatedFilters["Occasion"]) {
      params.set("occasionSlugs", updatedFilters["Occasion"]!);
    } else {
      params.delete("occasionSlugs");
    }

    // Preserve other params like type
    if (activeTab !== "all") {
      params.set("type", activeTab);
    }
    params.set("page", "1"); // Reset to first page when filtering
    
    // Update the URL
    const newUrl = `/shop?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // IMPORTANT: Also update the main filters state to trigger API call
    const newFilters: ProductFilterParams = {
      ...filters,
      page: 1,
      scentTypeSlugs: updatedFilters["Scent Type"] || undefined,
      occasionSlugs: updatedFilters["Occasion"] || undefined,
      fragranceFamilySlugs: updatedFilters["Fragrance Family"] || undefined,
      moodSlugs: updatedFilters["Mood"] || undefined
    };
    
    // Update filters state which will trigger API call through useEffect
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = {
      ...filters,
      page,
    };
    setFilters(newFilters);
    updateUrl(newFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Clear all filters function for the empty state
  const clearAllFilters = () => {
    const resetFilters: ProductFilterParams = {
      page: 1,
      limit: 12,
      type: activeTab === 'all' ? undefined : (activeTab as ProductType)
    };
    
    setFilters(resetFilters);
    setShopFilters({
      minPrice: '',
      maxPrice: '',
      bestSeller: false,
      concentrations: [],
      brands: [],
      brandSlugs: [],
      notes: [],
      noteSlugs: [],
      onSale: false
    });
    
    updateUrl(resetFilters);
  };

  // TODO: Implement actual search input logic and sort by functionality

  return (
    <>
      {/* Breadcrumb and Title */}
      <AnimatedSection delay={0.1} direction="up">
        <div className="max-w-7xl mx-auto w-full px-4 pt-6 md:pt-8">
          <h1 className="text-xl md:text-2xl font-serif font-medium mb-3 md:mb-4 text-black">
            MEET YOUR NEXT OBSESSION
          </h1>
        </div>
      </AnimatedSection>

      {/* Tabs - Scrollable on mobile */}
      <AnimatedSection delay={0.2} direction="up">
        <div className="max-w-7xl mx-auto w-full px-4 mb-3 md:mb-4">
          <div
            data-cur="cursor"
            className="flex overflow-x-auto pb-1 scrollbar-hide gap-2 -mx-1 px-1"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                className={`px-3 md:px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.value
                    ? "bg-[#faf0e2] border-[#e6c789] text-[#600000]"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </AnimatedSection>
      {/* Mobile-optimized filters and sorting layout */}
      <AnimatedSection delay={0.3} direction="up">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:gap-x-4 mb-3 md:mb-4">
            {/* Fragrance Selector */}
            <div className="w-full sm:w-auto">
              <FragranceSelector
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                updateSearchParams={updateSearchParams}
                filteredProductCount={totalProducts}
                isLoading={loading}
              />
            </div>

            {/* Filter and Sort Bar */}
            <div className="w-full">
              <FilterSortBar
                totalProducts={totalProducts}
                currentSortBy={currentSortBy}
                currentSortOrder={currentSortOrder}
                onSortChange={handleSortChange}
                filters={shopFilters}
                onFiltersChange={handleFiltersChange}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 min-h-[70vh]">
          <p>Loading products...</p>
          {/* Consider adding a spinner */}
        </div>
      )}

      {/* Product Grid */}
      {!loading && products?.length > 0 && (
        <StaggeredChildren staggerDelay={0.05} childDelay={0.1}>
          <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 mb-12">
            {products?.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priorityLoading={index < 4}
              />
            ))}
          </div>
        </StaggeredChildren>
      )}

      {/* No Products Found */}
      {!loading && products?.length === 0 && (
        <AnimatedSection delay={0.2} direction="up">
          <div className="text-center py-16 min-h-[70vh] flex flex-col items-center justify-center max-w-md mx-auto px-4">
            <div className="mb-6 relative">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#a0001e] flex items-center justify-center text-white text-xs font-bold">0</div>
            </div>
            <h3 className="text-xl font-serif mb-2">Oh no, your scent hunt came up empty!</h3>
            <p className="text-gray-600 mb-6">Even our finest perfumers couldn't blend a fragrance to match those particular filters. Perhaps try a different combination?</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 border border-[#a0001e] text-[#a0001e] hover:bg-[#a0001e] hover:text-white transition-colors rounded-full text-sm font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6"/>
              </svg>
              Clear all filters
            </button>
          </div>
        </AnimatedSection>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-12 mt-4 sm:mt-12 pt-2 overflow-x-auto">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`transition-all duration-200 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <FiChevronLeft size={16} className="sm:text-lg" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {/* Different rendering logic based on total number of pages */}
            {totalPages <= 5 ? (
              // Simple case: 5 or fewer total pages - just show all page numbers
              Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    currentPage === i + 1
                      ? 'bg-[#a0001e] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              // Complex case: More than 5 pages - show pagination with ellipses
              <>
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm flex-shrink-0">...</span>
                    )}
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: 5 }, (_, i) => {
                  let pageNum;
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                        currentPage === pageNum
                          ? 'bg-[#a0001e] text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm flex-shrink-0">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`transition-all duration-200 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight size={16} className="sm:text-lg" />
          </button>
        </div>
      )}
      {/* <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} /> */}
    </>
  );
}
