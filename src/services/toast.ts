import { toast, ToastOptions, ToastContent } from 'react-toastify';

/**
 * Standard toast configuration to maintain consistent appearance
 */
const defaultOptions: ToastOptions = {
  position: 'bottom-left',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

/**
 * Toast service for displaying notifications consistently throughout the app
 */
export const toastService = {
  /**
   * Show a success toast notification
   * @param message - Content to display
   * @param options - Optional toast configuration
   */
  success: (message: ToastContent, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  },

  /**
   * Show an error toast notification
   * @param message - Content to display
   * @param options - Optional toast configuration
   */
  error: (message: ToastContent, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  },

  /**
   * Show an info toast notification
   * @param message - Content to display
   * @param options - Optional toast configuration
   */
  info: (message: ToastContent, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  },

  /**
   * Show a warning toast notification
   * @param message - Content to display
   * @param options - Optional toast configuration
   */
  warning: (message: ToastContent, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  },

  /**
   * Dismiss all currently showing toasts
   */
  dismiss: () => toast.dismiss(),
};

/**
 * Custom hook for direct access to toast service in components
 */
export const useToast = () => {
  return toastService;
};
