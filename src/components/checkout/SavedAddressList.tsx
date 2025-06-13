"use client";

import React, { useState } from 'react';
import { SavedAddress } from '@/services/checkout';
import { FaMapMarkerAlt, FaStar as FilledStar } from 'react-icons/fa';
import { FaRegStar as EmptyStar } from 'react-icons/fa';
import checkoutService from '@/services/checkout';
import { useToast } from '@/context/ToastContext';

// Helper function to safely render address properties that might be objects at runtime
const renderAddressProperty = (prop: any): string => {
  if (prop === null || prop === undefined) return '';
  if (typeof prop === 'object' && prop.name) return prop.name;
  return String(prop);
};

interface SavedAddressListProps {
  addresses: SavedAddress[];
  selectedAddressId?: string | null;
  onSelect: (addressId: string) => void;
  onAddressesUpdated?: (addresses: SavedAddress[]) => void;
}

const SavedAddressList: React.FC<SavedAddressListProps> = ({ 
  addresses, 
  selectedAddressId, 
  onSelect,
  onAddressesUpdated 
}) => {
  const { success, error } = useToast();
  const [loadingAddressId, setLoadingAddressId] = useState<string | null>(null);
  
  const handleSetDefaultAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick (address selection)
    
    if (loadingAddressId) return; // Prevent multiple calls while one is in progress
    
    try {
      setLoadingAddressId(addressId);
      
      // Call API to set address as default
      await checkoutService.setAddressAsDefault(addressId);
      
      // Update locally - mark the selected address as default and others as not default
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      // Notify parent component of the update
      if (onAddressesUpdated) {
        onAddressesUpdated(updatedAddresses);
      }
      
      success("Default address updated");
    } catch (err) {
      console.error("Failed to set default address:", err);
      error("Could not set default address. Please try again.");
    } finally {
      setLoadingAddressId(null);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {addresses.map((address) => (
        <div 
          key={address.id} 
          className={`border p-4 flex flex-col rounded-md cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedAddressId === address.id 
              ? 'border-[#a0001e] bg-gradient-to-br from-white to-red-50' 
              : 'border-gray-200 hover:border-[#a0001e]/20'
          }`}
          onClick={() => onSelect(address.id)}
        >
          {/* Header row with name and default star */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div className="flex items-center">
              <div className="p-1.5 mr-2 rounded-full bg-red-50 shadow-sm">
                <FaMapMarkerAlt size={14} className="text-[#a0001e]" />
              </div>
              <h3 className="font-medium text-gray-800">
                {address.firstName} {address.lastName}
              </h3>
            </div>
            
            {/* Default Star */}
            <button 
              className={`flex items-center justify-center p-1 rounded-full transition-all ${
                loadingAddressId === address.id ? 'opacity-50' : ''
              } ${
                address.isDefault 
                  ? 'bg-amber-50 hover:bg-amber-100' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={(e) => handleSetDefaultAddress(address.id, e)}
              disabled={loadingAddressId !== null}
              title={address.isDefault ? "Default address" : "Set as default address"}
              aria-label={address.isDefault ? "Default address" : "Set as default address"}
            >
              {address.isDefault ? (
                <FilledStar size={16} className="text-amber-400" />
              ) : (
                <EmptyStar size={16} className="text-gray-400 hover:text-amber-300" />
              )}
            </button>
          </div>
          
          {/* Address details */}
          <div className="mb-4 pl-1">
            <p className="text-sm text-gray-700 mb-1">{address.streetAddress}</p>
            <p className="text-sm text-gray-700 mb-1">
              {address.city}, {renderAddressProperty(address.state)} {address.postalCode}
            </p>
            <p className="text-sm text-gray-700">{renderAddressProperty(address.country)}</p>
          </div>
          
          {/* Footer with selection indicator */}
          <div className="flex justify-end items-center pt-2 mt-auto border-t border-gray-100">
            <span className="text-xs mr-2 text-gray-500">
              {selectedAddressId === address.id ? 'Selected' : ''}
            </span>
            <input
              type="radio"
              className="h-4 w-4 text-[#a0001e] border-gray-300 focus:ring-[#a0001e]/50"
              checked={selectedAddressId === address.id}
              onChange={() => onSelect(address.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedAddressList;
