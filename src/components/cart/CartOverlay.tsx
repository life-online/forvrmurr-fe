"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus, FiX, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import cartService from "../../services/cart";
import productService, { Discount, Product } from "@/services/product";

// Types
export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  quantity: number;
  productId: string;
}

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
}

const CartOverlay: React.FC<CartOverlayProps> = ({
  isOpen,
  onClose,
  cartItems,
  addToCart,
  removeFromCart,
  updateItemQuantity,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredFeaturedProducts, setFilteredFeaturedProducts] = useState<
    Product[]
  >([]);
  const [featuredQuantities, setFeaturedQuantities] = useState<
    Record<string, number>
  >({});
  const [currentDiscount, setCurrentDiscount] = useState<Discount>();
  const [amountToFreeDelivery, setAmountTodelivery] = useState<number>(0);
  const [subtotal, setSubTotal] = useState<number>(0);
  const [progressPercentage, setProgress] = useState<number>(0);

  // Available add-ons

  // For empty cart state
  // const emptyCartAddOns = [
  //   {
  //     id: "subscription-empty",
  //     name: "Monthly Fragrance Subscription",
  //     description: "Would you like to add a monthly fragrance subscription?",
  //     price: 24900, // ₦24,900
  //     options: [
  //       { id: "prime", name: "Add Prime", price: 17500 },
  //       { id: "premium", name: "Add Premium", price: 35500 },
  //     ],
  //     imageUrl: "/images/products/subscription-bottle.png",
  //   },
  // ];

  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { info, success, error: showError } = useToast();
  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchProduct = async () => {
        try {
          setLoading(true);

          // After fetching the main product, get related products
          const featuredProductsData =
            await productService.getFeaturedProducts();
          // fetch current discount
          const currentDiscount = await productService.getCurrentDiscount();
          setCurrentDiscount(currentDiscount[0]);
          // do some discount calculation
          const deliveryThreshold = parseInt(
            currentDiscount[0].minimumSubtotalValue
          ); // ₦49,000
          const subtotal = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          const amountToFreeDelivery = Math.max(
            0,
            deliveryThreshold - subtotal
          );
          const progressPercentage = Math.min(
            100,
            (subtotal / deliveryThreshold) * 100
          );

          setSubTotal(subtotal);
          setAmountTodelivery(amountToFreeDelivery);
          setProgress(progressPercentage);

          const filtered = featuredProductsData.data.filter((prod) => {
            if (!cartItems.some((ci) => ci.productId === prod.id)) {
              return prod;
            }
          });
          setFilteredFeaturedProducts(filtered);
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to load product details. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [cartItems]);

  if (!isOpen) return null;

  const navigateToShop = () => {
    router.push("/shop");
    onClose();
  };
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
  const navigateToCheckout = async () => {
    if (!isAuthenticated) {
      // Store the intended redirect path and message for the registration page
      const redirectUrl = "/shop/checkout";
      const message =
        "Please create an account or log in to complete your checkout.";
      router.push(
        `auth/register?redirect=${encodeURIComponent(
          redirectUrl
        )}&message=${encodeURIComponent(message)}`
      );
      onClose();
      return;
    }

    try {
      info("Processing your cart...");
      await cartService.initiateCheckout();
      success("Proceeding to checkout!");
      router.push("/shop/checkout");
      onClose();
    } catch (error) {
      console.error("Error initiating checkout:", error);
      let errorMessage = "Failed to initiate checkout. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showError(errorMessage);
    }
  };

  const handleAddFeaturedProduct = (product: Product) => {
    const exists = cartItems.some((ci) => ci.id === product.id);
    if (exists) {
      // removeFromCart(product.id);
    } else {
      const carddata = {
        id: product.id,
        name: product.name,
        brand: product.brand.name,
        price: Number(product.nairaPrice),
        imageUrl: product.imageUrls?.[0] || "/images/products/fallback.png",
        quantity: getFeaturedQty(product.id),
        productId: product.id,
      };
      addToCart(carddata);
    }
  };
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-xl font-serif">
            Your Next Obsession Awaits...
            {/* <span className="inline-flex items-center justify-center ml-2 w-6 h-6 rounded-full border border-[#8b0000] text-[#8b0000] text-sm">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span> */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Delivery Progress */}
        {cartItems.length > 0 && currentDiscount && (
          <div className="bg-[#faf0e2] p-4">
            <p className="text-[#8b0000] font-medium mb-1">
              {amountToFreeDelivery > 0 ? "Almost there..." : "Congratulations"}
            </p>
            <p className="text-[#8b0000] text-sm mb-2">
              {amountToFreeDelivery > 0
                ? `You are ₦${amountToFreeDelivery.toLocaleString()} away from free shipping*`
                : `You qualify for free shipping!`}
            </p>
            <div className="h-2 bg-[#f8e2c8] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-pink-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
              <h3 className="text-xl font-medium mb-2">
                Your cart is looking a little too empty.
              </h3>
              <p className="text-gray-600 mb-8">
                Don&apos;t Leave Without Your Next Obsession.
              </p>
              <button
                onClick={navigateToShop}
                className="bg-[#8b0000] text-white py-3 px-8 rounded text-sm font-medium hover:bg-[#6b0000]"
              >
                Shop All Scents
              </button>

              {/* Empty cart add-on section */}
 {/*
              <div className="mt-16 w-full">
             {emptyCartAddOns.map((addon) => (

              {/* <div className="mt-16 w-full">
                {emptyCartAddOns.map((addon) => (

                  <div
                    key={addon.id}
                    className="bg-[#faf0e2] rounded-lg p-4 mt-4 relative"
                  >
                    <div className="inline-block bg-[#f3d5b5] text-[#8b0000] px-3 py-1 rounded-full text-xs font-medium mb-2">
                      ✨ Monthly Fragrance Subscription
                    </div>

                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{addon.description}</p>
                        <p className="text-[#8b0000] font-medium">
                          $ {addon.price / 100}.00 USD
                        </p>
                      </div>
                      <div className="ml-4 relative h-24 w-24">
                        <Image
                          src={addon.imageUrl}
                          alt={addon.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                      {addon.options.map((option) => (
                        <button
                          key={option.id}
                          className={`flex-1 border border-[#8b0000] py-2 px-3 rounded ${
                            option.id === "premium"
                              ? "bg-[#8b0000] text-white"
                              : "text-[#8b0000]"
                          }`}
                        >
                          {option.name} – ₦
                          {(option.price / 100).toLocaleString()}/mo
                        </button>
                      ))}
                    </div>
                  </div>
<
             
              </div>
                ))}
              </div> 
   ))} */}
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100"
                  >
                    <div className="h-20 w-20 relative mr-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.brand}</h4>
                      <p className="text-sm text-gray-600">{item.name}</p>
                      <p className="text-sm font-medium mt-1">
                        ₦ {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateItemQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#8b0000]"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#8b0000]"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-[#8b0000] text-sm font-medium border border-[#8b0000] rounded px-3 py-1 hover:bg-[#8b0000] hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add to your order section */}
              {filteredFeaturedProducts.length > 0 && (
                <div className="mt-6 mb-4">
                  <h3 className="text-lg font-medium mb-4">
                    Add to your order
                  </h3>
                  <div className="space-y-4">
                    {filteredFeaturedProducts.map((prod, index) => (
                      <div
                        key={index}
                        className="bg-[#faf0e2] flex flex-col gap-3 rounded-lg p-4 relative"
                      >
                        <div className="inline-block bg-[#f3d5b5] w-fit text-[#8b0000] px-3 py-1 rounded-full text-xs font-medium mb-2">
                          ✨{prod.name}
                        </div>

                        <div className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            className="p-3 h-4 w-4"
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleAddFeaturedProduct(prod);
                              } else {
                                removeFromCart(prod.id);
                              }
                            }}
                          />
                          <div className="flex-1">
                            {/* <p className="font-medium">{prod.description}</p> */}
                            <div className="flex items-center justify-between  flex-wrap gap-4">
                              <div className="flex items-center border border-[#a0001e] rounded-full text-[#a0001e] font-serif text-sm py-1">
                                <button
                                  onClick={() => decreaseFeaturedQty(prod.id)}
                                  className="px-3 cursor-pointer focus:outline-none hover:bg-red-50 rounded-l-full"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="mx-2">
                                  No: {getFeaturedQty(prod.id)}
                                </span>
                                <button
                                  onClick={() => increaseFeaturedQty(prod.id)}
                                  className="px-3 cursor-pointer focus:outline-none hover:bg-red-50 rounded-r-full"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-sm font-serif text-[#a0001e] font-bold">
                              ₦{Number(prod.nairaPrice).toLocaleString()} ×{" "}
                              {getFeaturedQty(prod.id)} = ₦
                              {(
                                Number(prod.nairaPrice) *
                                getFeaturedQty(prod.id)
                              ).toLocaleString()}
                            </div>
                          </div>
                          <div className="ml-4 relative h-16 w-16">
                            <Image
                              src={prod.imageUrls[0]}
                              alt={prod.name}
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with totals and checkout button */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>₦{subtotal.toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              className="w-full bg-[#8b0000] text-white py-3 rounded text-sm font-medium hover:bg-[#6b0000] flex items-center justify-center gap-2 mb-3"
              onClick={navigateToCheckout}
            >
              <FiShoppingBag size={18} />
              Proceed to Checkout
            </button>
            <button
              className="w-full border border-[#8b0000] text-[#8b0000] py-3 rounded text-sm font-medium hover:bg-[#fff8f8] transition-colors"
              onClick={navigateToShop}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartOverlay;
