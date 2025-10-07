'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { FiHeart, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/services/product';
import wishlistService, { WishlistFilterParams, WishlistResponse } from '@/services/wishlist';
import { WishlistProvider } from '@/context/WishlistContext';

export default function WishlistPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [summary, setSummary] = useState({
    itemsInWishlist: 0,
    totalValue: '0',
    availableItems: 0,
  });
  const [filters, setFilters] = useState<WishlistFilterParams>({
    page: 1,
    limit: 12,
    search: '',
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  const fetchWishlist = useCallback(async (filterParams: WishlistFilterParams, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setSearchLoading(true);
    }

    try {
      // Call actual wishlist API
      const response = await wishlistService.getWishlist(filterParams);

      // Extract products from wishlist items
      const products = response.data.map(wishlistItem => wishlistItem.product);

      // Use smooth transitions instead of immediate updates
      if (!isInitialLoad) {
        // Add a small delay to prevent jarring transitions
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProducts(products);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.totalItems);

      // Only update summary on initial load to prevent stats from jumping around during search
      if (isInitialLoad) {
        setSummary(response.summary);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      if (!isInitialLoad) {
        // Don't clear products on search error, just show the error
        console.error('Search failed, keeping current products visible');
      } else {
        setProducts([]);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  }, []);

  // Function to refresh wishlist data
  const refreshWishlist = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Function to optimistically remove item from UI
  const removeItemOptimistically = useCallback((productId: string) => {
    setProducts(prevProducts => {
      const filteredProducts = prevProducts.filter(product => product.id !== productId);
      return filteredProducts;
    });

    // Update summary counts
    setSummary(prevSummary => ({
      ...prevSummary,
      itemsInWishlist: Math.max(0, prevSummary.itemsInWishlist - 1),
      availableItems: Math.max(0, prevSummary.availableItems - 1)
    }));

    // Update total items count
    setTotalItems(prevTotal => Math.max(0, prevTotal - 1));
  }, []);

  // Initial load
  useEffect(() => {
    // Redirect guests to login page
    if (authService.isGuest()) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/profile/wishlist'));
      return;
    }

    fetchWishlist(filters, true);
    isInitialLoad.current = false;
  }, [router, fetchWishlist, refreshKey]);

  // Fetch data when filters change (not on initial load)
  useEffect(() => {
    if (!isInitialLoad.current) {
      fetchWishlist(filters);
    }
  }, [filters, fetchWishlist]);

  // Debounced search with reduced delay for smoother experience
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        page: 1, // Reset to first page on search
      }));
    }, 300); // Reduced from 500ms to 300ms for faster response

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setFilters(prev => ({ ...prev, page }));
    }
  };

  // Don't render the page content if user is a guest (will redirect)
  if (authService.isGuest()) {
    return null;
  }

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <WishlistProvider refreshWishlist={refreshWishlist} removeItemOptimistically={removeItemOptimistically}>
        <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-serif text-black mb-2">My Wishlist</h1>
          <p className="text-gray-600">Your saved fragrances for future consideration</p>
        </div>

        {/* Search - show if user has items in wishlist (even if current search has no results) */}
        {summary.itemsInWishlist > 0 && (
          <div className="relative">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${searchLoading ? 'text-[#8B0000]' : 'text-gray-400'}`} size={20} />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-[#8B0000] border-t-transparent" />
              </div>
            )}
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent ${searchLoading ? 'border-[#8B0000] bg-red-50' : 'border-gray-300'}`}
            />
          </div>
        )}

        {/* Stats */}
        {summary.itemsInWishlist > 0 && (
          <div className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">{summary.itemsInWishlist}</p>
                <p className="text-sm text-gray-600">Items in Wishlist</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">
                  ₦{parseInt(summary.totalValue).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">
                  {summary.availableItems}
                </p>
                <p className="text-sm text-gray-600">Available Items</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Indicator */}
        {searchInput && !searchLoading && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {products.length > 0 ? (
              <>Showing {products.length} result{products.length !== 1 ? 's' : ''} for "<span className="font-medium">{searchInput}</span>"</>
            ) : (
              <>No results found for "<span className="font-medium">{searchInput}</span>"</>
            )}
          </div>
        )}

        {/* Wishlist Content */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
              <FiHeart className="h-8 w-8 text-[#8b0000]" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              {summary.itemsInWishlist === 0 ? "Your Wishlist is Empty" : "No Items Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {summary.itemsInWishlist === 0
                ? "Add fragrances to your wishlist by clicking the heart icon on product pages."
                : "Try adjusting your search to find what you're looking for."
              }
            </p>
            <Link href="/shop">
              <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
                Explore Fragrances
              </span>
            </Link>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${searchLoading ? 'opacity-70' : 'opacity-100'}`}>
              {products.map((product) => (
                <div key={product.id} className="transition-all duration-300 ease-in-out">
                  <ProductCard
                    product={product}
                    priorityLoading={false}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mt-8 pt-6 border-t border-gray-200 transition-opacity duration-300 ${searchLoading ? 'opacity-50' : 'opacity-100'}`}>
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
                  {totalPages <= 5 ? (
                    Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                          currentPage === i + 1
                            ? 'bg-[#8B0000] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    <>
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

                      {Array.from({ length: 5 }, (_, i) => {
                        const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNumber > totalPages) return null;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                              currentPage === pageNumber
                                ? 'bg-[#8B0000] text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

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
          </>
        )}
        </div>
      </WishlistProvider>
    </ProfileLayout>
  );
}
