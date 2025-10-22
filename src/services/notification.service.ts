import { apiClient } from './api-client';
import { Notification, UnreadCountResponse } from '../types/api';

export const notificationService = {
  /**
   * Get all notifications
   */
  async getNotifications(unreadOnly = false, limit = 50): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(
      `/notifications?unreadOnly=${unreadOnly}&limit=${limit}`
    );
    return response.data || [];
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread/count');
    return response.data?.count || 0;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all');
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
