import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "SwipeConfirmation">;
type RoutePropType = RouteProp<RootStackParamList, "SwipeConfirmation">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SwipeConfirmationScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { matchedUser } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={[styles.floatingHeart, {
            left: Math.random() * SCREEN_WIDTH,
            top: Math.random() * 800,
            fontSize: 20 + Math.random() * 20,
          }]}>
            💕
          </Text>
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Match Text */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>IT'S A MATCH!</Text>
          <Text style={styles.heartIcon}>💖</Text>
        </View>

        {/* User Photos */}
        <View style={styles.photosContainer}>
          <View style={styles.photoWrapper}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" }} 
              style={styles.userPhoto} 
            />
          </View>
          
          <View style={styles.heartBetween}>
            <Ionicons name="heart" size={40} color="#fff" />
          </View>
          
          <View style={styles.photoWrapper}>
            <Image 
              source={{ uri: matchedUser.photos?.[0] || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300" }} 
              style={styles.userPhoto} 
            />
          </View>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>
            You and {matchedUser.name} liked each other!
          </Text>
          <Text style={styles.messageSubtitle}>
            Start a conversation and get to know each other
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.sendMessageButton}
            onPress={() => navigation.navigate("Chat", { user: matchedUser })}
          >
            <Text style={styles.sendMessageText}>Send Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.keepSwipingButton}
            onPress={() => navigation.navigate("Swipe")}
          >
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF4458",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingHeart: {
    position: "absolute",
    opacity: 0.3,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  matchBadge: {
    alignItems: "center",
    marginBottom: 40,
  },
  matchText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    marginBottom: 10,
  },
  heartIcon: {
    fontSize: 50,
  },
  photosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  photoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  userPhoto: {
    width: "100%",
    height: "100%",
  },
  heartBetween: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF4458",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: -20,
    zIndex: 10,
    borderWidth: 3,
    borderColor: "#fff",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  messageSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  actionButtons: {
    width: "100%",
    gap: 15,
  },
  sendMessageButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  sendMessageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF4458",
  },
  keepSwipingButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  keepSwipingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
