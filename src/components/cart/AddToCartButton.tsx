"use client";

import { useCart } from "@/context/CartContext";
import { useAnalyticsIntegration } from "@/hooks/useAnalyticsIntegration";
import { Product, ProductVariant } from "@/services/product";

interface AddToCartButtonProps {
  product: Product;
  quantity: number;
  className?: string;
  text?: string;
  selectedVariant?: ProductVariant | null;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity,
  className = "",
  text,
  selectedVariant,
}) => {
  const { addToCart } = useCart();
  const { trackAddToCart } = useAnalyticsIntegration();

  const handleAddToCart = async () => {
    // Use variant price if a variant is selected, otherwise use product price
    const price = selectedVariant ? Number(selectedVariant.price) : Number(product.nairaPrice);

    // Add the product to cart with the selected quantity and variant
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      price: price,
      imageUrl: product.imageUrls?.[0] || "/images/products/fallback.png",
      productId: product.id,
      quantity: quantity,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
    });

    // Track the add to cart event with both Google Analytics and Shopify
    await trackAddToCart({
      productId: product.id,
      variantId: selectedVariant?.id || product.id,
      sku: selectedVariant?.sku || product.slug,
      name: product.name,
      price: price,
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
