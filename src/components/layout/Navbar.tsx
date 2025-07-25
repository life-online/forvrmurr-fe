"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiShoppingBag, FiMenu, FiX, FiUser } from "react-icons/fi";
import CartOverlay from "@/components/cart/CartOverlay";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import SearchPopup from "./SearchPopover";

interface NavItem {
  name: string;
  path: string;
}

interface NavSubRoute {
  name: string;
  path: string;
  onClick?: () => void;
}

const navItems: NavItem[] = [
  { name: "SHOP", path: "/shop" },
  { name: "SUBSCRIPTIONS", path: "/subscriptions" },
  { name: "DISCOVER", path: "/discover" },
  { name: "ABOUT", path: "/about" },
];

const shopSubroutes = [
  { name: "Shop Collection", path: "/shop" },
  { name: "Perfume Travel Case", path: "/shop/travel-case" },
  { name: "Gifting", path: "/shop/gifting" },
];

const subscriptionsSubroutes = [
  { name: "Monthly Prime", path: "/subscriptions/prime" },
  { name: "Monthly Premium", path: "/subscriptions/premium" },
  { name: "Manage Subscription", path: "/subscriptions/manage" },
];

const discoverSubroutes = [
  { name: "Take Scent Quiz", path: "/discover/quiz" },
  { name: "Why Choose Decants", path: "/discover/why-decants" },
];

const aboutSubroutes = [
  { name: "Our Story", path: "/about/story" },
  { name: "Meet the Founders", path: "/about/founders" },
  { name: "FAQs", path: "/about/faq" },
  { name: "Contact Us", path: "/about/contact" },
];

const getAccountSubroutes = (isAuthenticated: boolean, handleLogout: () => void) => [
  ...(isAuthenticated 
    ? [{ name: "Logout", path: "#", onClick: handleLogout }] 
    : [{ name: "Login", path: "/auth/login" }]),
  { name: "Order History", path: "/profile/orders" },
  { name: "Wishlist", path: "/profile/wishlist" },
];


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"GBP" | "NGN">(
    "NGN"
  );
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showSubscriptionsDropdown, setShowSubscriptionsDropdown] = useState(false);
  const [showDiscoverDropdown, setShowDiscoverDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const subscriptionsDropdownRef = useRef<HTMLDivElement>(null);
  const discoverDropdownRef = useRef<HTMLDivElement>(null);
  const aboutDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns and mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCurrencyDropdown(false);
      }
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        setShowShopDropdown(false);
      }
      if (
        subscriptionsDropdownRef.current &&
        !subscriptionsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSubscriptionsDropdown(false);
      }
      if (
        discoverDropdownRef.current &&
        !discoverDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDiscoverDropdown(false);
      }
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAboutDropdown(false);
      }
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    if (
      showCurrencyDropdown ||
      showShopDropdown ||
      showSubscriptionsDropdown ||
      showDiscoverDropdown ||
      showAboutDropdown ||
      showAccountDropdown ||
      isMobileMenuOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    showCurrencyDropdown,
    showShopDropdown,
    showSubscriptionsDropdown,
    showDiscoverDropdown,
    showAboutDropdown,
    showAccountDropdown,
    isMobileMenuOpen,
  ]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    success("Logged out successfully");
    window.location.href = "/auth/login";
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="w-full bg-black text-white pt-4 pb-6 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center grow">
            {/* Currency Selector - Hidden on mobile, visible on desktop */}
            <div
              className="relative hidden md:flex items-center"
              ref={currencyDropdownRef}
            >
              <button
                className="flex items-center cursor-pointer hover:opacity-80 focus:outline-none"
                onClick={() => setShowCurrencyDropdown((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={showCurrencyDropdown}
                type="button"
              >
                <span className="text-xl mr-1">
                  {selectedCurrency === "NGN" ? "🇳🇬" : "🇬🇧"}
                </span>
                <span className="text-base mr-1">
                  {selectedCurrency === "NGN" ? "₦" : "£"}
                </span>
                <span className="text-base">▼</span>
              </button>
              {showCurrencyDropdown && (
                <ul
                  className="absolute left-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-50 text-black"
                  role="listbox"
                >
                  <li
                    className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedCurrency === "NGN" ? "font-bold" : ""
                    }`}
                    onClick={() => {
                      setSelectedCurrency("NGN");
                      setShowCurrencyDropdown(false);
                    }}
                    role="option"
                    aria-selected={selectedCurrency === "NGN"}
                  >
                    <span className="text-lg mr-2">🇳🇬</span> ₦
                  </li>
                  {/* Add GBP option if needed */}
                  {/* <li
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedCurrency === "GBP" ? "font-bold" : ""
                  }`}
                  onClick={() => {
                    setSelectedCurrency("GBP");
                    setShowCurrencyDropdown(false);
                  }}
                  role="option"
                  aria-selected={selectedCurrency === "GBP"}
                >
                  <span className="text-lg mr-2">🇬🇧</span> GB | £
                </li> */}
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
            <div className="grow ml-4 mx-auto md:mx-0 md:flex md:flex-col md:items-center order-2 md:order-none">
              {/* Logo */}
              <Link href="/" className="mb-4">
                <Image
                  src="/images/logo/logo_white.png"
                  alt="Forvr Murr"
                  width={180}
                  height={60}
                  className="h-auto w-[120px] sm:w-[180px]"
                />
              </Link>

              {/* Desktop Navigation Links - Hidden on mobile */}
              <div className="hidden md:flex gap-8">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/" && pathname?.startsWith(item.path));

                  // Special handling for SHOP dropdown
                  if (item.name === "SHOP") {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        ref={shopDropdownRef}
                      >
                        <button
                          onClick={() => setShowShopDropdown(!showShopDropdown)}
                          className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#f7ede1] text-black font-medium"
                              : "hover:opacity-70"
                          }`}
                          aria-expanded={showShopDropdown}
                          aria-haspopup="menu"
                        >
                          {item.name}
                        </button>

                        {/* Shop Dropdown */}
                        {showShopDropdown && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                            {shopSubroutes.map((subroute) => (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setShowShopDropdown(false)}
                              >
                                {subroute.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Special handling for SUBSCRIPTIONS dropdown
                  if (item.name === "SUBSCRIPTIONS") {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        ref={subscriptionsDropdownRef}
                      >
                        <button
                          onClick={() => setShowSubscriptionsDropdown(!showSubscriptionsDropdown)}
                          className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#f7ede1] text-black font-medium"
                              : "hover:opacity-70"
                          }`}
                          aria-expanded={showSubscriptionsDropdown}
                          aria-haspopup="menu"
                        >
                          {item.name}
                        </button>

                        {/* Subscriptions Dropdown */}
                        {showSubscriptionsDropdown && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                            {subscriptionsSubroutes.map((subroute) => (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setShowSubscriptionsDropdown(false)}
                              >
                                {subroute.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Special handling for DISCOVER dropdown
                  if (item.name === "DISCOVER") {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        ref={discoverDropdownRef}
                      >
                        <button
                          onClick={() => setShowDiscoverDropdown(!showDiscoverDropdown)}
                          className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#f7ede1] text-black font-medium"
                              : "hover:opacity-70"
                          }`}
                          aria-expanded={showDiscoverDropdown}
                          aria-haspopup="menu"
                        >
                          {item.name}
                        </button>

                        {/* Discover Dropdown */}
                        {showDiscoverDropdown && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                            {discoverSubroutes.map((subroute) => (
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

                  // Special handling for ABOUT dropdown
                  if (item.name === "ABOUT") {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        ref={aboutDropdownRef}
                      >
                        <button
                          onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                          className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#f7ede1] text-black font-medium"
                              : "hover:opacity-70"
                          }`}
                          aria-expanded={showAboutDropdown}
                          aria-haspopup="menu"
                        >
                          {item.name}
                        </button>

                        {/* About Dropdown */}
                        {showAboutDropdown && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                            {aboutSubroutes.map((subroute) => (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                onClick={() => setShowAboutDropdown(false)}
                              >
                                {subroute.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Special handling for MY ACCOUNT dropdown
                  if (item.name === "MY ACCOUNT") {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        ref={accountDropdownRef}
                      >
                        <button
                          onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                          className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                            isActive
                              ? "bg-[#f7ede1] text-black font-medium"
                              : "hover:opacity-70"
                          }`}
                          aria-expanded={showAccountDropdown}
                          aria-haspopup="menu"
                        >
                          {item.name}
                        </button>

                        {/* Account Dropdown */}
                        {showAccountDropdown && (
                          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                            {getAccountSubroutes(isAuthenticated, handleLogout).map((subroute: NavSubRoute) => (
                              subroute.onClick ? (
                                <button
                                  key={subroute.name}
                                  onClick={() => {
                                    setShowAccountDropdown(false);
                                    subroute.onClick?.();
                                  }}
                                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                >
                                  {subroute.name}
                                </button>
                              ) : (
                                <Link
                                  key={subroute.path}
                                  href={subroute.path}
                                  className="block px-4 py-2 hover:bg-gray-100 text-sm"
                                  onClick={() => setShowAccountDropdown(false)}
                                >
                                  {subroute.name}
                                </Link>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link key={item.path} href={item.path}>
                      <span
                        className={`px-4 py-1 rounded-full font-serif text-sm transition-colors duration-200 ${
                          isActive
                            ? "bg-[#f7ede1] text-black font-medium"
                            : "hover:opacity-70"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Icons - Right aligned */}
          <div className="flex items-center space-x-4 order-3">
            <SearchPopup />
            
            {/* User Account Icon with Dropdown */}
            <div className="relative" ref={accountDropdownRef}>
              <button
                aria-label="My Account"
                className="hover:opacity-70 transition-opacity"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                <FiUser size={18} />
              </button>
              
              {/* Account Dropdown */}
              {showAccountDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 text-black">
                  {getAccountSubroutes(isAuthenticated, handleLogout).map((subroute: NavSubRoute) => (
                    subroute.onClick ? (
                      <button
                        key={subroute.name}
                        onClick={() => {
                          setShowAccountDropdown(false);
                          subroute.onClick?.();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
                        {subroute.name}
                      </button>
                    ) : (
                      <Link
                        key={subroute.path}
                        href={subroute.path}
                        className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => setShowAccountDropdown(false)}
                      >
                        {subroute.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
            
            {/* Shopping Cart Icon */}
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
            className="md:hidden absolute top-full left-0 right-0 bg-black z-50 border-t border-gray-800 shadow-lg overflow-auto max-h-[80vh]"
            ref={mobileMenuRef}
          >
            <div className="px-4 py-6 space-y-8">
              {/* Mobile Currency Selector */}
              <div className="border-b border-gray-800 pb-4">
                <p className="text-sm text-gray-400 mb-2">Select Currency</p>
                <div className="flex gap-4">
                  <button
                    className={`flex items-center px-3 py-2 rounded ${
                      selectedCurrency === "NGN" ? "bg-gray-800" : ""
                    }`}
                    onClick={() => setSelectedCurrency("NGN")}
                  >
                    <span className="text-lg mr-2">🇳🇬</span> NG | ₦
                  </button>
                  {/* Add GBP option if needed
                  <button
                    className={`flex items-center px-3 py-2 rounded ${
                      selectedCurrency === "GBP" ? "bg-gray-800" : ""
                    }`}
                    onClick={() => setSelectedCurrency("GBP")}
                  >
                    <span className="text-lg mr-2">🇬🇧</span> GB | £
                  </button> */}
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/" && pathname?.startsWith(item.path));

                  // Special handling for SHOP in mobile menu
                  if (item.name === "SHOP") {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`flex justify-between items-center py-3 px-4 ${isActive ? "bg-gray-800 rounded font-medium" : "hover:bg-gray-900"}`}
                        >
                          <span>{item.name}</span>
                        </div>

                        {/* Mobile shop subroutes */}
                        <div className="pl-6 border-l border-gray-700 ml-4 space-y-1">
                          {shopSubroutes.map((subroute) => {
                            const isSubrouteActive = pathname === subroute.path;

                            return (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className={`block py-2 px-4 text-sm ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
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

                  // Special handling for SUBSCRIPTIONS in mobile menu
                  if (item.name === "SUBSCRIPTIONS") {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`flex justify-between items-center py-3 px-4 ${isActive ? "bg-gray-800 rounded font-medium" : "hover:bg-gray-900"}`}
                        >
                          <span>{item.name}</span>
                        </div>

                        {/* Mobile subscriptions subroutes */}
                        <div className="pl-6 border-l border-gray-700 ml-4 space-y-1">
                          {subscriptionsSubroutes.map((subroute) => {
                            const isSubrouteActive = pathname === subroute.path;

                            return (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className={`block py-2 px-4 text-sm ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
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

                  // Special handling for DISCOVER in mobile menu
                  if (item.name === "DISCOVER") {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`flex justify-between items-center py-3 px-4 ${isActive ? "bg-gray-800 rounded font-medium" : "hover:bg-gray-900"}`}
                        >
                          <span>{item.name}</span>
                        </div>

                        {/* Mobile discover subroutes */}
                        <div className="pl-6 border-l border-gray-700 ml-4 space-y-1">
                          {discoverSubroutes.map((subroute) => {
                            const isSubrouteActive = pathname === subroute.path;

                            return (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className={`block py-2 px-4 text-sm ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
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

                  // Special handling for ABOUT in mobile menu
                  if (item.name === "ABOUT") {
                    return (
                      <div key={item.path} className="space-y-1">
                        <div
                          className={`flex justify-between items-center py-3 px-4 ${isActive ? "bg-gray-800 rounded font-medium" : "hover:bg-gray-900"}`}
                        >
                          <span>{item.name}</span>
                        </div>

                        {/* Mobile about subroutes */}
                        <div className="pl-6 border-l border-gray-700 ml-4 space-y-1">
                          {aboutSubroutes.map((subroute) => {
                            const isSubrouteActive = pathname === subroute.path;

                            return (
                              <Link
                                key={subroute.path}
                                href={subroute.path}
                                className={`block py-2 px-4 text-sm ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
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
                      className={`block py-3 px-4 ${isActive ? "bg-gray-800 rounded font-medium" : "hover:bg-gray-900"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Account Section for Mobile */}
              <div className="mt-6 border-t border-gray-800 pt-4 space-y-1">
                <div className="py-3 px-4">
                  <span className="text-gray-400 text-sm font-medium">MY ACCOUNT</span>
                </div>

                {/* Account options */}
                <div className="space-y-1">
                  {getAccountSubroutes(isAuthenticated, handleLogout).map((subroute: NavSubRoute) => {
                    const isSubrouteActive = pathname === subroute.path;

                    return subroute.onClick ? (
                      <button
                        key={subroute.name}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          subroute.onClick?.();
                        }}
                        className={`block py-2 px-4 text-sm text-left w-full ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                      >
                        {subroute.name}
                      </button>
                    ) : (
                      <Link
                        key={subroute.path}
                        href={subroute.path}
                        className={`block py-2 px-4 text-sm ${isSubrouteActive ? "text-white font-medium" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subroute.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
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
