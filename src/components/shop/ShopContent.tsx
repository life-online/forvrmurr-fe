"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import productService, {
  Product,
  ProductFilterParams,
  ProductType,
} from "@/services/product";
import { useToast } from "@/context/ToastContext";
import ProductCard from "@/components/ui/ProductCard";
import FragranceSelector from "@/components/shop/FragranceFilter";

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
  // const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState<FilterTabValue>(typeFromUrl);

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

        // setTotalProducts(response.meta.total);
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
    // updateUrl(newFilters);
  }, [scentTypeSlugs, occasionSlugs, fragranceFamilySlugs, moodSlugs]);

  // const handleSearch = (searchTerm: string) => {
  //   setSearch(searchTerm);
  //   const newFilters = {
  //     ...filters,
  //     search: searchTerm || undefined,
  //     page: 1,
  //   };
  //   setFilters(newFilters);
  //   updateUrl(newFilters);
  // };

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
        {/* <div className="text-xs mb-2">
          <span className="mr-2">New Release</span>
          <span className="mr-2">›</span>
          <span>Shop All</span>
        </div> */}
        <h1 className=" sm:text-xl md:text-2xl font-serif font-medium mb-4 text-black">
          MEET YOUR NEXT OBSESSION
        </h1>
      </div>

      {/* Tabs */}
      <div
        data-cur="cursor"
        className="max-w-7xl mx-auto w-full px-4 flex gap-2 mb-6"
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
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
      <FragranceSelector />
      {/* Loading State */}
      {loading && (
        <div className="text-center py-10 min-h-[70vh]">
          <p>Loading products...</p>
          {/* Consider adding a spinner */}
        </div>
      )}

      {/* Product Grid */}
      {!loading && products?.length > 0 && (
        <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
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
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-center items-center gap-2 mb-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {/* <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} /> */}
    </>
  );
}
