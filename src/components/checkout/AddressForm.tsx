"use client";

import React from 'react';
import { Address } from '@/services/checkout';

type AddressType = 'shipping' | 'billing';

interface AddressFormProps {
  type: AddressType;
  address: Address;
  onChange: (field: string, value: string) => void;
  onBlur?: (field: string, value: string) => void;
  errors?: Record<string, string | undefined>;
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 
  'Yobe', 'Zamfara'
];

const AddressForm: React.FC<AddressFormProps> = ({ type, address, onChange, onBlur, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (onBlur) {
      const { name, value } = e.target;
      onBlur(name, value);
    }
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
          onBlur={handleBlur}
          className={`w-full p-2 border bg-white ${errors?.addressLine1 ? 'border-red-500' : 'border-gray-300'} rounded`}
          required
        />
        {errors?.addressLine1 && (
          <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
        )}
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
          onBlur={handleBlur}
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
          onBlur={handleBlur}
          className={`w-full p-2 border bg-white ${errors?.city ? 'border-red-500' : 'border-gray-300'} rounded`}
          required
        />
        {errors?.city && (
          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
        )}
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
          onBlur={handleBlur}
          className={`w-full p-2 border bg-white ${errors?.state ? 'border-red-500' : 'border-gray-300'} rounded`}
          required
        >
          <option value="">Select State</option>
          {nigerianStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors?.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
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
          onBlur={handleBlur}
          className={`w-full p-2 border bg-white ${errors?.postalCode ? 'border-red-500' : 'border-gray-300'} rounded`}
          required
        />
        {errors?.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
        )}
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
          onBlur={handleBlur}
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
