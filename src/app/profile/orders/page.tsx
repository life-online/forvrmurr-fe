"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPackage, FiEye, FiTruck, FiCheck, FiClock, FiSearch } from 'react-icons/fi';
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
  orderDate: string;
  deliveryDate?: string;
  items: OrderItem[];
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  processing: { color: 'bg-blue-100 text-blue-800', icon: FiPackage },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: FiTruck },
  delivered: { color: 'bg-green-100 text-green-800', icon: FiCheck },
  cancelled: { color: 'bg-red-100 text-red-800', icon: FiClock }
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock orders data - replace with actual API call
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'FM-2025-0003',
        status: 'delivered',
        total: 35000,
        orderDate: '2025-07-15',
        deliveryDate: '2025-07-22',
        items: [
          {
            id: '1',
            name: 'Baccarat Rouge 540',
            brand: 'Maison Francis Kurkdjian',
            price: 35000,
            quantity: 1,
            imageUrl: '/images/hero/hero_image.png'
          }
        ]
      },
      {
        id: '2',
        orderNumber: 'FM-2025-0002',
        status: 'shipped',
        total: 42000,
        orderDate: '2025-07-28',
        items: [
          {
            id: '2',
            name: 'Aventus',
            brand: 'Creed',
            price: 42000,
            quantity: 1,
            imageUrl: '/images/hero/hero_image.png'
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'FM-2025-0001',
        status: 'processing',
        total: 28000,
        orderDate: '2025-08-02',
        items: [
          {
            id: '3',
            name: 'Black Orchid',
            brand: 'Tom Ford',
            price: 28000,
            quantity: 1,
            imageUrl: '/images/hero/hero_image.png'
          }
        ]
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => 
                           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Order['status']) => {
    const IconComponent = statusConfig[status].icon;
    return <IconComponent size={14} />;
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#f7ede1] flex items-center justify-center mb-4">
              <FiPackage className="h-8 w-8 text-[#8b0000]" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0 
                ? "When you place orders, they will appear here for you to track and review."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link href="/shop">
              <span className="inline-block bg-[#8b0000] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
                Start Shopping
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">#{order.orderNumber}</span>
                    </div>
                    
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={order.items[0]?.imageUrl || '/images/hero/hero_image.png'}
                          alt={order.items[0]?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-black">
                          {order.items.length === 1 
                            ? `${order.items[0].brand} - ${order.items[0].name}`
                            : `${order.items.length} items`
                          }
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Ordered on {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {order.deliveryDate && (
                          <p className="text-sm text-green-600">
                            Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        <p className="font-medium text-lg text-black">
                          ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link 
                      href={`/profile/orders/${order.id}`}
                      className="inline-flex items-center gap-2 bg-[#8B0000] text-white px-4 py-2 rounded-md hover:bg-[#a0001e] transition-colors text-sm"
                    >
                      <FiEye size={16} />
                      View Details
                    </Link>
                    {order.status === 'delivered' && (
                      <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
