"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import QuantitySelector from "@/components/ui/QuantitySelector";
import ProductCard from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { toastService } from "@/services/toast";
import { AnimatePresence, motion } from "framer-motion";
import productService, { Product } from "@/services/product";
import { trackProductView } from "@/utils/analytics";
import AddToCartButton from "@/components/cart/AddToCartButton";

// Mock data for reviews
const reviews = [
  {
    id: 1,
    name: "Sarah J.",
    rating: 5,
    date: "2023-10-15",
    comment:
      "This travel case is absolutely gorgeous! The quality is exceptional and it keeps my perfumes safe during travel. Highly recommend!",
  },
  {
    id: 2,
    name: "Michael T.",
    rating: 5,
    date: "2023-09-28",
    comment:
      "Perfect size for my business trips. Elegant design and very practical. Worth every penny.",
  },
  {
    id: 3,
    name: "Amara O.",
    rating: 4,
    date: "2023-11-05",
    comment:
      "Beautiful case that fits perfectly in my handbag. The only reason for 4 stars is I wish it could hold one more vial.",
  },
];

const FALLBACK_IMAGE = "/images/hero/hero_image.png";
const TRAVEL_CASE_SLUG = "luxury-perfume-travel-case";

export default function TravelCasePage() {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const progressCircle = useRef<SVGCircleElement | null>(null);
  const progressContent = useRef<HTMLSpanElement | null>(null);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", String(1 - progress));
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: "travel-case-001",
      name: "Luxury Perfume Travel Case",
      brand: "ForvrMurr",
      price: 2300,
      imageUrl: "/images/travel-case/main-product.jpg",
      productId: "travel-case-001",
      quantity: quantity,
    });

    toastService.success("Travel case added to your cart!");
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!TRAVEL_CASE_SLUG) return;

      try {
        setLoading(true);
        const data = await productService.getProductBySlug(TRAVEL_CASE_SLUG);
        setProduct(data);

        // Track product view event for Google Analytics
        trackProductView(data);

        // After fetching the main product, get related products
        const relatedProductsResponse =
          await productService.getProductrelatedProductsById(data.id, {
            limit: 4,
          });

        console.log(relatedProductsResponse, "relatedProductsResponse");
        setRelatedProducts(relatedProductsResponse);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Calculate star rendering for reviews
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="text-yellow-500">
          {i < Math.floor(rating) ? "★" : "☆"}
        </span>
      ));
  };

  // Gallery images data
  const galleryImages = [
    {
      src: "/images/shop/travel-case/gallery/case-1.jpg",
      alt: "Luxury Perfume Travel Case - Front View",
    },
    {
      src: "/images/shop/travel-case/gallery/case-2.jpg",
      alt: "Luxury Perfume Travel Case - Open View",
    },
    {
      src: "/images/shop/travel-case/gallery/case-3.jpg",
      alt: "Luxury Perfume Travel Case with Vial",
    },
    {
      src: "/images/shop/travel-case/gallery/case-4.jpg",
      alt: "Luxury Perfume Travel Case - Side View",
    },
    {
      src: "/images/shop/travel-case/gallery/case-5.jpg",
      alt: "Luxury Perfume Travel Case - Detail View",
    },
    {
      src: "/images/shop/travel-case/gallery/case-6.jpg",
      alt: "Luxury Perfume Travel Case - Detail View",
    },
    {
      src: "/images/shop/travel-case/gallery/case-7.jpg",
      alt: "Luxury Perfume Travel Case - Detail View",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section*/}
      <section className="relative w-[96%] h-[70vh] md:h-[65vh] overflow-hidden mx-auto my-3 md:my-8 rounded-lg">
        <div className="relative w-full h-full">
          {/* Desktop Image */}
          <Image
            src="/images/shop/travel-case/travel-case-hero.jpg"
            alt="Travel Case Hero"
            fill
            priority
            className="object-cover hidden md:block"
          />

          {/* Mobile Image */}
          <Image
            src="/images/shop/travel-case/travel-case-hero-mobile.jpg"
            alt="Travel Case Hero"
            fill
            priority
            className="object-cover md:hidden"
          />

          {/* Gradient Overlay for text legibility - Desktop */}
          <div className="absolute inset-0 bg-gradient-to-r m-4 from-transparent to-black/15 z-10 hidden md:block rounded-lg"></div>

          {/* Gradient Overlay for text legibility - Mobile */}
          <div className="absolute inset-0 bg-gradient-to-b m-4 from-transparent to-black/10 z-10 md:hidden rounded-lg"></div>

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center max-w-2xl mx-auto px-4 mt-auto mb-12 md:my-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-wide text-[#8B0000] mb-4">
                Carry Your Obsession Everywhere.
              </h1>
              <p className="text-base md:text-lg font-light text-[#8B0000] max-w-2xl mx-auto">
                Secure. Made exclusively for your Forvr Murr 8ml fragrances.
              </p>
              <button className="mt-6 px-8 py-3 bg-[#a0001e] text-white font-medium rounded hover:bg-[#8b0000] transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="mb-8">
          <p className="text-[#a0001e] uppercase tracking-wider text-sm mb-1">
            PRODUCT DETAILS
          </p>
          <h1 className="font-serif text-3xl mb-2">
            Luxury Perfume Travel Case
          </h1>
          {product && (
            <p className="text-[#a0001e] text-xl font-medium">
              ₦ {Number(product.nairaPrice).toLocaleString()}
            </p>
          )}
        </div>
        {product && (
          <>
            <div className="flex-1 flex items-center justify-center">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3 mr-16 justify-center">
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
            </div>

            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-[#a0001e] rounded-sm"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  className="scale-90"
                />
              </div>
            </div>

            <AddToCartButton
              product={product}
              className="bg-[#a0001e] text-white py-3 px-8 rounded w-full max-w-xs mx-auto block mb-12"
              quantity={quantity}
              text="Add to cart"
            />
          </>
        )}

        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-700 mb-6">
            Elevate your fragrance experience with our signature perfume travel
            case—where beauty meets function. Crafted from sleek, matte-finished
            materials and detailed with gold accents, this elegant case keeps
            your favorite ForvrMurr fragrances protected and travel-ready.
          </p>
          <p className="text-gray-700 mb-8">
            Slip it discreetly into your handbag, briefcase, or pocket for
            on-the-go touch-ups. The secure magnetic closure ensures your scent
            stays safe, stylish, and ready for any moment.
          </p>
          <p className="text-[#a0001e] font-medium text-sm">
            MORE COLORS COMING SOON—STAY TUNED
          </p>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-[#f8f5f2] py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl mb-12 uppercase tracking-wide">
            Key Features & Benefits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <Image
                  src="/images/shop/travel-case/icons/elegant.png"
                  alt="Beautifully Elegant"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="font-serif text-lg mb-2">Beautifully Elegant</h3>
              <p className="text-gray-700 text-sm">
                Matte black finish with subtle gold accents—designed to
                complement any style confidently.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <Image
                  src="/images/shop/travel-case/icons/secure.png"
                  alt="Secure & Magnetic"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="font-serif text-lg mb-2">Secure & Magnetic</h3>
              <p className="text-gray-700 text-sm">
                Luxury magnetic closure keeps your fragrance vials secure within
                a velvet-lined interior.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center">
                <Image
                  src="/images/shop/travel-case/icons/portable.png"
                  alt="Made for Movement"
                  width={200}
                  height={200}
                />
              </div>
              <h3 className="font-serif text-lg mb-2">Made for Movement</h3>
              <p className="text-gray-700 text-sm">
                Fits perfectly in handbags, pockets, or travel bags—your
                signature scent goes wherever you go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl mb-12 uppercase tracking-wide">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[#a0001e] text-[#a0001e] flex items-center justify-center font-serif mb-4">
                1
              </div>
              <h3 className="font-serif text-lg mb-2 text-[#a0001e]">Open</h3>
              <p className="text-gray-700 text-sm">
                Gently pull open the luxury travel case.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[#a0001e] text-[#a0001e] flex items-center justify-center font-serif mb-4">
                2
              </div>
              <h3 className="font-serif text-lg mb-2 text-[#a0001e]">Insert</h3>
              <p className="text-gray-700 text-sm">
                Remove the lid of your ForvrMurr vial, place it inside.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[#a0001e] text-[#a0001e] flex items-center justify-center font-serif mb-4">
                3
              </div>
              <h3 className="font-serif text-lg mb-2 text-[#a0001e]">
                Snap & Go
              </h3>
              <p className="text-gray-700 text-sm">
                Close the case securely with its magnetic snap—and you're ready
                to indulge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Image Gallery */}
      <section className="bg-black py-24">
        <div className="max-w-7xl mx-auto px-4">
          <style jsx global>{`
            .gallery-swiper .swiper-slide {
              transition: all 0.4s ease;
              opacity: 0.4;
              transform: scale(0.8);
            }
            .gallery-swiper .swiper-slide-active {
              opacity: 1;
              transform: scale(1);
              z-index: 10;
            }
            .gallery-swiper .swiper-button-next,
            .gallery-swiper .swiper-button-prev {
              color: #a0001e;
              background: rgba(255, 255, 255, 0.9);
              width: 48px;
              height: 48px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            .gallery-swiper .swiper-button-next:hover,
            .gallery-swiper .swiper-button-prev:hover {
              background: #ffffff;
              transform: scale(1.05);
            }
            .gallery-swiper .swiper-button-next:after,
            .gallery-swiper .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            .gallery-swiper .swiper-pagination {
              position: relative;
              margin-top: 30px;
            }
            .gallery-swiper .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background: #ffffff;
              opacity: 0.5;
              margin: 0 6px;
            }
            .gallery-swiper .swiper-pagination-bullet-active {
              background: #a0001e;
              opacity: 1;
              transform: scale(1.2);
            }
            /* Autoplay progress bar */
            .gallery-swiper .autoplay-progress {
              position: absolute;
              right: 16px;
              bottom: 16px;
              z-index: 10;
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              color: #a0001e;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .gallery-swiper .autoplay-progress svg {
              --progress: 0;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 10;
              width: 100%;
              height: 100%;
              stroke-width: 4px;
              stroke: #a0001e;
              fill: none;
              stroke-dashoffset: calc(125.6 * (1 - var(--progress)));
              stroke-dasharray: 125.6;
              transform: rotate(-90deg);
            }
          `}</style>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            className="gallery-swiper"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[600px] w-full rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 800px"
                    quality={95}
                  />
                </div>
              </SwiperSlide>
            ))}
            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48">
                <circle ref={progressCircle} cx="24" cy="24" r="20"></circle>
              </svg>
              <span ref={progressContent}></span>
            </div>
          </Swiper>
        </div>
      </section>

      {/* Upsell Subscription Offer */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 my-16 py-16 md:py-24 bg-[#f8f5f2] rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-serif text-3xl mb-4">Subscribe & Save</h2>
            <p className="text-gray-700 mb-6">
              Join our subscription service and receive a complimentary travel
              case with your first order.
            </p>
            <Link
              href="/subscriptions/prime"
              className="bg-[#a0001e] hover:bg-[#8B0000] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 inline-block w-fit"
            >
              Get a Subscription
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl mb-12 uppercase tracking-wide">
            Customer Reviews
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[#f8f5f2] p-6 rounded">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg">{review.name}</h3>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex mb-3">{renderStars(review.rating)}</div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complementary Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-2xl mb-12 uppercase tracking-wide">
            Perfect Pairings
          </h2>

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
      </section>
    </div>
  );
}
