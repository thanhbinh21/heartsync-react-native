import { apiClient } from './api-client';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from '../types/api';

export const authService = {
  /**
   * User login
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      username,
      password,
    } as LoginRequest);

    if (response.success && response.data) {
      // Save token
      await apiClient.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  },

  /**
   * User registration
   */
  async register(username: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/register', {
      username,
      password,
    } as RegisterRequest);

    if (response.success && response.data) {
      await apiClient.setToken(response.data.token);
      return response.data;
    }

    throw new Error(response.message || 'Registration failed');
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.removeToken();
  },

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    const token = await apiClient.getToken();
    return token !== null;
  },
};
