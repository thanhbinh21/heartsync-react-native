import { apiClient } from './api-client';
import {
  User,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  UpdateSubscriptionRequest,
} from '../types/api';

export const userService = {
  /**
   * Get current user profile
   */
  async getMyProfile(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/users/me');
    
    if (response.success && response.data) {
      return response.data.user;
    }

    throw new Error(response.message || 'Failed to get profile');
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    
    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'User not found');
  },

  /**
   * Update profile
   */
  async updateProfile(profile: UpdateProfileRequest['profile']): Promise<User> {
    const response = await apiClient.put<{ user: User }>('/users/profile', { profile });
    
    if (response.success && response.data) {
      return response.data.user;
    }

    throw new Error(response.message || 'Failed to update profile');
  },

  /**
   * Update preferences
   */
  async updatePreferences(preferences: UpdatePreferencesRequest['preferences']): Promise<void> {
    const response = await apiClient.put('/users/preferences', { preferences });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update preferences');
    }
  },

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionType: 'free' | 'premium'): Promise<void> {
    const response = await apiClient.put('/users/subscription', { subscriptionType });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update subscription');
    }
  },
};
