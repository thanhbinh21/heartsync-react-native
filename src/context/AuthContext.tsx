import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';
import { apiClient } from '../services/api-client';
import { User, LoginResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug function to check all auth-related keys in storage
  const debugStorage = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const authKeys = allKeys.filter(key => 
        key.includes('auth') || key.includes('token') || key.includes('user')
      );
      
      console.log('🔍 All auth-related keys in storage:', authKeys);
      
      for (const key of authKeys) {
        const value = await AsyncStorage.getItem(key);
        console.log(`🔍 ${key}:`, value ? '✓ exists' : '✗ null');
      }
    } catch (error) {
      console.error('Debug storage error:', error);
    }
  };

  useEffect(() => {
    loadStoredAuth();
    // Debug storage on app start
    if (__DEV__) {
      debugStorage();
    }
  }, []);

  const loadStoredAuth = async () => {
    try {
      // Use same token key as apiClient: 'heartsync_auth_token'
      const storedToken = await AsyncStorage.getItem('heartsync_auth_token');
      const storedUser = await AsyncStorage.getItem('auth_user');
      
      // Check for old token key and migrate if necessary
      const oldToken = await AsyncStorage.getItem('auth_token');
      if (oldToken && !storedToken) {
        console.log('🔄 Migrating old token key...');
        await AsyncStorage.setItem('heartsync_auth_token', oldToken);
        await AsyncStorage.removeItem('auth_token');
      }

      console.log('🔐 Loading stored auth:', { 
        hasToken: !!storedToken, 
        hasUser: !!storedUser 
      });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ Auth loaded from storage');
      } else {
        console.log('ℹ️ No stored auth found - user needs to login');
      }
    } catch (error) {
      console.error('❌ Failed to load stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      console.log('🔑 AuthContext: Starting login process...');
      const response = await authService.login(username, password);
      
      if (response.token && response.user) {
        console.log('🔑 AuthContext: Login successful, saving to storage...');
        setToken(response.token);
        setUser(response.user);
        
        // Use same token key as apiClient: 'heartsync_auth_token'
        await AsyncStorage.setItem('heartsync_auth_token', response.token);
        await AsyncStorage.setItem('auth_user', JSON.stringify(response.user));
        console.log('💾 AuthContext: Auth data saved to storage');
        
        return response; // Return the response so caller can check user data
      }
      
      throw new Error('Invalid login response');
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 AuthContext: Logging out...');
      setUser(null);
      setToken(null);
      
      // Remove all possible token keys to ensure clean logout
      await AsyncStorage.removeItem('heartsync_auth_token');
      await AsyncStorage.removeItem('auth_token'); // Remove old key if exists
      await AsyncStorage.removeItem('auth_user');
      
      // Also call apiClient to remove token
      await apiClient.removeToken();
      console.log('🚪 AuthContext: Logout complete');
    } catch (error) {
      console.error('❌ AuthContext: Logout error:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
