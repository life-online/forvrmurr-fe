"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem } from "@/components/cart/CartOverlay";
import { useAuth } from "./AuthContext";
import cartService, { CartResponseDto, CartItemDto } from "@/services/cart";
import { useToast } from "./ToastContext";
import posthog from "posthog-js";

interface CartContextType {
  cartItems: CartItem[] | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  itemCount: number;
  isLoading: boolean;
  cart?: CartResponseDto;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[] | null>(null);
  const [cart, setCart] = useState<CartResponseDto | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { error } = useToast();

  const itemCount = cartItems?.reduce((count, item) => count + item.quantity, 0) || 0;

  // Fetch cart from backend API - simplified with automatic authentication
  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        // Cart service now handles authentication automatically
        const cartResponse = await cartService.getCart();
        setCart(cartResponse);

        // Map backend cart items to frontend CartItem format
        const mappedItems: CartItem[] = cartResponse.items.map(
          (item: CartItemDto) => ({
            id: item.id,
            name: item.product.name,
            brand: item.product.name.split(" ")[0], // Just a guess, adjust based on your data
            price: parseFloat(item.price),
            imageUrl: item.product.imageUrl || null,
            quantity: item.quantity,
            productId: item.product.id,
            variantId: item.variantId,
            variantTitle: item.variantTitle,
          })
        );

        setCartItems(mappedItems);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        // If API fails, fallback to empty cart
        setCartItems(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user]); // Only depend on user changes

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  
  // Method to explicitly refresh the cart data from the backend
  const refreshCart = async () => {
    setIsLoading(true);
    try {
      // Simplified - cart service handles authentication
      const cartResponse = await cartService.getCart();
      setCart(cartResponse);
      
      // Map backend cart items to frontend CartItem format
      const mappedItems: CartItem[] = cartResponse.items.map(
        (item: CartItemDto) => ({
          id: item.id,
          name: item.product.name,
          brand: item.product.name.split(" ")[0], // Just a guess, adjust based on your data
          price: parseFloat(item.price),
          imageUrl: item.product.imageUrl || null,
          quantity: item.quantity,
          productId: item.product.id,
          variantId: item.variantId,
          variantTitle: item.variantTitle,
        })
      );

      setCartItems(mappedItems);
    } catch (err) {
      console.error("Failed to refresh cart:", err);
      // If API fails, keep existing cart state
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (newItem: CartItem) => {
    setIsLoading(true);
    try {
      // Simplified - cart service handles authentication
      const response = await cartService.addItemToCart({
        productId: newItem.productId,
        quantity: newItem.quantity,
        variantId: newItem.variantId,
      });

      setCart(response);

      // Map backend cart items to frontend CartItem format
      const mappedItems: CartItem[] = response.items.map(
        (item: CartItemDto) => ({
          id: item.id,
          name: item.product.name,
          brand: item.product.name.split(" ")[0], // Adjust based on actual data
          price: parseFloat(item.price),
          imageUrl:
            item.product.imageUrl ||
            `/images/products/${item.product.slug}.png`,
          quantity: item.quantity,
          productId: item.product.id,
          variantId: item.variantId,
          variantTitle: item.variantTitle,
        })
      );

      setCartItems(mappedItems);

      // PostHog: Track add to cart event
      posthog.capture("product_added_to_cart", {
        product_id: newItem.productId,
        product_name: newItem.name,
        brand: newItem.brand,
        price: newItem.price,
        quantity: newItem.quantity,
        variant_id: newItem.variantId,
        variant_title: newItem.variantTitle,
        cart_total: response.total,
        cart_item_count: response.items.length,
      });

      // Open cart when adding an item
      openCart();
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      error?.("Could not add item to cart. Please try again.");

      // PostHog: Capture error
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    try {
      // Simplified - cart service handles authentication
      const response = await cartService.removeItemFromCart(itemId);
      
      setCart(response);

      // Map backend cart items to frontend CartItem format
      const mappedItems: CartItem[] = response.items.map(
        (item: CartItemDto) => ({
          id: item.id,
          name: item.product.name,
          brand: item.product.name.split(" ")[0], // Adjust based on actual data
          price: parseFloat(item.price),
          imageUrl:
            item.product.imageUrl ||
            `/images/products/${item.product.slug}.png`,
          quantity: item.quantity,
          productId: item.product.id,
          variantId: item.variantId,
          variantTitle: item.variantTitle,
        })
      );

      setCartItems(mappedItems);

      // PostHog: Track remove from cart event
      posthog.capture("product_removed_from_cart", {
        item_id: itemId,
        cart_total: response.total,
        cart_item_count: response.items.length,
      });
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      error?.("Could not remove item from cart. Please try again.");

      // PostHog: Capture error
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) return;

    setIsLoading(true);
    try {
      // Simplified - cart service handles authentication
      const response = await cartService.updateItemQuantity(itemId, quantity);
      
      setCart(response);

      // Map backend cart items to frontend CartItem format
      const mappedItems: CartItem[] = response.items.map(
        (item: CartItemDto) => ({
          id: item.id,
          name: item.product.name,
          brand: item.product.name.split(" ")[0], // Adjust based on actual data
          price: parseFloat(item.price),
          imageUrl:
            item.product.imageUrl ||
            `/images/products/${item.product.slug}.png`,
          quantity: item.quantity,
          productId: item.product.id,
          variantId: item.variantId,
          variantTitle: item.variantTitle,
        })
      );

      setCartItems(mappedItems);
    } catch (err) {
      console.error("Failed to update item quantity:", err);
      error?.("Could not update quantity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      // Simplified - cart service handles authentication
      const response = await cartService.clearCart();

      setCart(response);
      setCartItems(null);

      // PostHog: Track cart cleared event
      posthog.capture("cart_cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      error?.("Could not clear cart. Please try again.");

      // PostHog: Capture error
      posthog.captureException(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        refreshCart,
        itemCount,
        isLoading,
        cart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
