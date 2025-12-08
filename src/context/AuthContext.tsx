// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import appClient, { getStoredUser, storeUser, clearAuthStorage } from '@/lib/appClient';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'artist' | 'buyer' | 'admin' | ''; // Add empty string as possible value
  phone?: string;
  is_verified: boolean;
  join_date: string;
  artist_profile?: any;
  buyer_profile?: any;
  admin_profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<User>;
  signUp: (userData: any) => Promise<{ user: User; tokens: any }>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = getStoredUser();
      console.log('Stored user from localStorage:', storedUser);
      
      if (storedUser) {
        try {
          const currentUser = await appClient.get('/auth/me/');
          console.log('Current user from API:', currentUser);
          setUser(currentUser);
          storeUser(currentUser);
        } catch (error) {
          console.error('Token validation failed:', error);
          clearAuthStorage();
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { username });
      const tokens = await appClient.post('/auth/login/', { username, password });
      console.log('Login tokens received:', tokens);
      
      appClient.saveTokens(tokens.access, tokens.refresh);
      
      const userData = await appClient.get('/auth/me/');
      console.log('User data after login:', userData);
      
      setUser(userData);
      storeUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: any): Promise<{ user: User; tokens: any }> => {
    setLoading(true);
    try {
      const response = await appClient.post('/auth/register/', userData);
      appClient.saveTokens(response.tokens.access, response.tokens.refresh);
      
      setUser(response.user);
      storeUser(response.user);
      
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    clearAuthStorage();
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}