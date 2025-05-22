"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiUser, FiShoppingBag, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import CartOverlay from '@/components/cart/CartOverlay';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import SearchPopup from './SearchPopover';

interface NavItem {
  name: string;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'HOME', path: '/' },
  { name: 'SHOP', path: '/shop' },
  { name: 'SUBSCRIPTIONS', path: '/subscriptions' },
  { name: 'DISCOVER', path: '/discover' },
  // { name: 'ABOUT', path: '/about' },
];

// Discover subroutes
const discoverSubroutes = [
  { name: 'Blind Buying', path: '/discover/blind-buying' },
  { name: 'Perfume Personal', path: '/discover/perfume-personal' },
  { name: 'Your Scent', path: '/discover/your-scent' },
];

const Navbar: React.FC = () => {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Currency selector state
  const [selectedCurrency, setSelectedCurrency] = useState<'GBP' | 'NGN'>('NGN');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Discover dropdown state
  const [showDiscoverDropdown, setShowDiscoverDropdown] = useState(false);

  // Refs for click-outside handling
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close currency dropdown when clicking outside
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }

      // Close discover dropdown when clicking outside
      if (discoverDropdownRef.current && !discoverDropdownRef.current.contains(event.target as Node)) {
        setShowDiscoverDropdown(false);
      }

      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (showCurrencyDropdown || showDiscoverDropdown || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCurrencyDropdown, showDiscoverDropdown, isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
      <nav className="w-full bg-black text-white pt-4 pb-6 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          {/* Currency Selector - Hidden on mobile, visible on desktop */}
          <div className="relative hidden md:flex items-center" ref={currencyDropdownRef}>
            <button
              className="flex items-center cursor-pointer hover:opacity-80 focus:outline-none"
              onClick={() => setShowCurrencyDropdown((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={showCurrencyDropdown}
              type="button"
            >
              <span className="text-xl mr-1">{selectedCurrency === 'NGN' ? '🇳🇬' : '🇬🇧'}</span>
              <span className="text-base mr-1">
                {selectedCurrency === 'NGN' ? 'NG | ₦' : 'GB | £'}
              </span>
              <span className="text-base">▼</span>
            </button>
            {showCurrencyDropdown && (
              <ul
                className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50 text-black"
                role="listbox"
              >
                <li
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedCurrency === 'NGN' ? 'font-bold' : ''}`}
                  onClick={() => { setSelectedCurrency('NGN'); setShowCurrencyDropdown(false); }}
                  role="option"
                  aria-selected={selectedCurrency === 'NGN'}
                >
                  <span className="text-lg mr-2">🇳🇬</span> NG | ₦
                </li>
              </ul>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="md:hidden flex items-center p-1 text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo - Centered on desktop, left-aligned on mobile */}
          <div className="mx-auto md:mx-0 md:flex md:flex-col md:items-center order-2 md:order-none">
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

            {/* Desktop Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.path ||
                  (item.path !== '/' && pathname?.startsWith(item.path));

                // Special handling for DISCOVER dropdown
                if (item.name === 'DISCOVER') {
                  return (
                    <div key={item.path} className="relative" ref={discoverDropdownRef}>
                      <button
                        onClick={() => setShowDiscoverDropdown(!showDiscoverDropdown)}
                        className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${isActive
                          ? 'bg-[#f7ede1] text-black font-medium'
                          : 'hover:opacity-70'
                          }`}
                        aria-expanded={showDiscoverDropdown}
                        aria-haspopup="menu"
                      >
                        {item.name}
                      </button>

                      {/* Discover Dropdown */}
                      {showDiscoverDropdown && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                          {discoverSubroutes.map(subroute => (
                            <Link
                              key={subroute.path}
                              href={subroute.path}
                              className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              onClick={() => setShowDiscoverDropdown(false)}
                            >
                              {subroute.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

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

          {/* Icons - Right aligned */}
          <div className="flex items-center space-x-5 order-3">
            <SearchPopup />
            {/* Fix hydration mismatch with client-side navigation */}
            <button
              aria-label="Account"
              className="hover:opacity-70 transition-opacity"
              onClick={() => window.location.href = isAuthenticated ? "/profile" : "/auth/login"}
            >
              <FiUser size={18} />
            </button>

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
          </div>
        </div>

        {/* Mobile Navigation Menu - Slide down when open */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 bg-black z-50 border-t border-gray-800 shadow-lg"
            ref={mobileMenuRef}
          >
            <div className="px-4 py-6 space-y-8">
              {/* Mobile Currency Selector */}
              <div className="border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-400 mb-2">Select Currency</p>
                <div className="flex gap-4">
                  <button
                    className={`flex items-center px-3 py-2 rounded ${selectedCurrency === 'NGN' ? 'bg-gray-800' : ''}`}
                    onClick={() => setSelectedCurrency('NGN')}
                  >
                    <span className="text-lg mr-2">🇳🇬</span> NG | ₦
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.path ||
                    (item.path !== '/' && pathname?.startsWith(item.path));

                  // Special handling for DISCOVER in mobile menu  
                  if (item.name === 'DISCOVER') {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`flex justify-between items-center py-3 px-4 ${isActive
                            ? 'bg-gray-800 rounded font-medium'
                            : 'hover:bg-gray-900'
                            }`}
                        >
                          <span>{item.name}</span>
                        </div>

                        {/* Mobile discover subroutes */}
                        <div className="pl-6 border-l border-gray-700 ml-4 space-y-1">
                          {discoverSubroutes.map(subroute => {
                            const isSubrouteActive = pathname === subroute.path;

                            return (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className={`block py-2 px-4 text-sm ${isSubrouteActive
                                  ? 'text-white font-medium'
                                  : 'text-gray-400 hover:text-white'
                                  }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {subroute.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`block py-3 px-4 ${isActive
                        ? 'bg-gray-800 rounded font-medium'
                        : 'hover:bg-gray-900'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Conditionally show logout on mobile */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-gray-800">
                  <button
                    className="flex items-center gap-2 text-red-400 py-2"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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
