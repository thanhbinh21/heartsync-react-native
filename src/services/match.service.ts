import { apiClient } from './api-client';
import { User, Match, SwipeRequest, SwipeResponse, LikeType, DiscoverUser } from '../types/api';

export const matchService = {
  /**
   * Get users to swipe on
   * Returns simplified DiscoverUser objects, not full User objects
   */
  async getDiscoverUsers(): Promise<DiscoverUser[]> {
    const response = await apiClient.get<DiscoverUser[]>('/matches/discover');
    console.log('🎯 Match service - Response:', response);
    console.log('🎯 Match service - Data:', response.data);
    
    // Check if backend returned error (404, 500, etc.)
    if (!response.success || !response.data) {
      console.log('⚠️ Backend endpoint not available, using mock data');
      
      // Mock data với avatar người thật từ multiple sources
      const mockUsers: DiscoverUser[] = Array.from({ length: 10 }, (_, i) => {
        // Sử dụng ID cố định cho mỗi user để ảnh không thay đổi mỗi lần load
        const avatarId = 10 + i;
        
        return {
          id: `mock-user-${i + 1}`,
          name: ['Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn'][i],
          age: 22 + Math.floor(Math.random() * 8),
          bio: [
            'Love traveling and trying new foods 🌎✈️',
            'Coffee addict ☕ and dog lover 🐕',
            'Adventure seeker | Gym enthusiast 💪',
            'Beach bum 🏖️ | Sunset chaser 🌅',
            'Foodie | Netflix binger 🍕📺',
            'Yoga lover 🧘‍♀️ | Nature enthusiast 🌿',
            'Bookworm 📚 | Music lover 🎵',
            'Wanderlust | Photography 📸',
            'Fitness freak | Healthy lifestyle 🥗',
            'Art lover 🎨 | Coffee connoisseur ☕'
          ][i],
          photos: [
            `https://i.pravatar.cc/400?img=${avatarId}`,
            `https://i.pravatar.cc/400?img=${avatarId + 10}`,
            `https://i.pravatar.cc/400?img=${avatarId + 20}`
          ],
          location: ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng'][Math.floor(Math.random() * 4)],
          job: ['Designer', 'Engineer', 'Teacher', 'Doctor', 'Marketer', 'Chef', 'Artist', 'Photographer', 'Writer', 'Entrepreneur'][i],
          interests: [
            ['Travel', 'Food', 'Music'],
            ['Coffee', 'Dogs', 'Hiking'],
            ['Gym', 'Adventure', 'Sports'],
            ['Beach', 'Sunset', 'Photography'],
            ['Food', 'Netflix', 'Movies'],
            ['Yoga', 'Nature', 'Meditation'],
            ['Books', 'Music', 'Art'],
            ['Travel', 'Photography', 'Culture'],
            ['Fitness', 'Health', 'Cooking'],
            ['Art', 'Coffee', 'Design']
          ][i],
          verified: Math.random() > 0.5
        };
      });
      
      return mockUsers;
    }
    
    // Backend returns { success: true, data: [...] }
    return response.data;
  },

  /**
   * Swipe on a user
   */
  async swipe(userId: string, likeType: LikeType): Promise<SwipeResponse> {
    // Check if this is a mock user (mock users have IDs like "mock-user-1")
    if (userId.startsWith('mock-user-')) {
      console.log('⚠️ Mock user detected, returning mock swipe response');
      
      // Return mock response for demo purposes
      const isMockMatch = Math.random() > 0.7; // 30% chance of matching
      return {
        isMatch: isMockMatch,
        matchId: isMockMatch ? `mock-match-${Date.now()}` : null,
        like: {
          id: `mock-like-${Date.now()}`,
          userId: 'current-user-id',
          likedUserId: userId,
          likeType: likeType,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // Real backend call
    const response = await apiClient.post<SwipeResponse>('/matches/swipe', {
      likedUserId: userId,
      likeType,
    } as SwipeRequest);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Swipe failed');
  },

  /**
   * Like a user
   */
  async like(userId: string): Promise<SwipeResponse> {
    return this.swipe(userId, 'like');
  },

  /**
   * Super like a user
   */
  async superLike(userId: string): Promise<SwipeResponse> {
    return this.swipe(userId, 'super_like');
  },

  /**
   * Pass on a user
   */
  async pass(userId: string): Promise<SwipeResponse> {
    return this.swipe(userId, 'pass');
  },

  /**
   * Get all matches
   */
  async getMatches(): Promise<Match[]> {
    const response = await apiClient.get<Match[]>('/matches');
    return response.data || [];
  },

  /**
   * Unmatch with a user
   */
  async unmatch(matchId: string): Promise<void> {
    const response = await apiClient.delete(`/matches/matches/${matchId}`);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to unmatch');
    }
  },
};
