"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiTruck, FiCheck, FiClock, FiMapPin, FiCopy } from 'react-icons/fi';
import ProfileLayout from '@/components/profile/ProfileLayout';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Order Pending' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: FiPackage, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: FiTruck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: FiCheck, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: FiClock, label: 'Cancelled' }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Mock order data - replace with actual API call
    const mockOrder: Order = {
      id: orderId,
      orderNumber: 'FM-2025-0003',
      status: 'delivered',
      total: 35000,
      subtotal: 32000,
      shipping: 2000,
      tax: 1000,
      orderDate: '2025-07-15',
      deliveryDate: '2025-07-22',
      trackingNumber: 'DHL1234567890',
      items: [
        {
          id: '1',
          name: 'Baccarat Rouge 540',
          brand: 'Maison Francis Kurkdjian',
          price: 35000,
          quantity: 1,
          imageUrl: '/images/hero/hero_image.png'
        }
      ],
      shippingAddress: {
        name: 'Sarah Johnson',
        street: '123 Victoria Island Road',
        city: 'Lagos',
        state: 'Lagos State',
        zipCode: '101241',
        country: 'Nigeria'
      },
      paymentMethod: 'Credit Card ending in 4242'
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 500);
  }, [orderId]);

  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    const IconComponent = statusConfig[status].icon;
    return <IconComponent size={16} />;
  };

  const getTrackingSteps = (status: Order['status']) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', completed: true },
      { key: 'processing', label: 'Processing', completed: status === 'processing' || status === 'shipped' || status === 'delivered' },
      { key: 'shipped', label: 'Shipped', completed: status === 'shipped' || status === 'delivered' },
      { key: 'delivered', label: 'Delivered', completed: status === 'delivered' }
    ];

    return steps;
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </ProfileLayout>
    );
  }

  if (!order) {
    return (
      <ProfileLayout>
        <div className="text-center py-12">
          <h3 className="font-serif text-xl mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link 
            href="/profile/orders"
            className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <ProfileLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#8B0000] hover:text-[#a0001e] transition-colors"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-serif text-black">Order Details</h1>
            <p className="text-gray-600">#{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-gradient-to-r from-[#f8f5f2] to-[#f0ebe5] rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                {getStatusIcon(order.status)}
                {statusConfig[order.status].label}
              </span>
              {order.trackingNumber && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Tracking:</span>
                  <button
                    onClick={copyTrackingNumber}
                    className="flex items-center gap-1 text-sm font-mono bg-white px-2 py-1 rounded border hover:bg-gray-50"
                  >
                    {order.trackingNumber}
                    <FiCopy size={12} className={copied ? 'text-green-600' : 'text-gray-400'} />
                  </button>
                </div>
              )}
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Order Date: {new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              {order.deliveryDate && (
                <p>Delivered: {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              )}
            </div>
          </div>

          {/* Tracking Progress */}
          <div className="flex items-center justify-between">
            {trackingSteps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? <FiCheck size={16} /> : <div className="w-2 h-2 bg-current rounded-full" />}
                  </div>
                  <p className={`text-xs mt-1 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-black mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-black">{item.brand}</h4>
                      <p className="text-sm text-gray-600 mb-1">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">₦{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-black mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-black">₦{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-black">₦{order.shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-black">₦{order.tax.toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-medium text-lg">
                  <span className="text-black">Total:</span>
                  <span className="text-black">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-black mb-4 flex items-center gap-2">
                <FiMapPin size={18} />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-black">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium text-black mb-4">Payment Method</h3>
              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {order.status === 'delivered' && (
                <button className="w-full bg-[#8B0000] text-white py-3 rounded-md hover:bg-[#a0001e] transition-colors">
                  Reorder Items
                </button>
              )}
              <Link 
                href="/support"
                className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-md hover:bg-gray-200 transition-colors"
              >
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}