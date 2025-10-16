import { apiClient } from './apiClient';
import { Match, User } from './types';

export class MatchService {
  // Get all matches for a user
  static async getUserMatches(userId: string): Promise<(Match & { user: User })[]> {
    try {
      const [matches, users] = await Promise.all([
        apiClient.get<Match[]>('/matches'),
        apiClient.get<User[]>('/users')
      ]);

      // Filter matches for the user and populate user data
      const userMatches = matches
        .filter(match => match.userId === userId && match.isActive)
        .map(match => {
          const matchedUser = users.find(user => user.id === match.matchedUserId);
          return {
            ...match,
            user: matchedUser!
          };
        })
        .filter(match => match.user); // Remove matches where user wasn't found

      return userMatches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }

  // Create a new match
  static async createMatch(userId: string, matchedUserId: string): Promise<Match> {
    try {
      const newMatch: Omit<Match, 'id'> = {
        userId,
        matchedUserId,
        matchedAt: new Date().toISOString(),
        isActive: true
      };

      const match = await apiClient.post<Match>('/matches', {
        ...newMatch,
        id: Date.now().toString()
      });

      // Also create the reverse match for the other user
      await apiClient.post<Match>('/matches', {
        ...newMatch,
        id: (Date.now() + 1).toString(),
        userId: matchedUserId,
        matchedUserId: userId
      });

      return match;
    } catch (error) {
      console.error('Error creating match:', error);
      throw error;
    }
  }

  // Remove/unmatch
  static async removeMatch(matchId: string): Promise<void> {
    try {
      await apiClient.patch(`/matches/${matchId}`, { isActive: false });
    } catch (error) {
      console.error('Error removing match:', error);
      throw error;
    }
  }

  // Check if two users are matched
  static async checkIfMatched(userId: string, otherUserId: string): Promise<boolean> {
    try {
      const matches = await apiClient.get<Match[]>('/matches');
      return matches.some(match => 
        match.userId === userId && 
        match.matchedUserId === otherUserId && 
        match.isActive
      );
    } catch (error) {
      console.error('Error checking match status:', error);
      throw error;
    }
  }

  // Get new matches (without messages)
  static async getNewMatches(userId: string): Promise<(Match & { user: User })[]> {
    try {
      const allMatches = await this.getUserMatches(userId);
      return allMatches.filter(match => !match.lastMessageId);
    } catch (error) {
      console.error('Error fetching new matches:', error);
      throw error;
    }
  }

  // Get matches with messages
  static async getMatchesWithMessages(userId: string): Promise<(Match & { user: User })[]> {
    try {
      const allMatches = await this.getUserMatches(userId);
      return allMatches.filter(match => match.lastMessageId);
    } catch (error) {
      console.error('Error fetching matches with messages:', error);
      throw error;
    }
  }
}