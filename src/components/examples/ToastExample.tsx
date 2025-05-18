"use client";

import React from 'react';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';

/**
 * Example component demonstrating how to use toast notifications
 * in various application scenarios
 */
export default function ToastExample() {
  const toast = useToast();

  // Example: Form submission with success and error handling
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      // Example API call
      // await api.post('/orders', { productId: 123, quantity: 1 });
      
      // Show success toast only after successful operation
      toast.success('Your order has been placed successfully!');
      
      // Additional actions after success...
    } catch (error) {
      // Show error toast with specific message
      toast.error('Failed to place your order. Please try again.');
      console.error(error);
    }
  };

  // Example: Add to cart with immediate feedback
  const handleAddToCart = (productId: number) => {
    try {
      // Add to cart logic here
      // addToCart({ id: productId, name: 'Product Name', price: 1999 });
      
      toast.success('Item added to your cart');
    } catch (error) {
      toast.error('Could not add item to cart');
    }
  };

  // Example: User action confirmation
  const handleAccountUpdate = () => {
    // Account update logic
    toast.info('Your account information has been updated');
  };

  // Example: Warning before destructive action
  const handleDeleteItem = () => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    
    if (confirmed) {
      // Delete logic
      toast.warning('Item has been removed');
    }
  };

  // Example: Temporary operation message
  const handleExportData = () => {
    const toastId = toast.info('Preparing your data for export...', {
      autoClose: false, // Stay open until dismissed
    });
    
    // Simulate long operation
    setTimeout(() => {
      // Dismiss the "preparing" toast
      toast.dismiss(toastId);
      // Show completion toast
      toast.success('Your data has been exported successfully!');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Toast Notification Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => toast.success('This is a success message!')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={() => toast.error('This is an error message!')}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={() => toast.info('This is an information message!')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Show Info Toast
        </button>
        
        <button
          onClick={() => toast.warning('This is a warning message!')}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={handleExportData}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 col-span-1 md:col-span-2"
        >
          Show Progress Toast Example
        </button>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Typical Usage Examples</h3>
        
        <form onSubmit={handleFormSubmit} className="mb-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Simulate Form Submission
          </button>
        </form>
        
        <button
          onClick={() => handleAddToCart(123)}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 mr-2"
        >
          Add to Cart Example
        </button>
        
        <button
          onClick={handleAccountUpdate}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 mr-2"
        >
          Update Account Example
        </button>
        
        <button
          onClick={handleDeleteItem}
          className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700"
        >
          Delete Item Example
        </button>
      </div>
    </div>
  );
}
