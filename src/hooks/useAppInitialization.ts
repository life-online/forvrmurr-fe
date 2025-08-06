import { useEffect } from 'react';
import { authService } from '@/services/auth';

export const useAppInitialization = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Ensure user has authentication (creates guest if needed)
        await authService.ensureAuthentication();
        console.log('App initialized with authentication');
      } catch (error) {
        console.error('Failed to initialize app authentication:', error);
      }
    };

    initializeApp();
  }, []);
};