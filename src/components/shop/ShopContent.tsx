"use client";
import React, { useState, useEffect } from "react";
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

type FilterTabValue = "all" | ProductType;

const filterTabs = [
  { label: "All", value: "all" as FilterTabValue },
  { label: "Prime", value: "prime" as FilterTabValue },
  { label: "Premium", value: "premium" as FilterTabValue },
];

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [currentSort, setCurrentSort] = useState('default');
  const [shopFilters, setShopFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bestSeller: false,
    concentrations: [],
    brands: [],
    notes: [],
    onSale: false,
  });

  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    // TODO: Implement actual sorting logic
    console.log('Sort changed to:', sort);
  };

  const handleFiltersChange = (newFilters: any) => {
    setShopFilters(newFilters);
    // TODO: Implement actual filtering logic
    console.log('Filters changed:', newFilters);
  };

  const initialFilters: ProductFilterParams = {
    page: pageFromUrl,
    limit: 12,
    ...(typeFromUrl !== "all" && { type: typeFromUrl as ProductType }),
    ...(searchFromUrl && { search: searchFromUrl }),
  };

  const [filters, setFilters] = useState<ProductFilterParams>(initialFilters);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getComprehensiveProducts(filters);
        setProducts(response.data);
        setTotalProducts(response.meta.total);
        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
        showError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, showError]);

  const updateUrl = (newFilters: ProductFilterParams) => {
    const params = new URLSearchParams();
    if (newFilters.page && newFilters.page > 1)
      params.set("page", newFilters.page.toString());
    if (newFilters.type) params.set("type", newFilters.type);
    if (newFilters.search) params.set("search", newFilters.search);

    // Add other filters like sortBy, categoryId if they should be in URL

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
    updateUrl(newFilters);
  };

  useEffect(() => {
    const newFilters: ProductFilterParams = {
      ...filters,
      page: 1,
      type: activeTab === "all" ? undefined : (activeTab as ProductType),
      scentTypeSlugs: (scentTypeSlugs as string) || undefined,
      occasionSlugs: (occasionSlugs as string) || undefined,
      fragranceFamilySlugs: (fragranceFamilySlugs as string) || undefined,
      moodSlugs: (moodSlugs as string) || undefined,
    };
    setFilters(newFilters);

    // Update selected filters state
    setSelectedFilters({
      "Scent Type": scentTypeSlugs || null,
      Occasion: occasionSlugs || null,
      "Fragrance Family": fragranceFamilySlugs || null,
      Mood: moodSlugs || null,
    });
  }, [scentTypeSlugs, occasionSlugs, fragranceFamilySlugs, moodSlugs]);

  // Update search params function for filters
  const updateSearchParams = (updatedFilters: {
    [key: string]: string | null;
  }) => {
    const params = new URLSearchParams(window.location.search);

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

    // Preserve other params like page, type
    if (activeTab !== "all") {
      params.set("type", activeTab);
    }
    params.set("page", "1"); // Reset to first page when filtering

    const newUrl = `/shop?${params.toString()}`;
    router.push(newUrl, { scroll: false });
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

  // TODO: Implement actual search input logic and sort by functionality

  return (
    <>
      {/* Breadcrumb and Title */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-8">
        <h1 className=" sm:text-xl md:text-2xl font-serif font-medium mb-4 text-black">
          MEET YOUR NEXT OBSESSION
        </h1>
      </div>

      {/* Tabs */}
      <div
        data-cur="cursor"
        className="max-w-7xl mx-auto w-full px-4 flex gap-2 mb-4"
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
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
      <FragranceSelector
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        updateSearchParams={updateSearchParams}
        filteredProductCount={totalProducts}
        isLoading={loading}
      />
      
      {/* Filter and Sort Bar */}
      <FilterSortBar
        totalProducts={totalProducts}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        filters={shopFilters}
        onFiltersChange={handleFiltersChange}
      />
      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 min-h-[70vh]">
          <p>Loading products...</p>
          {/* Consider adding a spinner */}
        </div>
      )}

      {/* Product Grid */}
      {!loading && products?.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 mb-12">
          {products?.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priorityLoading={index < 4}
            />
          ))}
        </div>
      )}

      {/* No Products Found */}
      {!loading && products?.length === 0 && (
        <div className="text-center py-10 min-h-[70vh]">
          <p>No products found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-center items-center gap-6 mb-32 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`transition-all duration-200 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <FiChevronLeft size={18} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {/* Show first page if not in range */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  1
                </button>
                {currentPage > 4 && (
                  <span className="text-gray-400 px-2">...</span>
                )}
              </>
            )}

            {/* Show page numbers around current page */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
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
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-[#a0001e] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Show last page if not in range */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="text-gray-400 px-2">...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`transition-all duration-200 flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
      {/* <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} /> */}
    </>
  );
}
