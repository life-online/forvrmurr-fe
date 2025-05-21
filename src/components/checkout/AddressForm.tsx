"use client";

import React from 'react';
import { Address } from '@/services/checkout';

type AddressType = 'shipping' | 'billing';

interface AddressFormProps {
  type: AddressType;
  address: Address;
  onChange: (field: string, value: string) => void;
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 
  'Yobe', 'Zamfara'
];

const AddressForm: React.FC<AddressFormProps> = ({ type, address, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label htmlFor={`${type}-addressLine1`} className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 1
        </label>
        <input
          type="text"
          id={`${type}-addressLine1`}
          name="addressLine1"
          value={address.addressLine1}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
          required
        />
      </div>
      
      <div className="md:col-span-2">
        <label htmlFor={`${type}-addressLine2`} className="block text-sm font-medium text-gray-700 mb-1">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          id={`${type}-addressLine2`}
          name="addressLine2"
          value={address.addressLine2 || ''}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
        />
      </div>
      
      <div>
        <label htmlFor={`${type}-city`} className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          id={`${type}-city`}
          name="city"
          value={address.city}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
          required
        />
      </div>
      
      <div>
        <label htmlFor={`${type}-state`} className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          id={`${type}-state`}
          name="state"
          value={address.state}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
          required
        >
          <option value="">Select State</option>
          {nigerianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor={`${type}-postalCode`} className="block text-sm font-medium text-gray-700 mb-1">
          Postal Code
        </label>
        <input
          type="text"
          id={`${type}-postalCode`}
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
          required
        />
      </div>
      
      <div>
        <label htmlFor={`${type}-country`} className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          id={`${type}-country`}
          name="country"
          value={address.country}
          onChange={handleChange}
          className="w-full p-2 border bg-white border-gray-300 rounded"
          required
        >
          <option value="Nigeria">Nigeria</option>
        </select>
      </div>
    </div>
  );
};

export default AddressForm;
