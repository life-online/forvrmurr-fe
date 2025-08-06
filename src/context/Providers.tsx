"use client";

import React from 'react';
import { CartProvider } from './CartContext';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { useAppInitialization } from '@/hooks/useAppInitialization';

interface ProvidersProps {
  children: React.ReactNode;
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  useAppInitialization();
  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppInitializer>
          <CartProvider>
            {children}
          </CartProvider>
        </AppInitializer>
      </AuthProvider>
    </ToastProvider>
  );
}
