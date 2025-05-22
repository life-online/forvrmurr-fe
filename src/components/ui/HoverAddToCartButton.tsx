"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/services/product";

interface HoverAddToCartButtonProps {
  product: Product;
  className?: string;
}

const HoverAddToCartButton: React.FC<HoverAddToCartButtonProps> = ({
  product,
  className = "",
}) => {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation from parent Link
    e.stopPropagation(); // Stop event bubbling

    setIsAdding(true);

    try {
      await addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand.name,
        price: Number(product.nairaPrice),
        imageUrl: product.imageUrls?.[0] || "/images/products/fallback.png",
        productId: product.id,
        quantity: 1,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdding}
      className={`w-full bg-[#a00000] hover:bg-[#b30000] text-white py-2 rounded-lg transition-colors ${
        isLoading || isAdding ? "opacity-75 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading || isAdding ? "Adding..." : "Add to cart"}
    </button>
  );
};

export default HoverAddToCartButton;
