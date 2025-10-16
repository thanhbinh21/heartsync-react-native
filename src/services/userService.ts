import { apiClient } from './apiClient';
import { User, Profile } from './types';

export class UserService {
  // Get potential matches for swiping
  static async getPotentialMatches(userId: string, limit: number = 10): Promise<User[]> {
    try {
      const users = await apiClient.get<User[]>('/users');
      // Filter out current user and already matched users
      // In a real app, this would be handled by the backend
      return users.filter(user => user.id !== userId).slice(0, limit);
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      return await apiClient.put<User>(`/users/${id}`, data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const newUser = {
        ...userData,
        id: Date.now().toString(), // Simple ID generation for demo
      };
      return await apiClient.post<User>('/users', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get current user profile
  static async getCurrentProfile(): Promise<Profile> {
    try {
      return await apiClient.get<Profile>('/profile');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update current user profile
  static async updateProfile(data: Partial<Profile>): Promise<Profile> {
    try {
      return await apiClient.put<Profile>('/profile', data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Search users with filters
  static async searchUsers(filters: {
    ageMin?: number;
    ageMax?: number;
    maxDistance?: number;
    interests?: string[];
    location?: string;
  }): Promise<User[]> {
    try {
      const users = await apiClient.get<User[]>('/users');
      
      // Client-side filtering for demo - in real app this would be server-side
      return users.filter(user => {
        if (filters.ageMin && user.age < filters.ageMin) return false;
        if (filters.ageMax && user.age > filters.ageMax) return false;
        if (filters.maxDistance && user.distance && user.distance > filters.maxDistance) return false;
        if (filters.interests && filters.interests.length > 0) {
          const hasCommonInterest = user.interests.some(interest => 
            filters.interests!.includes(interest)
          );
          if (!hasCommonInterest) return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}