"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import productService, { Product, ProductAttribute } from "@/services/product";
import ProductBadge from "@/components/ui/ProductBadge";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductCard from "@/components/ui/ProductCard";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { findNotesImageLocally } from "@/utils/helpers";
import { trackProductView } from "@/utils/analytics";
import OutOfStockBadge from "@/components/ui/OutOfStockBadge";
import NotifyMeModal from "@/components/ui/NotifyMeModal";

// Fallback image paths
const FALLBACK_IMAGE = "/images/hero/hero_image.png";
const FALLBACK_NOTE_IMAGE = "/images/scent_notes/default.png";

// Type augmentation for Note to include imageUrl property
declare module "@/services/product" {
  interface Note {
    imageUrl?: string;
  }
}

// User description tags - these could come from API in the future

// Format concentration from camelCase or snake_case to proper display format
const formatConcentration = (concentration: string | null): string => {
  if (!concentration) return '';
  
  // Handle snake_case format
  if (concentration.includes('_')) {
    return concentration
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle camelCase format
  return concentration
    // Insert a space before all uppercase letters
    .replace(/([A-Z])/g, ' $1')
    // Capitalize the first letter and join the string
    .replace(/^./, (str) => str.toUpperCase())
    // Capitalize 'de' in phrases like 'Eau De Parfum'
    .replace(/ De /g, ' de ');
};

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mainQuantity, setMainQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [prodDescriptions, setProductDescription] = useState<
    ProductAttribute[]
  >([]);
  const [featuredQuantities, setFeaturedQuantities] = useState<
    Record<string, number>
  >({});
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  // Fetch the product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
        
        // Track product view event for Google Analytics
        trackProductView(data);
        
        const featuredProductsData = await productService.getFeaturedProducts();
        setFeaturedProducts(featuredProductsData.data);

        // After fetching the main product, get related products
        const relatedProductsResponse =
          await productService.getProductrelatedProductsById(data.id, {
            limit: 4,
          });

        console.log(relatedProductsResponse, "relatedProductsResponse");
        setRelatedProducts(relatedProductsResponse);
        const descriptionsByOthers =
          await productService.getProductDescriptionByOthers(data.id);
        console.log(descriptionsByOthers, "grileo");
        setProductDescription(descriptionsByOthers.attributes);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Handle quantity changes
  const increaseQuantity = () => setMainQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setMainQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const getFeaturedQty = (id: string | number) => featuredQuantities[id] || 1;

  const increaseFeaturedQty = (id: string | number) => {
    setFeaturedQuantities((prev) => ({
      ...prev,
      [id]: getFeaturedQty(id) + 1,
    }));
  };

  const decreaseFeaturedQty = (id: string | number) => {
    setFeaturedQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, getFeaturedQty(id) - 1),
    }));
  };
  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <div className="animate-pulse">
          <div className="h-72 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
          <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-80 bg-gray-200 rounded mx-auto"></div>
        </div>
        <p className="mt-8 text-gray-500">Loading product details...</p>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="w-full py-20 text-center">
        <h2 className="text-2xl text-red-800 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-700 mb-8">{error || "Product not found"}</p>
        <Link
          href="/shop"
          className="bg-[#a0001e] text-white px-6 py-2 rounded-lg hover:bg-[#800018] transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="pb-24">
        {/* Top Section */}
        <div className="w-full pt-16 pb-16 md:pb-24" style={{ background: "#F7EDE1" }}>
          <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-8 pt-10 pb-10 px-4">
            {/* Product Image and Thumbnails */}
            <div className="flex-1 flex flex-col items-center">
              {/* Main Image with Animation */}
              <div className="relative w-full h-[28rem] md:w-[24rem] md:h-[28rem] mb-6 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={
                        product.imageUrls?.[selectedImageIndex] ||
                        FALLBACK_IMAGE
                      }
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      quality={90}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-4 justify-center">
                {(product.imageUrls?.length
                  ? product.imageUrls
                  : [FALLBACK_IMAGE]
                ).map((img, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 bg-white overflow-hidden rounded flex items-center justify-center border cursor-pointer transition-all
                    ${
                      selectedImageIndex === i
                        ? "border-[#a0001e] ring-2 ring-[#a0001e]/50 shadow-md"
                        : "border-gray-200 hover:border-[#a0001e]/30"
                    }`}
                    onClick={() => handleThumbnailClick(i)}
                  >
                    <Image
                      src={img || FALLBACK_IMAGE}
                      alt={`${product.name} - view ${i + 1}`}
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Product Info */}
            <div className="flex-1 bg-white rounded-xl p-4 sm:p-5 lg:p-8 flex flex-col justify-between min-h-[400px] shadow text-black my-6 sm:my-10">
              <div>
                <div className="mb-2 inline-block">
                  <div className="flex flex-wrap gap-2">
                    {product.type === "premium" ? (
                      <ProductBadge
                        type="premium"
                        className="relative top-0 left-0"
                      />
                    ) : (
                      <ProductBadge
                        type="prime"
                        className="relative top-0 left-0"
                      />
                    )}
                    
                    {/* Display out of stock badge when inventory is zero */}
                    {product.inventoryQuantity <= 0 && (
                      <OutOfStockBadge />
                    )}
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
                  {product.brand?.name}
                </h1>
                <div className="text-base sm:text-lg font-serif mb-2">
                  {product.name} {formatConcentration(product.concentration)}
                </div>
                <div className="text-gray-700 mb-8 leading-relaxed">
                  {product.description}
                </div>
                {/* Quantity and Price Row */}
                <div className="mt-8 space-y-8">
                  {/* Main Product Section */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-16 relative">
                        <Image
                          src="/images/products/grand_soir.png"
                          alt="8ml Bottle"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-gray-900">
                          8ml Bottle
                        </h3>
                        <p className="text-sm text-gray-600">
                          Forvr Murr Pricing
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex items-center gap-6">
                        {/* Price Display */}
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          ₦{Number(product.nairaPrice).toLocaleString()}
                        </div>
                        
                        {/* Quantity Selector */}
                        <QuantitySelector
                          quantity={mainQuantity}
                          onIncrease={increaseQuantity}
                          onDecrease={decreaseQuantity}
                        />
                      </div>

                      {/* Add to Cart Button or Notify Me Button */}
                      {product.inventoryQuantity <= 0 ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsNotifyModalOpen(true);
                            console.log('Opening notify modal');
                          }}
                          className="bg-gray-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto"
                        >
                          Notify Me When Available
                        </button>
                      ) : (
                        <AddToCartButton
                          product={product}
                          className="bg-[#a0001e] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:bg-[#800018] transition-colors font-medium w-full sm:w-auto"
                          quantity={mainQuantity}
                        />
                      )}
                    </div>

                    {/* Total Price (only show if quantity > 1) */}
                    {mainQuantity > 1 && (
                      <div className="mt-4 text-right">
                        <p className="text-sm text-gray-600">
                          Total: <span className="font-semibold text-gray-900">
                            ₦{(Number(product.nairaPrice) * mainQuantity).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add-On Products Section */}
                  {featuredProducts && featuredProducts.length > 0 && (
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-gray-900 mb-6">
                        Add-On Products
                      </h3>
                      <div className="space-y-6">
                        {featuredProducts.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-12 relative">
                                <Image
                                  src="/images/products/TVC_1.png"
                                  alt={item.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {item.brand?.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                              <div className="flex items-center gap-4 sm:gap-6">
                                {/* Price Display */}
                                <div className="text-base sm:text-lg font-semibold text-gray-900">
                                  ₦{Number(item.nairaPrice).toLocaleString()}
                                </div>
                                
                                {/* Quantity Selector */}
                                <QuantitySelector
                                  quantity={getFeaturedQty(item.id)}
                                  onIncrease={() => increaseFeaturedQty(item.id)}
                                  onDecrease={() => decreaseFeaturedQty(item.id)}
                                />
                              </div>

                              {/* Add to Cart Button or Notify Me Button for featured products */}
                              {item.inventoryQuantity <= 0 ? (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsNotifyModalOpen(true);
                                    setProduct(item);
                                    console.log('Opening notify modal for featured product');
                                  }}
                                  className="bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto text-sm"
                                >
                                  Notify Me
                                </button>
                              ) : (
                                <AddToCartButton
                                  product={item}
                                  className="bg-gray-100 text-gray-900 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300 w-full sm:w-auto"
                                  quantity={getFeaturedQty(item.id)}
                                />
                              )}
                            </div>

                            {/* Total Price (only show if quantity > 1) */}
                            {getFeaturedQty(item.id) > 1 && (
                              <div className="mt-3 text-right">
                                <p className="text-sm text-gray-600">
                                  Total: <span className="font-semibold text-gray-900">
                                    ₦{(Number(item.nairaPrice) * getFeaturedQty(item.id)).toLocaleString()}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fragrance Story */}
        <div className="max-w-[80%] md:max-w-[55%] mx-auto text-center mt-12 md:mt-24 px-4">
          <h2 className="text-2xl md:text-3xl font-serif text-[#a0001e] mb-12">
            Fragrance Story
          </h2>
          <div className="text-xl md:text-2xl font-serif text-black mb-8">
            {product.fragranceStory || product.description}
          </div>
          <div className="text-gray-800 my-4">
            Learn more about the top, middle, and bottom notes in this
            fragrance.
          </div>
        </div>

        {/* Notes Section */}
        <div className="max-w-4xl mx-auto mt-16 pb-8 mb-24 px-4">
          <div className="flex flex-col justify-center gap-12">
            {/* Top Notes */}
            {product.topNotes && product.topNotes.length > 0 && (
              <div className="flex-1 mb-8">
                <div className="text-center text-[#a0001e] text-xl font-serif mb-8 md:mb-10">
                  Top
                </div>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-10">
                  {product.topNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center text-center w-24">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
                        <Image
                          src={`/images${note?.iconUrl}` || FALLBACK_NOTE_IMAGE}
                          alt={note.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-serif text-sm md:text-base text-gray-700 break-words">
                        {note.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Middle Notes */}
            {product.middleNotes && product.middleNotes.length > 0 && (
              <div className="flex-1 mb-8">
                <div className="text-center text-[#a0001e] text-xl font-serif mb-8 md:mb-10">
                  Middle
                </div>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-10">
                  {product.middleNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center text-center w-24">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
                        <Image
                          src={`/images${note?.iconUrl}` || FALLBACK_NOTE_IMAGE}
                          alt={note.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-serif text-sm md:text-base text-gray-700 break-words">
                        {note.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Base Notes */}
            {product.baseNotes && product.baseNotes.length > 0 && (
              <div className="flex-1 mb-8">
                <div className="text-center text-[#a0001e] text-xl font-serif mb-8 md:mb-10">
                  Base
                </div>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-10">
                  {product.baseNotes.map((note) => (
                    <div key={note.id} className="flex flex-col items-center text-center w-24">
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
                        <Image
                          src={`/images${note?.iconUrl}` || FALLBACK_NOTE_IMAGE}
                          alt={note.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-serif text-sm md:text-base text-gray-700 break-words">
                        {note.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Description Tags */}
        <div className="max-w-7xl mx-auto md:mt-16 mt-12 md:pt-16 md:mb-32 md:pb-12 mb-16 px-4">
          <h3 className="text-2xl md:text-3xl font-serif text-[#a0001e] text-center md:mb-16 mb-8">
            Here&apos;s How Others Described the Scent
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {prodDescriptions.map((tag) => (
              <div key={tag.id} className="flex flex-col items-center">
                <div className="w-28 h-16 overflow-hidden bg-gray-100 rounded-xl flex items-center justify-center mb-2 font-serif text-lg">
                  <Image
                    src={`/images${tag.iconUrl}` || FALLBACK_NOTE_IMAGE}
                    alt="Description Tag"
                    width={1000}
                    height={1000}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-base font-serif text-gray-700 text-center">
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* People Also Loved */}
        {relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto  mt-24 mb-16 px-4">
            <h3 className="text-2xl md:text-3xl font-serif text-[#a0001e] text-center md:mb-16 mb-12">
            People Also Loved
          </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((prod, index) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  priorityLoading={index < 2}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          // Restore the main product if we were showing a featured product
          if (product && slug && product.slug !== slug) {
            const fetchOriginalProduct = async () => {
              try {
                const data = await productService.getProductBySlug(slug);
                setProduct(data);
              } catch (err) {
                console.error("Error restoring original product:", err);
              }
            };
            fetchOriginalProduct();
          }
        }}
        product={product}
      />
      
    </>
  );
}
