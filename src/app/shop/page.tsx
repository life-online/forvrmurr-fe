'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Footer from '../../components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import FilterModal from '@/components/ui/FilterModal';
import Link from 'next/link';
import productService, { Product, ProductFilterParams, ProductType } from '@/services/product';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ui/ProductCard';

const scentCategories = [
  { label: 'Elegant', value: 'elegant' },
  { label: 'Intimate', value: 'intimate' },
  { label: 'Sophisticated', value: 'sophisticated' },
  { label: 'Warm', value: 'warm' },
  { label: 'Clean', value: 'clean' },
];

// Define a type that includes both ProductType and 'all'
type FilterTabValue = 'all' | ProductType;

const filterTabs = [
  { label: 'All', value: 'all' as FilterTabValue },
  { label: 'Prime', value: 'prime' as FilterTabValue },
  { label: 'Premium', value: 'premium' as FilterTabValue },
];

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error: showError } = useToast();
  
  // Read URL parameters for pagination and filters
  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const typeFromUrl = (searchParams.get('type') as FilterTabValue) || 'all';
  const searchFromUrl = searchParams.get('search') || '';
  
  // State for products and pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for filters
  const [activeTab, setActiveTab] = useState<FilterTabValue>(typeFromUrl);
  const [activeCategory, setActiveCategory] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState(searchFromUrl);
  
  // Build initial filters without undefined values
  const initialFilters: ProductFilterParams = {
    page: pageFromUrl,
    limit: 12
  };
  
  // Only add type filter if it's not 'all'
  if (typeFromUrl !== 'all') {
    initialFilters.type = typeFromUrl as ProductType;
  }
  
  // Only add search if not empty
  if (searchFromUrl) {
    initialFilters.search = searchFromUrl;
  }
  
  const [filters, setFilters] = useState<ProductFilterParams>(initialFilters);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts(filters);
        setProducts(response.data);
        setTotalProducts(response.meta.total);
        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
        showError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, showError]);

  // Update filters when tab changes
  const handleTabChange = (tabValue: FilterTabValue) => {
    setActiveTab(tabValue);
    
    // Create new filters, removing type for 'all' option
    const newFilters: ProductFilterParams = {
      ...filters,
      page: 1 // Reset to first page when changing filters
    };
    
    if (tabValue === 'all') {
      // Remove type filter to show all products
      delete newFilters.type;
    } else {
      // Apply specific type filter - we know it's ProductType if not 'all'
      newFilters.type = tabValue as ProductType;
    }
    
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Update category filter
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setFilters(prev => ({
      ...prev,
      categoryId: categoryId === activeCategory ? undefined : categoryId,
      page: 1
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    const newFilters = {
      ...filters,
      search: searchTerm,
      page: 1
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Update URL based on current filters
  const updateUrl = (newFilters: ProductFilterParams) => {
    const params = new URLSearchParams();
    if (newFilters.page && newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.search) params.set('search', newFilters.search);
    
    const newUrl = `/shop${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const newFilters = {
      ...filters,
      page
    };
    setFilters(newFilters);
    updateUrl(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <AnnouncementBar message="New collection revealed monthly!" />
      <Navbar />
      {/* Breadcrumb and Title */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-8">
        <div className="text-xs mb-2">
          <span className="mr-2">New Release</span>
          <span className="mr-2">›</span>
          <span>Shop All</span>
        </div>
        <h1 className="text-2xl font-serif font-medium mb-4 text-black">CHOOSE YOUR NEXT SCENT OBSESSION</h1>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 flex gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'bg-[#faf0e2] border-[#e6c789] text-[#600000]'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scent Category Filters */}
      <div className="max-w-4xl mx-auto w-full px-4 flex gap-4 mb-8">
        {scentCategories.map((cat) => (
          <div key={cat.value} className="flex flex-col items-center flex-1">
            <button
              className={`w-28 md:w-36 aspect-[1.6/1] rounded-xl flex items-center justify-center text-base font-serif mb-2 transition-colors ${
                activeCategory === cat.value
                  ? 'bg-[#faf0e2] text-[#600000]'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveCategory(cat.value)}
            >
              Pic
            </button>
            <span className={`mt-1 text-sm font-serif ${activeCategory === cat.value ? 'text-[#600000] font-semibold' : 'text-gray-700'}`}>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Product Count and Filter/Sort Controls */}
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between mb-6">
        <span className="text-[#a0001e] font-serif">{loading ? 'Loading products...' : `Showing ${products.length} of ${totalProducts} products`}</span>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-full border border-gray-300 bg-white text-gray-700 px-4 py-1 text-sm font-serif focus:outline-none focus:ring-1 focus:ring-[#8b0000] w-40"
            />
          </div>
          <button 
            className="rounded-full border border-gray-300 bg-white text-[#a0001e] px-4 py-1 text-base font-serif focus:outline-none"
            onClick={() => setFilterModalOpen(true)}
          >
            Filter
          </button>
          <select 
            className="rounded-full border border-gray-300 bg-white text-[#a0001e] px-4 py-1 text-base font-serif focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {loading ? (
          // Loading skeleton
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-[#f8f5f2] rounded-xl p-4 flex flex-col items-center min-h-[450px] animate-pulse">
              <div className="w-full aspect-square bg-gray-300 rounded my-4"></div>
              <div className="w-2/3 h-5 bg-gray-300 rounded mb-3"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded mb-4"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
            </div>
          ))
        ) : products.length === 0 ? (
          // No products found
          <div className="col-span-3 text-center py-16">
            <p className="text-lg text-gray-600">No products found matching your criteria.</p>
            <button 
              onClick={() => {
                // Create basic filters without search
                const clearFilters: ProductFilterParams = { page: 1, limit: 12 };
                
                // Only add type if not 'all'
                if (activeTab !== 'all') {
                  clearFilters.type = activeTab as ProductType;
                }
                
                setFilters(clearFilters);
                updateUrl(clearFilters);
              }} 
              className="mt-4 bg-[#8b0000] text-white px-4 py-2 rounded-md hover:bg-[#6b0000] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          // Product grid
          products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              priorityLoading={currentPage === 1 && products.indexOf(product) < 4}
            />
          ))
        )}
      </div>
      
      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="max-w-7xl mx-auto w-full px-4 flex justify-center items-center mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#f8f5f2] text-[#8b0000] hover:bg-[#e6c789]'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-md ${page === currentPage ? 'bg-[#8b0000] text-white' : 'bg-[#f8f5f2] text-[#8b0000] hover:bg-[#e6c789]'}`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#f8f5f2] text-[#8b0000] hover:bg-[#e6c789]'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Lower Hero Section */}
      <div className="w-full bg-gradient-to-r from-[#2d0000] to-[#600000] py-16 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4 gap-8">
          <div className="flex-1 text-white">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">OVER 200 CURATED FRAGRANCES. ONE SIGNATURE EXPERIENCE</h2>
            <p className="mb-6 text-base md:text-lg">
              The luxury perfume world was built on exclusivity. We&apos;re here to break that barrier—without watering anything down.<br />
              We stock over 200 of the best designer and niche fragrances in the world. From Parfums de Marly to Lattafa, Amouage to Armaf.<br />
              <br />
              While most decants arrive in plain plastic vials, ours are a luxury experience—with premium packaging, mood-based bundles, and unforgettable scent storytelling.<br />
              Forvr Murr is more than a perfume shop. It&apos;s a curated world of scent, desire, and indulgence.
            </p>
            <button className="bg-[#e6c789] text-[#600000] px-6 py-2 rounded font-medium hover:bg-[#f8f5e2] transition-colors">Subscribe</button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-80 h-96 rounded-lg overflow-hidden">
              <Image src="/images/hero/hero_image.jpg" alt="ForvrMurr Hero" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </div>
  );
} 