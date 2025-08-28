'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { FiHeart, FiShoppingCart, FiX, FiSearch } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { toastService } from '@/services/toast';
import ProfileLayout from '@/components/profile/ProfileLayout';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  slug: string;
  inStock: boolean;
  addedDate: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Redirect guests to login page
    if (authService.isGuest()) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/profile/wishlist'));
      return;
    }

    // Mock wishlist data - replace with actual API call
    const mockWishlistItems: WishlistItem[] = [
      {
        id: '1',
        productId: 'mfk-br540',
        name: 'Baccarat Rouge 540',
        brand: 'Maison Francis Kurkdjian',
        price: 35000,
        imageUrl: '/images/hero/hero_image.png',
        slug: 'maison-francis-kurkdjian-baccarat-rouge-540',
        inStock: true,
        addedDate: '2025-07-20'
      },
      {
        id: '2',
        productId: 'creed-aventus',
        name: 'Aventus',
        brand: 'Creed',
        price: 42000,
        imageUrl: '/images/hero/hero_image.png',
        slug: 'creed-aventus',
        inStock: true,
        addedDate: '2025-07-18'
      },
      {
        id: '3',
        productId: 'tom-ford-oud-wood',
        name: 'Oud Wood',
        brand: 'Tom Ford',
        price: 38000,
        imageUrl: '/images/hero/hero_image.png',
        slug: 'tom-ford-oud-wood',
        inStock: false,
        addedDate: '2025-07-15'
      },
      {
        id: '4',
        productId: 'chanel-bleu',
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        price: 33000,
        imageUrl: '/images/hero/hero_image.png',
        slug: 'chanel-bleu-de-chanel',
        inStock: true,
        addedDate: '2025-07-12'
      }
    ];

    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setLoading(false);
    }, 500);
  }, [router]);

  // Don't render the page content if user is a guest (will redirect)
  if (authService.isGuest()) {
    return null;
  }

  const filteredItems = wishlistItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.inStock) return;

    try {
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        imageUrl: item.imageUrl,
        productId: item.productId,
        quantity: 1,
      });
      
      toastService.success(`${item.name} added to cart!`);
    } catch (error) {
      toastService.error('Failed to add item to cart');
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    setTimeout(() => {
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      toastService.success('Item removed from wishlist');
    }, 300);
  };

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
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-serif text-black mb-2">My Wishlist</h1>
          <p className="text-gray-600">Your saved fragrances for future consideration</p>
        </div>

        {/* Search */}
        {wishlistItems.length > 0 && (
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />
          </div>
        )}

        {/* Wishlist Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
              <FiHeart className="h-8 w-8 text-[#8b0000]" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              {wishlistItems.length === 0 ? "Your Wishlist is Empty" : "No Items Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {wishlistItems.length === 0 
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 ${
                  removingItems.has(item.id) ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div className="relative">
                  <Link href={`/shop/${item.slug}`}>
                    <div className="aspect-square relative bg-gray-50">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-full transition-colors group"
                    disabled={removingItems.has(item.id)}
                  >
                    <FiX size={16} className="text-gray-600 group-hover:text-red-600" />
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/shop/${item.slug}`}>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                      <h3 className="font-medium text-black line-clamp-2 hover:text-[#8B0000] transition-colors">
                        {item.name}
                      </h3>
                      <p className="font-medium text-lg text-black mt-1">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        item.inStock
                          ? 'bg-[#8B0000] text-white hover:bg-[#a0001e]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart size={16} />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Added {new Date(item.addedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {wishlistItems.length > 0 && (
          <div className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">{wishlistItems.length}</p>
                <p className="text-sm text-gray-600">Items in Wishlist</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">
                  ₦{wishlistItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#8B0000]">
                  {wishlistItems.filter(item => item.inStock).length}
                </p>
                <p className="text-sm text-gray-600">Available Items</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
