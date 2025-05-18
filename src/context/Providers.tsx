"use client";

import React from 'react';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ToastProvider>
  );
}
