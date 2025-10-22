import { apiClient } from './api-client';
import { Message, Conversation, SendMessageRequest } from '../types/api';

export const messageService = {
  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/messages/conversations');
    return response.data || [];
  },

  /**
   * Get messages for a match
   */
  async getMessages(matchId: string, limit = 50, before?: string): Promise<Message[]> {
    let endpoint = `/messages/matches/${matchId}/messages?limit=${limit}`;
    if (before) {
      endpoint += `&before=${before}`;
    }

    const response = await apiClient.get<Message[]>(endpoint);
    return response.data || [];
  },

  /**
   * Send a message
   */
  async sendMessage(matchId: string, text: string): Promise<Message> {
    const response = await apiClient.post<Message>(
      `/messages/matches/${matchId}/messages`,
      {
        text,
        messageType: 'text',
      } as SendMessageRequest
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to send message');
  },

  /**
   * Mark messages as read
   */
  async markAsRead(matchId: string): Promise<void> {
    await apiClient.put(`/messages/matches/${matchId}/messages/read`);
  },
};
