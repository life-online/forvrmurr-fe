"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import ProductCard from './ProductCard';
import productService, { Product, ProductType, ProductsResponse } from '@/services/product';

// We're using the Product type from the API service instead of defining our own

interface ProductShowcaseProps {
  title: string;
  subtitle?: string;
  limit?: number;
  filterBy?: string;
  initialProducts?: Product[];
}


const ProductShowcase: React.FC<ProductShowcaseProps> = ({ 
  title, 
  subtitle, 
  limit = 8, 
  filterBy,
  initialProducts 
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProductType | 'all'>('all');
  
  useEffect(() => {
    // If initial products are provided, no need to fetch
    if (initialProducts) {
      setProducts(initialProducts);
      return;
    }
    
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters: Record<string, any> = { limit };
        // Apply type filter if not showing all
        if (activeFilter !== 'all') {
          filters.type = activeFilter;
        }
        
        const response: ProductsResponse = await productService.getProducts(filters);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products for showcase:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [activeFilter, initialProducts, limit]);
  
  const handleFilterChange = (filter: ProductType | 'all') => {
    setActiveFilter(filter);
  };
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link href="/new" className="hover:underline">New Release</Link>
              <span>›</span>
              <Link href="/shop-all" className="hover:underline">Shop All</Link>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`border text-sm py-1 px-4 rounded-full transition-colors ${activeFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilterChange('prime')}
              className={`border text-sm py-1 px-4 rounded-full transition-colors ${activeFilter === 'prime' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              Prime
            </button>
            <button 
              onClick={() => handleFilterChange('premium')}
              className={`border text-sm py-1 px-4 rounded-full transition-colors ${activeFilter === 'premium' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              Premium
            </button>
          </div>
        </div>
        
        {/* Custom horizontal scrolling container */}
        <div className="horizontal-scroll-container relative">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar scroll-container scroll-smooth">
              {products.map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0 w-80">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
