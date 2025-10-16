import { apiClient } from './apiClient';
import { Message } from './types';

export class MessageService {
  // Get messages for a match
  static async getMatchMessages(matchId: string): Promise<Message[]> {
    try {
      const messages = await apiClient.get<Message[]>('/messages');
      return messages
        .filter(message => message.matchId === matchId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a new message
  static async sendMessage(
    matchId: string,
    senderId: string,
    receiverId: string,
    text: string,
    messageType: 'text' | 'image' | 'emoji' = 'text'
  ): Promise<Message> {
    try {
      const newMessage: Omit<Message, 'id'> = {
        matchId,
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString(),
        isRead: false,
        messageType
      };

      const message = await apiClient.post<Message>('/messages', {
        ...newMessage,
        id: Date.now().toString()
      });

      // Update the match with the last message ID
      await apiClient.patch(`/matches/${matchId}`, {
        lastMessageId: message.id
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  static async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      const updatePromises = messageIds.map(id =>
        apiClient.patch(`/messages/${id}`, { isRead: true })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count for a user
  static async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const messages = await apiClient.get<Message[]>('/messages');
      return messages.filter(
        message => message.receiverId === userId && !message.isRead
      ).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete a message
  static async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiClient.delete(`/messages/${messageId}`);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Get last message for each match
  static async getLastMessagesForMatches(matchIds: string[]): Promise<{ [matchId: string]: Message }> {
    try {
      const messages = await apiClient.get<Message[]>('/messages');
      const lastMessages: { [matchId: string]: Message } = {};

      matchIds.forEach(matchId => {
        const matchMessages = messages
          .filter(message => message.matchId === matchId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        if (matchMessages.length > 0) {
          lastMessages[matchId] = matchMessages[0];
        }
      });

      return lastMessages;
    } catch (error) {
      console.error('Error getting last messages:', error);
      throw error;
    }
  }
}