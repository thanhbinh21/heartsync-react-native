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

    console.log('🔑 Auth service - Full response:', JSON.stringify(response, null, 2));
    
    // Cast to any to access token and user
    const authData: any = response;
    
    // Backend returns: { success, message, token, user }
    // Check if token exists (success might not be in response)
    if (authData.token && authData.user) {
      await apiClient.setToken(authData.token);
      return {
        success: true,
        message: authData.message || 'Login successful',
        token: authData.token,
        user: authData.user
      };
    }

    throw new Error(authData.message || 'Login failed');
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

    // Cast to any to access token and user
    const authData: any = response;
    
    if (authData.token && authData.user) {
      await apiClient.setToken(authData.token);
      return {
        success: true,
        message: authData.message || 'Registration successful',
        token: authData.token,
        user: authData.user
      };
    }

    throw new Error(authData.message || 'Registration failed');
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
