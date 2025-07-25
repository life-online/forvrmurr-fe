"use client";

import React from "react";
import Link from "next/link";
import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* <li><Link href="/#" className="hover:text-white">New Arrivals</Link></li>
              <li><Link href="/#" className="hover:text-white">Bestsellers</Link></li> */}
              <li>
                <Link href="/shop?type=prime" className="hover:text-white">
                  Prime Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?type=premium" className="hover:text-white">
                  Premium Collection
                </Link>
              </li>
              {/* <li><Link href="/gift-cards" className="hover:text-white">Gift Cards</Link></li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">About</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about/story" className="hover:text-white">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Meet the Founders
                </Link>
              </li>
              <li>
                <Link href="/about/faq" className="hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Discover</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {/* <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li> */}
              <li>
                <Link href="/coming-soon" className="hover:text-white">
                  Take the Scent Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/discover/why-decants"
                  className="hover:text-white"
                >
                  Why Choose Decants
                </Link>
              </li>
              <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/forvrmurr/?igsh=M2FnaXhxaTljMDY2#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FiInstagram size={20} className="hover:text-gray-300" />
              </a>
              <a
                href="https://web.facebook.com/profile.php?id=61574755126571"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FiFacebook size={20} className="hover:text-gray-300" />
              </a>
              <a
                href="https://x.com/forvrmurr?s=11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FiTwitter size={20} className="hover:text-gray-300" />
              </a>
              <a
                href="https://www.tiktok.com/@forvrmurr?_t=ZM-8wiBQFH3OAY&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTiktok size={20} className="hover:text-gray-300" />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for exclusive offers and fragrance
              tips.
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
