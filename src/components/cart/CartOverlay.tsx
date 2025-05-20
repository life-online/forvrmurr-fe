"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMinus, FiPlus, FiX } from 'react-icons/fi';

// Types
export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'travel_case' | 'subscription' | 'gift';
}

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({
  isOpen,
  onClose,
  cartItems,
  addToCart,
  removeFromCart,
  updateItemQuantity,
}) => {
  // Delivery threshold calculation
  const deliveryThreshold = 49000; // ₦49,000
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const amountToFreeDelivery = Math.max(0, deliveryThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / deliveryThreshold) * 100);

  // Available add-ons
  const addOns: CartAddOn[] = [
    {
      id: 'travel-case',
      name: 'Perfume Travel Case',
      description: 'Add our perfume travel case',
      price: 24900, // ₦24,900
      imageUrl: '/images/products/TVC_1.png',
      type: 'travel_case'
    },
    // {
    //   id: 'subscription',
    //   name: 'Monthly Fragrance Subscription',
    //   description: 'Would you like to add a monthly fragrance subscription? Free travel case with your first order.',
    //   price: 24900, // ₦24,900
    //   imageUrl: '/images/products/subscription-bottle.png',
    //   type: 'subscription'
    // },
    // {
    //   id: 'gift',
    //   name: 'Gift Love Ones',
    //   description: 'Is this a gift? We\'ll wrap it with love and add a personal message too.',
    //   price: 24900, // ₦24,900
    //   imageUrl: '/images/products/gift-wrap.png',
    //   type: 'gift'
    // },
  ];

  // For empty cart state
  const emptyCartAddOns = [
    {
      id: 'subscription-empty',
      name: 'Monthly Fragrance Subscription',
      description: 'Would you like to add a monthly fragrance subscription?',
      price: 24900, // ₦24,900
      options: [
        { id: 'prime', name: 'Add Prime', price: 17500 },
        { id: 'premium', name: 'Add Premium', price: 35500 }
      ],
      imageUrl: '/images/products/subscription-bottle.png',
    }
  ];

  const router = useRouter();

  if (!isOpen) return null;

  const navigateToShop = () => {
    router.push('/shop');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-serif">Your Next Obsession Awaits... 
            {/* <span className="inline-flex items-center justify-center ml-2 w-6 h-6 rounded-full border border-[#8b0000] text-[#8b0000] text-sm">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span> */}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Delivery Progress */}
        <div className="bg-[#faf0e2] p-4">
          <p className="text-[#8b0000] font-medium mb-1">{amountToFreeDelivery > 0 ? 'Almost there...' : 'Congratulations'}</p>
          <p className="text-[#8b0000] text-sm mb-2">
            {amountToFreeDelivery > 0 
              ? `You are ₦${(amountToFreeDelivery/100).toLocaleString()} away from free delivery*` 
              : 'You qualify for free delivery!'}
          </p>
          <div className="h-2 bg-[#f8e2c8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium mb-2">Your cart is looking a little too empty.</h3>
              <p className="text-gray-600 mb-8">Don&apos;t Leave Without Your Next Obsession.</p>
              <button 
                onClick={navigateToShop}
                className="bg-[#8b0000] text-white py-3 px-8 rounded text-sm font-medium hover:bg-[#6b0000]"
              >
                Shop All Scents
              </button>
              
              {/* Empty cart add-on section */}
              <div className="mt-16 w-full">
                {emptyCartAddOns.map(addon => (
                  <div key={addon.id} className="bg-[#faf0e2] rounded-lg p-4 mt-4 relative">
                    <div className="inline-block bg-[#f3d5b5] text-[#8b0000] px-3 py-1 rounded-full text-xs font-medium mb-2">
                      ✨ Monthly Fragrance Subscription
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{addon.description}</p>
                        <p className="text-[#8b0000] font-medium">$ {addon.price/100}.00 USD</p>
                      </div>
                      <div className="ml-4 relative h-24 w-24">
                        <Image
                          src={addon.imageUrl}
                          alt={addon.name}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-4">
                      {addon.options.map(option => (
                        <button 
                          key={option.id}
                          className={`flex-1 border border-[#8b0000] py-2 px-3 rounded ${
                            option.id === 'premium' 
                              ? 'bg-[#8b0000] text-white' 
                              : 'text-[#8b0000]'
                          }`}
                        >
                          {option.name} – ₦{(option.price/100).toLocaleString()}/mo
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center py-4 border-b border-gray-100">
                    <div className="h-20 w-20 relative mr-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.brand}</h4>
                      <p className="text-sm text-gray-600">{item.name}</p>
                      <p className="text-sm font-medium mt-1">$ {item.price/100}.00 USD</p>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateItemQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#8b0000]"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#8b0000]"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-[#8b0000] text-sm font-medium border border-[#8b0000] rounded px-3 py-1 hover:bg-[#8b0000] hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add to your order section */}
              <div className="mt-6 mb-4">
                <h3 className="text-lg font-medium mb-4">Add to your order</h3>
                <div className="space-y-4">
                  {addOns.map(addon => (
                    <div key={addon.id} className="bg-[#faf0e2] rounded-lg p-4 relative">
                      <div className="inline-block bg-[#f3d5b5] text-[#8b0000] px-3 py-1 rounded-full text-xs font-medium mb-2">
                        {addon.type === 'travel_case' && '✨ Perfume Travel Case'}
                        {addon.type === 'subscription' && '✨ Monthly Fragrance Subscription'}
                        {addon.type === 'gift' && '🎁 Gift Love Ones'}
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center mr-4">
                          {/* This would be a checkbox in a real implementation */}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{addon.description}</p>
                          <p className="text-[#8b0000] font-medium">$ {addon.price/100}.00 USD</p>
                        </div>
                        <div className="ml-4 relative h-16 w-16">
                          <Image
                            src={addon.imageUrl}
                            alt={addon.name}
                            fill
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">$ {subtotal/100}.00 USD</span>
            </div>
            
            <div className="space-y-2">
              <button className="w-full bg-[#8b0000] text-white py-3 rounded font-medium hover:bg-[#6b0000]">
                Proceed to checkout
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50">
                No thanks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
