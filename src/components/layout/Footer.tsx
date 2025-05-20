"use client";

import React from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/new" className="hover:text-white">New Arrivals</Link></li>
              <li><Link href="/bestsellers" className="hover:text-white">Bestsellers</Link></li>
              <li><Link href="/prime" className="hover:text-white">Prime Collection</Link></li>
              <li><Link href="/premium" className="hover:text-white">Premium Collection</Link></li>
              <li><Link href="/gift-cards" className="hover:text-white">Gift Cards</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">About</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/our-story" className="hover:text-white">Our Story</Link></li>
              <li><Link href="/ingredients" className="hover:text-white">Ingredients</Link></li>
              <li><Link href="/sustainability" className="hover:text-white">Sustainability</Link></li>
              <li><Link href="/ethics" className="hover:text-white">Ethics</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Help</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping & Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FiInstagram size={20} className="hover:text-gray-300" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FiFacebook size={20} className="hover:text-gray-300" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter size={20} className="hover:text-gray-300" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for exclusive offers and fragrance tips.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ForvrMurr. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* <img src="/payment-visa.svg" alt="Visa" className="h-6" />
            <img src="/payment-mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/payment-paypal.svg" alt="PayPal" className="h-6" />
            <img src="/payment-apple.svg" alt="Apple Pay" className="h-6" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
