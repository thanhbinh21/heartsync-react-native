import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavigationProps {
  activeRoute?: string;
}

export default function BottomNavigation({ activeRoute }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active route from location if not provided
  const currentRoute = activeRoute || location.pathname;

  const isActive = (route: string) => {
    return currentRoute.includes(route);
  };

  return (
    <View style={styles.container}>
      {/* Profile Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/subscription")}
      >
        <Ionicons 
          name={isActive("/subscription") ? "person" : "person-outline"} 
          size={28} 
          color={isActive("/subscription") ? "#00BCD4" : "#999"} 
        />
      </TouchableOpacity>

      {/* Likes Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/swipe")}
      >
        <Ionicons 
          name={isActive("/swipe") ? "heart" : "heart-outline"} 
          size={28} 
          color={isActive("/swipe") ? "#00BCD4" : "#999"} 
        />
      </TouchableOpacity>

      {/* Saved Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/matches")}
      >
        <Ionicons 
          name="bookmark-outline"
          size={28} 
          color="#999" 
        />
      </TouchableOpacity>

      {/* Messages Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/matches")}
      >
        <Ionicons 
          name={isActive("/matches") || isActive("/chat") ? "chatbubble" : "chatbubble-outline"} 
          size={28} 
          color={isActive("/matches") || isActive("/chat") ? "#00BCD4" : "#999"} 
        />
        {/* Badge for unread messages */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navButton: {
    padding: 12,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
