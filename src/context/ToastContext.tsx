"use client";

import React, { createContext, useContext } from 'react';
import { toast, ToastOptions, ToastContent, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Default toast configuration for consistent appearance
 * Customized for ForvrMurr luxury branding
 */
const defaultOptions: ToastOptions = {
  position: 'bottom-left',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light', // We'll override this with custom styling
  className: 'forvrmurr-toast',
  // Using toast's built-in class names instead of unsupported properties
  style: { background: 'transparent' },
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
      <ToastContainer 
        position="bottom-left"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={(context) => 
          `forvrmurr-toast ${context?.type || 'default'} ${context?.defaultClassName || ''}`
        }
      />
      <style jsx global>{`
        /* Custom Toast Styling for ForvrMurr */
        .forvrmurr-toast,
        .Toastify__toast {
          font-family: 'Inter', sans-serif;
          border-radius: 4px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          color: #333 !important;
          margin-bottom: 1rem !important;
          padding: 12px 16px !important;
        }

        /* Toast types with luxury styling */
        .Toastify__toast--success {
          background-color: #f5f9f7 !important;
          border-left: 4px solid #2c614f !important;
        }

        .Toastify__toast--error {
          background-color: #fdf5f5 !important;
          border-left: 4px solid #8b0000 !important;
        }

        .Toastify__toast--info {
          background-color: #f5f8fa !important;
          border-left: 4px solid #4a6582 !important;
        }

        .Toastify__toast--warning {
          background-color: #faf8f2 !important;
          border-left: 4px solid #ba8b0a !important;
        }

        /* Toast body text */
        .Toastify__toast-body {
          font-size: 14px !important;
          font-weight: 400 !important;
          padding: 6px 0 !important;
        }

        /* Progress bar styling with toast-specific colors */
        .Toastify__toast--success .Toastify__progress-bar {
          background: linear-gradient(to right, #2c614f, #3c7968) !important;
          height: 2px !important;
        }
        
        .Toastify__toast--error .Toastify__progress-bar {
          background: linear-gradient(to right, #8b0000, #bf0f0f) !important;
          height: 2px !important;
        }
        
        .Toastify__toast--info .Toastify__progress-bar {
          background: linear-gradient(to right, #4a6582, #5d7fa7) !important;
          height: 2px !important;
        }
        
        .Toastify__toast--warning .Toastify__progress-bar {
          background: linear-gradient(to right, #ba8b0a, #daa520) !important;
          height: 2px !important;
        }

        /* Style toast close button */
        .Toastify__close-button {
          color: #555 !important;
          opacity: 0.7 !important;
        }
        
        .Toastify__close-button:hover {
          opacity: 1 !important;
        }

        /* Make the toast container positioned properly */
        .Toastify__toast-container--bottom-left {
          bottom: 1.5rem !important;
          left: 1.5rem !important;
        }
      `}</style>
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
