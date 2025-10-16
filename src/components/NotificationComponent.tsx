import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface NotificationProps {
  type: "match" | "message" | "like" | "super_like";
  title: string;
  message: string;
  userPhoto?: string;
  onPress?: () => void;
  onDismiss?: () => void;
  visible: boolean;
  duration?: number;
}

export default function NotificationComponent({
  type,
  title,
  message,
  userPhoto,
  onPress,
  onDismiss,
  visible,
  duration = 4000,
}: NotificationProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show notification
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const getNotificationIcon = () => {
    switch (type) {
      case "match":
        return "💕";
      case "message":
        return "💬";
      case "like":
        return "❤️";
      case "super_like":
        return "⭐";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = () => {
    switch (type) {
      case "match":
        return "#FF4458";
      case "message":
        return "#8b5cf6";
      case "like":
        return "#2ecc71";
      case "super_like":
        return "#00C6D7";
      default:
        return "#8b5cf6";
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          borderLeftColor: getNotificationColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          {userPhoto ? (
            <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
          ) : (
            <View style={[styles.iconBackground, { backgroundColor: getNotificationColor() }]}>
              <Text style={styles.icon}>{getNotificationIcon()}</Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>

        <TouchableOpacity style={styles.dismissButton} onPress={hideNotification}>
          <Text style={styles.dismissIcon}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    marginRight: 12,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    color: "#fff",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  dismissIcon: {
    fontSize: 12,
    color: "#666",
  },
});