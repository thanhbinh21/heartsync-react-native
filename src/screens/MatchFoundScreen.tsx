import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MatchFoundScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const matchedUser = location.state?.matchedUser;
  const currentUserPhoto = location.state?.currentUserPhoto;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Mock data if none provided
  const user = matchedUser || {
    name: "John",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
  };

  const myPhoto = currentUserPhoto || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600";

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleClose = () => {
    navigate('/matches'); // Navigate to matches list instead of swipe
  };

  const handleSendMessage = () => {
    navigate(`/chat/${matchedUser?.id || 'unknown'}`, { 
      state: { user: matchedUser } 
    });
  };

  const handleKeepSwiping = () => {
    navigate('/swipe');
  };

  // Generate confetti positions
  const confettiItems = Array.from({ length: 30 }, (_, i) => ({
    left: Math.random() * SCREEN_WIDTH,
    top: -50 + Math.random() * 100,
    rotation: Math.random() * 360,
    color: ['#FF6B9D', '#4ECDC4', '#FFD93D', '#9D4EDD', '#4CAF50'][Math.floor(Math.random() * 5)],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Confetti Animation */}
      <View style={styles.confettiContainer}>
        {confettiItems.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                left: item.left,
                backgroundColor: item.color,
                transform: [
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [item.top, SCREEN_HEIGHT + 100],
                    }),
                  },
                  {
                    rotate: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`${item.rotation}deg`, `${item.rotation + 720}deg`],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim }
        ]}
      >
        {/* Title */}
        <Text style={styles.title}>Match found!</Text>

        {/* Photos */}
        <Animated.View 
          style={[
            styles.photosContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {/* Left Photo */}
          <View style={styles.photoWrapper}>
            <Image source={{ uri: myPhoto }} style={styles.photo} />
          </View>

          {/* Heart Icon */}
          <View style={styles.heartContainer}>
            <Ionicons name="heart" size={36} color="#fff" />
          </View>

          {/* Right Photo */}
          <View style={styles.photoWrapper}>
            <Image source={{ uri: user.photo }} style={styles.photo} />
          </View>
        </Animated.View>

        {/* Message */}
        <Text style={styles.message}>
          You've both shown interest in each other! Now go send that first message. Don't wait too long!
        </Text>

        {/* Conversation Starters Button */}
        <TouchableOpacity style={styles.startersButton}>
          <Ionicons name="bulb-outline" size={20} color="#fff" />
          <Text style={styles.startersButtonText}>
            Stuck on what to say? Choose from these conversation starters!
          </Text>
        </TouchableOpacity>

        {/* Message Input */}
        <View style={styles.messageInputContainer}>
          <Ionicons name="bulb-outline" size={20} color="#4ECDC4" style={styles.inputIcon} />
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={20} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        {/* Keep Swiping Link */}
        <TouchableOpacity onPress={handleKeepSwiping} style={styles.keepSwipingLink}>
          <Text style={styles.keepSwipingText}>Keep Swiping</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: "none",
  },
  confetti: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4ECDC4",
    textAlign: "center",
    marginBottom: 40,
  },
  photosContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  photoWrapper: {
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heartContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#9D4EDD",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -15,
    zIndex: 10,
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  startersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 30,
    gap: 10,
  },
  startersButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    flex: 1,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 4,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  keepSwipingLink: {
    paddingVertical: 16,
    alignItems: "center",
  },
  keepSwipingText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
});
