"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiUser, FiShoppingBag } from 'react-icons/fi';
import CartOverlay from '@/components/cart/CartOverlay';
import { useCart } from '@/context/CartContext';

const Navbar: React.FC = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    closeCart, 
    cartItems, 
    removeFromCart, 
    updateItemQuantity, 
    addToCart,
    itemCount
  } = useCart();

  return (
    <nav className="w-full bg-black text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm mr-2">GB | £</span>
            <span className="text-xs">▼</span>
          </div>
        </div>
        
        <Link href="/" className="flex justify-center">
          <div className="text-2xl font-serif tracking-wider">ForvrMurr</div>
        </Link>
        
        <div className="flex items-center space-x-6">
          <button aria-label="Search" className="hover:opacity-80">
            <FiSearch size={20} />
          </button>
          <button aria-label="Account" className="hover:opacity-80">
            <FiUser size={20} />
          </button>
          <button 
            aria-label="Cart" 
            className="hover:opacity-80 relative"
            onClick={toggleCart}
          >
            <FiShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-white text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex justify-center mt-4">
        <div className="uppercase tracking-wider text-sm font-medium">
          Catalogue
        </div>
      </div>

      {/* Cart Overlay */}
      <CartOverlay 
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateItemQuantity={updateItemQuantity}
        addToCart={addToCart}
      />
    </nav>
  );
};

export default Navbar;
