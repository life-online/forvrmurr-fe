"use client";

import React from 'react';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
