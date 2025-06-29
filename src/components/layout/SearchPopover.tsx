"use client";

import * as Popover from "@radix-ui/react-popover";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import productService, { Product } from "@/services/product";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchPopover() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts({
          search: searchQuery,
          limit: 6, // Limit to 6 products for dropdown
        });
        setProducts(response?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchProducts, 300); // Debounce search
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);
  
  // Navigate to product page and close popover
  const handleProductClick = (slug: string) => {
    router.push(`/shop/${slug}`);
    setOpen(false);
    setSearchQuery("");
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          aria-label="Search"
          className="hover:opacity-70 transition-opacity flex items-center"
          onClick={() => setOpen(true)}
        >
          <FiSearch size={18} />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="bg-white rounded-md shadow-lg border border-gray-200 z-50 w-[380px] max-w-[95vw] overflow-hidden animate-fade-in" 
          side="bottom"
          sideOffset={8}
          align="end"
        >
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center border-b border-gray-200 p-3">
              <FiSearch size={18} className="text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                className="flex-1 focus:outline-none text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <IoMdClose size={18} />
                </button>
              )}
            </div>
          </form>
          
          {/* Search results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#a0001e]"></div>
              </div>
            )}
            
            {!loading && products.length > 0 && (
              <div className="divide-y divide-gray-100">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors rounded-md"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <div className="relative h-14 w-14 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                      <Image
                        src={product.imageUrls?.[0] || "/images/hero/hero_image.png"}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">{product.brand?.name}</p>
                      <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#a0001e] font-semibold">
                          ₦{parseInt(product.nairaPrice).toLocaleString()}
                        </span>
                        {product.type && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600">
                            {product.type}
                          </span>
                        )}
                        {product.inventoryQuantity <= 0 && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-gray-800 text-white rounded-full">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* View all results button */}
                {products.length > 0 && (
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
                        setOpen(false);
                      }}
                      className="w-full text-center text-[#a0001e] text-xs py-2 hover:underline"
                    >
                      View all {products.length}+ results
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {!loading && products.length === 0 && searchQuery.trim() !== "" && (
              <p className="text-center text-gray-500 py-4 text-sm">
                No products found for "{searchQuery}"
              </p>
            )}

            {!loading && searchQuery.trim() === "" && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">Start typing to search</p>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
