import { apiClient } from './api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    try {
      console.log('📝 Updating profile via API...', profile);
      
      // Get current user ID from AsyncStorage
      const storedUser = await AsyncStorage.getItem('auth_user');
      if (!storedUser) {
        throw new Error('User not logged in');
      }
      
      const user = JSON.parse(storedUser);
      const userId = user.id;
      
      console.log('👤 Current user ID:', userId);
      console.log('👤 User data:', { username: user.username, id: user.id });
      
      // Validate userId format
      if (!userId || typeof userId !== 'string' || userId.length < 20) {
        console.error('❌ Invalid user ID format:', userId);
        throw new Error('Invalid user session. Please login again.');
      }
      
      // Call correct endpoint with userId in path
      // Backend expects: { profile: {...}, preferences: {...} }
      const response = await apiClient.put<{ success: boolean; user: User }>(
        `/users/profile/${userId}`, 
        { profile }  // Backend will handle just profile or both profile + preferences
      );
      
      console.log('✅ Update profile response:', response);
      
      // apiClient returns the backend response directly: {success: true, user: {...}}
      // Cast to any to access the backend response structure
      const backendResponse = response as any;
      
      if (backendResponse.success && backendResponse.user) {
        // Update stored user with new data
        const updatedUser = backendResponse.user;
        await AsyncStorage.setItem('auth_user', JSON.stringify(updatedUser));
        console.log('💾 User data saved to storage');
        return updatedUser;
      }

      // If we get here, the response wasn't successful
      console.error('❌ Backend response not successful:', backendResponse);
      throw new Error(backendResponse.message || 'Failed to update profile');
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      
      // Enhanced error logging for debugging
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response data:', error.response.data);
      }
      
      // Re-throw with better error message if it's a user not found error
      if (error.message && error.message.includes('User not found')) {
        throw new Error(`User not found. Your session may have expired. Please login again.`);
      }
      
      throw error;
    }
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

  /**
   * Upload profile photos
   * Note: In a real app, this would use FormData and multipart/form-data
   * For now, we'll send base64 encoded images or URLs
   */
  async uploadPhotos(photos: string[]): Promise<string[]> {
    try {
      console.log('Uploading photos to API...', photos.length);
      
      const response = await apiClient.post<{ photos: string[] }>('/users/photos', { photos });
      
      if (response.success && response.data) {
        console.log('Photos uploaded successfully:', response.data.photos);
        return response.data.photos;
      }

      throw new Error(response.message || 'Failed to upload photos');
    } catch (error: any) {
      console.error('Photo upload error:', error);
      
      // For development: If API fails, return mock URLs
      // This allows testing without a working photo upload endpoint
      if (__DEV__) {
        console.warn('⚠️ Photo upload failed, using mock URLs for development');
        return photos.map((_, index) => 
          `https://images.unsplash.com/photo-${1494790108755 + index}?w=600`
        );
      }
      
      throw error;
    }
  },
};
