"use client";

import React, { useEffect } from 'react';
import { ShippingMethod } from '@/services/checkout';

interface ShippingMethodsSelectorProps {
  methods: ShippingMethod[];
  selectedMethodId: string;
  onChange: (id: string) => void;
}

const ShippingMethodsSelector: React.FC<ShippingMethodsSelectorProps> = ({
  methods,
  selectedMethodId,
  onChange
}) => {
  // Helper function to render a shipping method
  const renderShippingMethod = (method: ShippingMethod) => (
    <div
      key={method.id}
      className={`border p-4 rounded-lg cursor-pointer bg-white transition-colors ${
        selectedMethodId === method.id
          ? 'border-[#a0001e] bg-red-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onChange(method.id)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{method.name}</span>
          </div>
          {method.description && (
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#a0001e]">
            {method.amount === "0" ? 'FREE' : `₦${parseInt(method.amount, 10).toLocaleString()}`}
          </span>
          <div className="flex h-5 items-center">
            <input
              type="radio"
              className="h-4 w-4 text-[#a0001e] border-gray-300"
              checked={selectedMethodId === method.id}
              onChange={() => onChange(method.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (methods.length === 0) {
    return <p className="text-gray-500 text-sm">No shipping methods available</p>;
  }

  // Separate shipping methods into delivery and pickup categories
  const deliveryMethods = methods.filter(method => !method.name.toLowerCase().includes('pick up'));
  const pickupMethods = methods.filter(method => method.name.toLowerCase().includes('pick up'));
  
  const setDefaultMethod = () => {
    if (deliveryMethods.length > 0) {
      onChange(deliveryMethods[0].id);
    } else if (methods.length > 0) {
      onChange(methods[0].id);
    }
  };
  
  // Select the first delivery method by default when no method is selected
  useEffect(() => {
    setDefaultMethod();
  }, []);


  return (
    <div className="space-y-6">
      {/* Delivery Methods Section */}
      {deliveryMethods.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Deliver to Me</h4>
          <div className="space-y-3">
            {deliveryMethods.map(renderShippingMethod)}
          </div>
        </div>
      )}
      
      {/* Pickup Methods Section */}
      {pickupMethods.length > 0 && (
        <div className="pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Pick Up Options</h4>
          <div className="space-y-3">
            {pickupMethods.map(renderShippingMethod)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingMethodsSelector;
