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

type NavProp = StackNavigationProp<RootStackParamList, "SwipeConfirmation">;
type RoutePropType = RouteProp<RootStackParamList, "SwipeConfirmation">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SwipeConfirmationScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { matchedUser } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Animate the match confirmation
    Animated.sequence([
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
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleSendMessage = () => {
    navigation.navigate("Chat", { user: matchedUser });
  };

  const handleKeepSwiping = () => {
    navigation.navigate("Swipe");
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Hearts animation background */}
      <View style={styles.heartsContainer}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.floatingHeart,
              {
                left: Math.random() * screenWidth,
                top: Math.random() * screenHeight,
                fontSize: 20 + Math.random() * 20,
              },
            ]}
          >
            💕
          </Animated.Text>
        ))}
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Match indicator */}
        <Animated.View
          style={[
            styles.matchIndicator,
            {
              transform: [{ scale: heartScale }],
            },
          ]}
        >
          <Text style={styles.matchText}>IT'S A MATCH!</Text>
          <Text style={styles.heartIcon}>💖</Text>
        </Animated.View>

        {/* User photos */}
        <View style={styles.photosContainer}>
          <View style={styles.photoWrapper}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" }} 
              style={styles.userPhoto} 
            />
            <Text style={styles.photoLabel}>You</Text>
          </View>
          
          <View style={styles.heartBetween}>
            <Text style={styles.heartBetweenIcon}>💕</Text>
          </View>
          
          <View style={styles.photoWrapper}>
            <Image 
              source={{ uri: matchedUser.photos[0] }} 
              style={styles.userPhoto} 
            />
            <Text style={styles.photoLabel}>{matchedUser.name}</Text>
          </View>
        </View>

        {/* Match message */}
        <View style={styles.messageContainer}>
          <Text style={styles.matchTitle}>
            You and {matchedUser.name} liked each other!
          </Text>
          <Text style={styles.matchSubtitle}>
            Start a conversation and get to know each other better
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.sendMessageButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendMessageText}>Send Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.keepSwipingButton}
            onPress={handleKeepSwiping}
          >
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>

        {/* Close button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleKeepSwiping}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
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
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FF4458",
    opacity: 0.9,
  },
  heartsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingHeart: {
    position: "absolute",
    color: "rgba(255, 255, 255, 0.3)",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    width: "100%",
  },
  matchIndicator: {
    alignItems: "center",
    marginBottom: 40,
  },
  matchText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 2,
  },
  heartIcon: {
    fontSize: 50,
  },
  photosContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    width: "100%",
  },
  photoWrapper: {
    alignItems: "center",
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 10,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  heartBetween: {
    marginHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  heartBetweenIcon: {
    fontSize: 40,
    color: "#fff",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 26,
  },
  matchSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  actionButtons: {
    width: "100%",
    alignItems: "center",
  },
  sendMessageButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 15,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendMessageText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4458",
    textAlign: "center",
  },
  keepSwipingButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
    width: "80%",
  },
  keepSwipingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: -180,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
});