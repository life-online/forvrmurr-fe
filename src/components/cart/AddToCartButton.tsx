"use client";

import { useCart } from "@/context/CartContext";
import { useAnalyticsIntegration } from "@/hooks/useAnalyticsIntegration";
import { Product } from "@/services/product";

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
  const { trackAddToCart } = useAnalyticsIntegration();

  const handleAddToCart = async () => {
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

    // Track the add to cart event with both Google Analytics and Shopify
    await trackAddToCart({
      productId: product.id,
      variantId: product.id, // Use product ID as variant ID
      sku: product.slug,
      name: product.name,
      price: Number(product.nairaPrice),
      quantity: quantity,
      category: product.categories?.[0]?.name || 'Fragrance',
    });
  };

  const buttonText = `Add ${quantity > 1 ? `${quantity} items` : "to cart"}`;

  return (
    <button
      onClick={handleAddToCart}
      className={`border text border-[#a0001e] text-[#a0001e] rounded-xl px-5 md:px-8 py-2 font-serif font-medium hover:bg-[#a0001e] hover:text-white transition-colors ${className}`}
    >
      {text ? text : buttonText}
    </button>
  );
};

export default AddToCartButton;
