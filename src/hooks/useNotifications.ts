import { useState, useEffect } from 'react';
import { notificationService } from '../services/notification.service';

export function useNotifications(pollInterval = 10000) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    // Poll for updates
    const interval = setInterval(fetchUnreadCount, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { unreadCount, isLoading, refresh: fetchUnreadCount };
}
