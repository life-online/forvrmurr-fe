"use client";

import React from "react";
// Image import removed (not used)
import Link from 'next/link';
import { FiSearch, FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import CartOverlay from '@/components/cart/CartOverlay';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const Navbar: React.FC = () => {
  const {
    isCartOpen,
    toggleCart,
    closeCart,
    cartItems,
    removeFromCart,
    updateItemQuantity,
    addToCart,
    itemCount,
  } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    window.location.href = '/auth/login';
  };


  return (
    <nav className="w-full bg-black text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm mr-2">GB | £</span>
            <span className="text-xs">▼</span>
          </div>
          <span className="ml-4 text-sm hidden md:inline">
            Shipping Updates
          </span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <Link href="/" className="flex justify-center">
            <div className="text-2xl font-serif tracking-wider">
              Forvr <span className="font-bold">Murr</span>
            </div>
          </Link>
          <div className="flex gap-6 mt-4">
            <Link href="/shop">
              <span className="px-4 py-1 rounded-full bg-[#f7ede1] text-black font-serif text-base uppercase font-semibold">
                Shop
              </span>
            </Link>
            <Link href="/subscriptions">
              <span className="font-serif text-base uppercase">
                Subscriptions
              </span>
            </Link>
            <Link href="/discover">
              <span className="font-serif text-base uppercase">Discover</span>
            </Link>
            <Link href="/about">
              <span className="font-serif text-base uppercase">About</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <button
            aria-label="Search"
            className="hover:opacity-80 cursor-pointer"
          >
            <FiSearch size={20} />
          </button>

          <Link href={"/profile"}>
            <button
              aria-label="Account"
              className="hover:opacity-80 cursor-pointer"
            >
              <FiUser size={20} />
            </button>
          </Link>
          <button
            aria-label="Cart"
            className="hover:opacity-80 cursor-pointer relative"
            onClick={toggleCart}
          >
            <FiShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-white text-black rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          </button>
          {isAuthenticated && (
            <button
              aria-label="Logout"
              className="hover:opacity-80 flex items-center ml-2"
              onClick={handleLogout}
            >
              <FiLogOut size={20} />
              <span className="ml-1 text-sm">Logout</span>
            </button>
          )}
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
