'use client'

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService, User, LoginCredentials, RegisterData } from '@/services/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { success, error } = useToast();
  const pathname = usePathname();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to initialize auth state', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
      success('Welcome back!');
      router.push('/');
    } catch (err) {
      error('Login failed. Please check your credentials.');
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      const registeredUser = await authService.register(data);
      setUser(registeredUser);
      success('Account created successfully!');
      router.push('/');
    } catch (err) {
      error('Registration failed. Please try again.');
      console.error('Register error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      success('You have been logged out');
      
      // Redirect to login page if on protected route
      if (pathname?.startsWith('/account') || pathname?.startsWith('/profile')) {
        router.push('/auth/login');
      }
    } catch (err) {
      error('Logout failed');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile handler
  const updateProfile = async (data: Partial<User>): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      success('Profile updated successfully');
    } catch (err) {
      error('Failed to update profile');
      console.error('Update profile error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        // Redirect to login page with redirect param
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '')}`);
      }
    }, [isAuthenticated, isLoading, router, pathname]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-[#8b0000] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
}
