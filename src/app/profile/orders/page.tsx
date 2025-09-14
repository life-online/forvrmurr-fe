"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPackage, FiTruck, FiCheck, FiClock, FiSearch, FiChevronLeft, FiChevronRight, FiCreditCard, FiLoader, FiEye } from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';
import orderService, { Order, OrderStatus, OrderFilterParams } from '@/services/orders';
import cartService from '@/services/cart';
import { toastService } from '@/services/toast';
import { useCart } from '@/context/CartContext';


const statusConfig: Record<OrderStatus, { color: string; icon: any; label: string }> = {
  pending: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiClock, label: 'Pending' },
  payment_processing: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiCreditCard, label: 'Processing Payment' },
  paid: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiCheck, label: 'Paid' },
  processing: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiPackage, label: 'Processing' },
  shipped: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiTruck, label: 'Shipped' },
  delivered: { color: 'bg-[#f0ebe5] text-[#8B0000]', icon: FiCheck, label: 'Delivered' },
  cancelled: { color: 'bg-gray-100 text-gray-600', icon: FiClock, label: 'Cancelled' },
  refunded: { color: 'bg-gray-100 text-gray-600', icon: FiCreditCard, label: 'Refunded' },
  sync_failed: { color: 'bg-gray-100 text-gray-600', icon: FiClock, label: 'Sync Failed' }
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false); // Separate search loading state
  const [reorderLoading, setReorderLoading] = useState<string | null>(null); // Track which order is being reordered
  const [payNowLoading, setPayNowLoading] = useState<string | null>(null); // Track which order is being paid
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchInput, setSearchInput] = useState(''); // Local search input state
  const [filters, setFilters] = useState<OrderFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  const fetchOrders = useCallback(async (filterParams: OrderFilterParams, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setSearchLoading(true);
    }
    try {
      const response = await orderService.getMyOrders(filterParams);
      console.log('API Response:', response); // Debug log

      // Handle the actual API response structure
      if (response.data && response.meta) {
        // Actual API structure: { data: [...], meta: {...} }
        setOrders(response.data);
        setCurrentPage(response.meta.currentPage || 1);
        setTotalPages(response.meta.totalPages || 1);
        setTotalOrders(response.meta.totalItems || 0);
      } else if (response.orders) {
        // Expected structure from documentation
        setOrders(response.orders);
        setCurrentPage(response.pagination?.page || 1);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalOrders(response.pagination?.total || 0);
      } else if (Array.isArray(response)) {
        // If response is directly an array
        setOrders(response);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalOrders(response.length);
      } else {
        // Handle unexpected structure
        console.warn('Unexpected response structure:', response);
        setOrders([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalOrders(0);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotalOrders(0);
      toastService.error('Failed to load orders. Please try again.');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setSearchLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const shouldBeInitialLoad = isInitialLoad.current;
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
    fetchOrders(filters, shouldBeInitialLoad);
  }, [fetchOrders, filters]);

  const handleFilterChange = (newFilters: Partial<OrderFilterParams>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters,
      page: 1 // Reset to first page when filtering
    };
    setFilters(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = {
      ...filters,
      page
    };
    setFilters(updatedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debounced search handler
  const handleSearchChange = (value: string) => {
    setSearchInput(value); // Update input immediately for UI responsiveness

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for API call
    searchTimeoutRef.current = setTimeout(() => {
      handleFilterChange({ search: value || undefined });
    }, 500); // 500ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle reorder functionality
  const handleReorder = async (orderId: string) => {
    try {
      setReorderLoading(orderId);
      toastService.info("Processing your reorder...");

      // Call reorder API
      const response = await orderService.reorderOrder(orderId);

      if (response.success) {
        toastService.success(response.message || "Items added to cart successfully!");

        // Refresh cart to get the latest data
        await refreshCart();

        // Initiate checkout process
        await cartService.initiateCheckout();
        toastService.success("Proceeding to checkout!");

        // Navigate to checkout page
        router.push("/shop/checkout");
      } else {
        toastService.error(response.message || "Failed to reorder items");
      }
    } catch (error: any) {
      console.error("Reorder failed:", error);

      // Handle specific error cases
      let errorMessage = "Failed to reorder items. Please try again.";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      toastService.error(errorMessage);
    } finally {
      setReorderLoading(null);
    }
  };

  // Handle pay now functionality
  const handlePayNow = async (orderId: string) => {
    try {
      setPayNowLoading(orderId);
      toastService.info("Processing your payment...");

      // Find the order to get its items
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      // Step 1: Clear existing cart
      await cartService.clearCart();

      // Step 2: Add each order item to cart
      for (const item of order.items) {
        await cartService.addItemToCart({
          productId: item.productId,
          quantity: item.quantity,
        });
      }

      // Step 3: Refresh cart to get the latest data
      await refreshCart();

      // Step 4: Initiate checkout process
      await cartService.initiateCheckout();
      toastService.success("Proceeding to checkout!");

      // Navigate to checkout page
      router.push("/shop/checkout");
    } catch (error: any) {
      console.error("Pay now failed:", error);

      // Handle specific error cases
      const errorMessage = error.response?.data?.message || error.message || "Failed to process payment. Please try again.";
      toastService.error(errorMessage);
    } finally {
      setPayNowLoading(null);
    }
  };


  const getStatusIcon = (status: OrderStatus) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    return <IconComponent size={14} />;
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return `₦${numAmount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-serif text-black mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your fragrance orders</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              {searchLoading && (
                <FiLoader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B0000] animate-spin" size={20} />
              )}
              <input
                type="text"
                placeholder="Search by order number or product name..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 ${searchLoading ? 'pr-12' : 'pr-4'} py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000]`}
              />
            </div>
            <div>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
                className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] bg-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {(searchInput || filters.status) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSearchInput(''); // Clear search input
                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current); // Clear pending search
                  }
                  handleFilterChange({ search: undefined, status: undefined });
                }}
                className="text-[#8B0000] hover:text-[#a0001e] text-sm font-medium underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && (
            <div className="text-sm text-gray-600">
              Showing {orders?.length || 0} of {totalOrders} orders
              {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </div>
          )}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f0ebe5] flex items-center justify-center mb-4 animate-pulse">
              <FiPackage className="h-8 w-8 text-[#8B0000]" />
            </div>
            <p className="text-gray-500">Loading your orders...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f0ebe5] flex items-center justify-center mb-4">
              <FiPackage className="h-8 w-8 text-[#8B0000]" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-black">
              {totalOrders === 0 ? "No Orders Yet" : "No Orders Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {totalOrders === 0
                ? "When you place orders, they will appear here for you to track and review."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link href="/shop">
              <span className="inline-block bg-[#8B0000] text-white px-6 py-3 rounded-md hover:bg-[#a0001e] transition-colors">
                Start Shopping
              </span>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wide">
                <div className="col-span-2">Order #</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Items</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Order Number */}
                    <div className="col-span-2">
                      <span className="font-mono text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="col-span-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {order.items.length === 1
                            ? order.items[0].productName
                            : `${order.items.length} items`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.itemCount} item{order.itemCount !== 1 ? 's' : ''} • {order.shippingAddress.city}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${statusConfig[order.status].color}`}>
                        {getStatusIcon(order.status)}
                        {statusConfig[order.status].label}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="col-span-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex gap-2">
                        {order.status === 'pending' ? (
                          <>
                          
                            <button
                              onClick={() => handlePayNow(order.id)}
                              disabled={payNowLoading === order.id}
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-white text-[#8B0000] text-xs font-medium rounded-md border border-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-colors duration-150 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {payNowLoading === order.id ? (
                                <>
                                  <FiLoader className="animate-spin mr-1" size={12} />
                                  Processing...
                                </>
                              ) : (
                                'Pay Now'
                              )}
                            </button>
                            <Link
                              href={`/profile/orders/${order.orderNumber}`}
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-[#8B0000] text-white text-xs font-medium rounded-md hover:bg-[#a0001e] transition-colors duration-150 whitespace-nowrap"
                            >
                              <FiEye />
                            </Link>
                          </>
                        ) : order.status === 'paid' ? (
                          <>
                            
                            <button
                              onClick={() => handleReorder(order.id)}
                              disabled={reorderLoading === order.id}
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-white text-[#8B0000] text-xs font-medium rounded-md border border-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-colors duration-150 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {reorderLoading === order.id ? (
                                <>
                                  <FiLoader className="animate-spin mr-1" size={12} />
                                  Reordering...
                                </>
                              ) : (
                                'Reorder'
                              )}
                            </button>
                            <Link
                              href={`/profile/orders/${order.orderNumber}`}
                              className="inline-flex items-center justify-center px-3 py-1.5 bg-[#8B0000] text-white text-xs font-medium rounded-md hover:bg-[#a0001e] transition-colors duration-150 whitespace-nowrap"
                            >
                              <FiEye />
                            </Link>
                          </>
                        ) : (
                          // Cancelled or other statuses - only show View
                          <Link
                              href={`/profile/orders/${order.orderNumber}`}
                              className="inline-flex items-center justify-center px-3 py-2 bg-[#8B0000] text-white text-xs font-medium rounded-md hover:bg-[#a0001e] transition-colors duration-150 whitespace-nowrap"
                            >
                              <FiEye />
                            </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 md:gap-6 mt-8 pt-6 border-t border-gray-200">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`transition-all duration-200 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <FiChevronLeft size={16} className="sm:text-lg" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                      currentPage === i + 1
                        ? 'bg-[#8B0000] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))
              ) : (
                <>
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm flex-shrink-0">...</span>
                      )}
                    </>
                  )}

                  {Array.from({ length: 5 }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                          currentPage === pageNum
                            ? 'bg-[#8B0000] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="text-gray-400 px-1 sm:px-2 text-xs sm:text-sm flex-shrink-0">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`transition-all duration-200 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight size={16} className="sm:text-lg" />
            </button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
