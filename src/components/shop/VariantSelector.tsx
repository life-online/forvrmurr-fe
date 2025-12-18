"use client";

import { ProductVariant } from "@/services/product";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelect,
}) => {
  // Don't render if there's only one variant or no variants
  if (!variants || variants.length <= 1) {
    return null;
  }

  // Sort variants by position
  const sortedVariants = [...variants].sort((a, b) => a.position - b.position);

  return (
    <div>
      <h3 className="font-serif text-xl font-semibold text-gray-900 mb-4">
        Select Size
      </h3>
      <div className="flex flex-wrap gap-3">
        {sortedVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.inventoryQuantity === 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && onSelect(variant)}
              disabled={isOutOfStock}
              className={`
                px-5 md:px-8 py-2 rounded-xl border font-serif font-medium transition-colors
                ${
                  isSelected
                    ? "border-[#a0001e] bg-[#a0001e] text-white"
                    : isOutOfStock
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[#a0001e] hover:text-[#a0001e]"
                }
              `}
            >
              {variant.title}
              {isOutOfStock && (
                <span className="ml-2 text-sm">(Out of Stock)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
