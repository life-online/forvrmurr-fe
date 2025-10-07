'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface WishlistContextType {
  refreshWishlist?: () => void;
  removeItemOptimistically?: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType>({});

export const useWishlist = () => {
  return useContext(WishlistContext);
};

interface WishlistProviderProps {
  children: ReactNode;
  refreshWishlist?: () => void;
  removeItemOptimistically?: (productId: string) => void;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
  refreshWishlist,
  removeItemOptimistically,
}) => {
  const value = {
    refreshWishlist,
    removeItemOptimistically,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};