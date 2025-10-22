import { apiClient } from './api-client';
import { User, Match, SwipeRequest, SwipeResponse, LikeType } from '../types/api';

export const matchService = {
  /**
   * Get users to swipe on
   */
  async getDiscoverUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/matches/discover');
    return response.data || [];
  },

  /**
   * Swipe on a user
   */
  async swipe(userId: string, likeType: LikeType): Promise<SwipeResponse> {
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
    const response = await apiClient.get<Match[]>('/matches/matches');
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
