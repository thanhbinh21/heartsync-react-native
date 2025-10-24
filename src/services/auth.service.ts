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
    // Backend auth endpoints return flat object: { success, message, token, user }
    // Not wrapped in data property
    const response = await apiClient.post<any>('/auth/login', {
      username,
      password,
    } as LoginRequest);

    console.log('🔑 Auth service - Full response:', response);
    
    // Cast response to include token and user properties
    const authResponse = response as LoginResponse & { success: boolean };
    
    console.log('🔑 Auth service - Checking:', {
      success: authResponse.success,
      hasToken: !!authResponse.token,
      hasUser: !!authResponse.user,
      token: authResponse.token,
      user: authResponse.user
    });
    
    if (authResponse.success && authResponse.token) {
      await apiClient.setToken(authResponse.token);
      return authResponse;
    }

    throw new Error(response.message || 'Login failed');
  },

  /**
   * User registration
   */
  async register(username: string, password: string, email?: string): Promise<LoginResponse> {
    // Backend auth endpoints return flat object: { success, message, token, user }
    const response = await apiClient.post<any>('/auth/register', {
      username,
      password,
      email,
    });

    // Cast response to include token and user properties
    const authResponse = response as LoginResponse & { success: boolean };
    
    if (authResponse.success && authResponse.token) {
      await apiClient.setToken(authResponse.token);
      return authResponse;
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
