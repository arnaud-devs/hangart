// lib/authProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { appClient, get, post, saveTokens, clearAuthStorage, storeUser, getStoredUser } from './appClient';
import { useRouter } from 'next/navigation';

type User = {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<User>;
  signUp: (userData: any) => Promise<any>;
  updateUser: (payload: Partial<User>) => Promise<User>;
  signOut: () => void;
  refresh: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        } else {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const me = await get('/auth/me/');
            setUser(me);
            storeUser(me);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const signIn = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      console.log('Attempting login with:', { username });
      const tokens = await post('/auth/login/', { username, password });
      console.log('Login tokens received:', tokens);
      
      saveTokens(tokens.access, tokens.refresh);
      
      const userData = await get('/auth/me/');
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

  const signUp = async (userData: any) => {
    setLoading(true);
    try {
      // Use appClient register endpoint
      const resp = await appClient.post('/auth/register/', userData);
      const tokens = resp?.tokens || resp?.tokens || resp;
      if (tokens?.access) saveTokens(tokens.access, tokens.refresh);
      const userDataResp = resp?.user || (await get('/auth/me/'));
      setUser(userDataResp);
      try { storeUser(userDataResp); } catch {}
      return resp;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (payload: Partial<User>) => {
    try {
      const updated = await appClient.patch('/auth/me/', payload);
      setUser(updated);
      try { storeUser(updated); } catch {}
      return updated;
    } catch (e) {
      throw e;
    }
  };

  function signOut() {
    clearAuthStorage();
    setUser(null);
    try { 
      router.push('/login'); 
    } catch (e) {
      console.error('Logout redirect error:', e);
    }
  }

  async function refresh() {
    try {
      return await appClient.refreshAccessToken();
    } catch (e) { 
      console.error('Token refresh error:', e);
      return false; 
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, updateUser, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;