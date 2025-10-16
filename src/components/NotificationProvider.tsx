import React, { useState, useCallback } from "react";
import NotificationComponent from "./NotificationComponent";

interface Notification {
  id: string;
  type: "match" | "message" | "like" | "super_like";
  title: string;
  message: string;
  userPhoto?: string;
  onPress?: () => void;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    setTimeout(() => {
      hideNotification(id);
    }, notification.duration || 4000);
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map(notification => (
        <NotificationComponent
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          userPhoto={notification.userPhoto}
          onPress={notification.onPress}
          onDismiss={() => hideNotification(notification.id)}
          visible={true}
          duration={notification.duration}
        />
      ))}
    </NotificationContext.Provider>
  );
};

// Hook for common notification types
export const useCommonNotifications = () => {
  const { showNotification } = useNotifications();

  const showMatchNotification = (userName: string, userPhoto: string, onPress?: () => void) => {
    showNotification({
      type: "match",
      title: "It's a Match!",
      message: `You and ${userName} liked each other`,
      userPhoto,
      onPress,
      duration: 5000,
    });
  };

  const showMessageNotification = (userName: string, message: string, userPhoto: string, onPress?: () => void) => {
    showNotification({
      type: "message",
      title: `New message from ${userName}`,
      message,
      userPhoto,
      onPress,
      duration: 4000,
    });
  };

  const showLikeNotification = (userName: string, userPhoto: string, onPress?: () => void) => {
    showNotification({
      type: "like",
      title: "Someone likes you!",
      message: `${userName} liked your profile`,
      userPhoto,
      onPress,
      duration: 3000,
    });
  };

  const showSuperLikeNotification = (userName: string, userPhoto: string, onPress?: () => void) => {
    showNotification({
      type: "super_like",
      title: "You got a Super Like!",
      message: `${userName} super liked your profile`,
      userPhoto,
      onPress,
      duration: 5000,
    });
  };

  return {
    showMatchNotification,
    showMessageNotification,
    showLikeNotification,
    showSuperLikeNotification,
  };
};