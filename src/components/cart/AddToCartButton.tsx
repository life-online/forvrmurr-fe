"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/services/product";
import { trackAddToCart } from "@/utils/analytics";

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
  className?: string;
  text?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  className = "",
  text,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Add the product to cart with the selected quantity
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      price: Number(product.nairaPrice),
      imageUrl: product.imageUrls?.[0] || "/images/products/fallback.png",
      productId: product.id,
      quantity: quantity,
    });
    
    // Track the add to cart event with Google Analytics
    trackAddToCart(product, quantity);
  };

  const buttonText = `Add ${quantity > 1 ? `${quantity} items` : "to cart"}`;

  return (
    <button
      onClick={handleAddToCart}
      className={`border text-sm border-[#a0001e] text-[#a0001e] rounded-xl px-5 md:px-8 py-2 font-serif font-medium hover:bg-[#a0001e] hover:text-white transition-colors ${className}`}
    >
      {text ? text : buttonText}
    </button>
  );
};

export default AddToCartButton;
