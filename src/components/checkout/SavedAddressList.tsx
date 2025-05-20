"use client";

import React from 'react';
import { SavedAddress } from '@/services/checkout';

interface SavedAddressListProps {
  addresses: SavedAddress[];
  selectedAddressId?: string | null;
  onSelect: (addressId: string) => void;
}

const SavedAddressList: React.FC<SavedAddressListProps> = ({ 
  addresses, 
  selectedAddressId, 
  onSelect 
}) => {
  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div 
          key={address.id} 
          className={`border p-3 rounded-lg cursor-pointer transition-colors ${
            selectedAddressId === address.id 
              ? 'border-[#a0001e] bg-red-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelect(address.id)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{address.label}</span>
                {address.isDefault && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">Default</span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm text-gray-700">{address.addressLine2}</p>
              )}
              <p className="text-sm text-gray-700">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-gray-700">{address.country}</p>
            </div>
            <div className="flex h-5 items-center">
              <input
                type="radio"
                className="h-4 w-4 text-[#a0001e] border-gray-300"
                checked={selectedAddressId === address.id}
                onChange={() => onSelect(address.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedAddressList;
