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
          size={26} 
          color={isActive("/subscription") ? "#9D4EDD" : "#999"} 
        />
      </TouchableOpacity>

      {/* Likes Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/swipe")}
      >
        <Ionicons 
          name={isActive("/swipe") ? "heart" : "heart-outline"} 
          size={26} 
          color={isActive("/swipe") ? "#9D4EDD" : "#999"} 
        />
      </TouchableOpacity>

      {/* Saved Tab */}
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => navigate("/matches")}
      >
        <Ionicons 
          name="bookmark-outline"
          size={26} 
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
          size={26} 
          color={isActive("/matches") || isActive("/chat") ? "#9D4EDD" : "#999"} 
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  navButton: {
    padding: 10,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF6B9D",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
