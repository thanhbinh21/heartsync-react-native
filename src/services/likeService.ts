import { apiClient } from './apiClient';
import { Like } from './types';

export class LikeService {
  // Send a like
  static async sendLike(
    userId: string, 
    likedUserId: string, 
    likeType: 'like' | 'super_like' | 'pass'
  ): Promise<{ like: Like; isMatch: boolean }> {
    try {
      const newLike: Omit<Like, 'id'> = {
        userId,
        likedUserId,
        likeType,
        timestamp: new Date().toISOString()
      };

      const like = await apiClient.post<Like>('/likes', {
        ...newLike,
        id: Date.now().toString()
      });

      // Check if the other user has liked this user back
      let isMatch = false;
      if (likeType === 'like' || likeType === 'super_like') {
        const likes = await apiClient.get<Like[]>('/likes');
        const reciprocalLike = likes.find(l => 
          l.userId === likedUserId && 
          l.likedUserId === userId && 
          (l.likeType === 'like' || l.likeType === 'super_like')
        );

        if (reciprocalLike) {
          isMatch = true;
          // Create the match in the MatchService
          const { MatchService } = await import('./matchService');
          await MatchService.createMatch(userId, likedUserId);
        }
      }

      return { like, isMatch };
    } catch (error) {
      console.error('Error sending like:', error);
      throw error;
    }
  }

  // Get likes received by a user
  static async getLikesReceived(userId: string): Promise<Like[]> {
    try {
      const likes = await apiClient.get<Like[]>('/likes');
      return likes
        .filter(like => 
          like.likedUserId === userId && 
          (like.likeType === 'like' || like.likeType === 'super_like')
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching received likes:', error);
      throw error;
    }
  }

  // Get likes sent by a user
  static async getLikesSent(userId: string): Promise<Like[]> {
    try {
      const likes = await apiClient.get<Like[]>('/likes');
      return likes
        .filter(like => like.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching sent likes:', error);
      throw error;
    }
  }

  // Check if user has already liked another user
  static async hasUserLiked(userId: string, targetUserId: string): Promise<boolean> {
    try {
      const likes = await apiClient.get<Like[]>('/likes');
      return likes.some(like => 
        like.userId === userId && 
        like.likedUserId === targetUserId &&
        (like.likeType === 'like' || like.likeType === 'super_like')
      );
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  }

  // Get super likes received (premium feature)
  static async getSuperLikesReceived(userId: string): Promise<Like[]> {
    try {
      const likes = await apiClient.get<Like[]>('/likes');
      return likes
        .filter(like => 
          like.likedUserId === userId && 
          like.likeType === 'super_like'
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching super likes:', error);
      throw error;
    }
  }

  // Get daily like count for a user (for free tier limits)
  static async getDailyLikeCount(userId: string): Promise<number> {
    try {
      const likes = await apiClient.get<Like[]>('/likes');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return likes.filter(like => {
        const likeDate = new Date(like.timestamp);
        likeDate.setHours(0, 0, 0, 0);
        return like.userId === userId && 
               likeDate.getTime() === today.getTime() &&
               (like.likeType === 'like' || like.likeType === 'super_like');
      }).length;
    } catch (error) {
      console.error('Error getting daily like count:', error);
      throw error;
    }
  }
}