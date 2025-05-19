"use client";

import React from "react";
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingBag, FiLogOut } from 'react-icons/fi';
import CartOverlay from '@/components/cart/CartOverlay';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'SHOP', path: '/shop' },
  { name: 'SUBSCRIPTIONS', path: '/subscriptions' },
  { name: 'DISCOVER', path: '/discover' },
  { name: 'ABOUT', path: '/about' },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
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
    <>
      {/* Main Navigation */}
      <nav className="w-full bg-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Currency Selector */}
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer hover:opacity-80">
              <span className="text-xs mr-1">GB | £</span>
              <span className="text-xs">▼</span>
            </div>
          </div>
          
          {/* Logo & Navigation */}
          <div className="flex flex-col items-center">
            {/* Logo */}
            <Link href="/" className="mb-4">
              <Image 
                src="/images/logo/logo_white.png" 
                alt="Forvr Murr" 
                width={180} 
                height={60} 
                className="h-auto w-auto" 
              />
            </Link>
            
            {/* Navigation Links */}
            <div className="flex gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.path || 
                  (item.path !== '/' && pathname?.startsWith(item.path));
                  
                return (
                  <Link key={item.path} href={item.path}>
                    <span className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${isActive 
                      ? 'bg-[#f7ede1] text-black font-medium' 
                      : 'hover:opacity-70'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Icons */}
          <div className="flex items-center space-x-5">
            <button
              aria-label="Search"
              className="hover:opacity-70 transition-opacity"
            >
              <FiSearch size={18} />
            </button>

            <Link href={isAuthenticated ? "/profile" : "/auth/login"}>
              <button
                aria-label="Account"
                className="hover:opacity-70 transition-opacity"
              >
                <FiUser size={18} />
              </button>
            </Link>
            
            <button
              aria-label="Cart"
              className="hover:opacity-70 transition-opacity relative"
              onClick={toggleCart}
            >
              <FiShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
                  {itemCount}
                </span>
              )}
            </button>
            
            {isAuthenticated && (
              <button
                aria-label="Logout"
                className="hover:opacity-70 transition-opacity"
                onClick={handleLogout}
              >
                <FiLogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Overlay */}
      <CartOverlay
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateItemQuantity={updateItemQuantity}
        addToCart={addToCart}
      />
    </>
  );
};

export default Navbar;
