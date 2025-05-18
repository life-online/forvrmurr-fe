"use client";

import React, { createContext, useContext } from 'react';
import { toast, ToastOptions, ToastContent, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Default toast configuration for consistent appearance
 */
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

/**
 * Interface for the toast context
 */
interface ToastContextValue {
  success: (message: ToastContent, options?: ToastOptions) => ReturnType<typeof toast.success>;
  error: (message: ToastContent, options?: ToastOptions) => ReturnType<typeof toast.error>;
  info: (message: ToastContent, options?: ToastOptions) => ReturnType<typeof toast.info>;
  warning: (message: ToastContent, options?: ToastOptions) => ReturnType<typeof toast.warning>;
  dismiss: (id?: ReturnType<typeof toast>) => void;
  dismissAll: () => void;
}

// Create the toast context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Toast Provider Component
 * 
 * Provides toast notification functionality throughout the application
 * Includes the ToastContainer for displaying notifications
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Toast methods
  const success = (message: ToastContent, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (message: ToastContent, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  };

  const info = (message: ToastContent, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  };

  const warning = (message: ToastContent, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  };

  const dismiss = (id?: ReturnType<typeof toast>) => {
    if (id) {
      toast.dismiss(id);
    }
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  // Context value
  const value: ToastContextValue = {
    success,
    error,
    info,
    warning,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook for accessing toast functionality
 * 
 * Usage:
 * ```
 * const toast = useToast();
 * toast.success('Operation completed successfully!');
 * ```
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
