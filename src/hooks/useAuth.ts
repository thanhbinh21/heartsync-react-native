import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types/api';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const data = await authService.login(username, password);
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  };

  const register = async (username: string, password: string) => {
    const data = await authService.register(username, password);
    setUser(data.user);
    setIsLoggedIn(true);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, isLoading, user, login, register, logout };
}
