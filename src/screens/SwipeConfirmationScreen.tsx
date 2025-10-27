import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Modal,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { matchService } from "../services/match.service";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SwipeConfirmationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const swipedUser = location.state?.swipedUser;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock user data if none provided
  const user = swipedUser || {
    name: "Rachel Miller",
    age: 28,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600",
    verified: true,
    jobTitle: "Freelance model",
    tags: ["she/her/hers"]
  };

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
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCancel = () => {
    console.log("❌ User cancelled swipe confirmation");
    navigate(-1); // Go back to swipe screen
  };

  const handleContinue = async () => {
    console.log("✅ User confirmed swipe, processing like...");
    
    try {
      // Process the actual like
      const result = await matchService.like(user.id);
      console.log('💕 Like result:', result);
      
      if (result.isMatch) {
        console.log('🎉 IT\'S A MATCH!');
        // Navigate to match screen or show match modal
        navigate('/matches');
      } else {
        // Continue swiping
        navigate('/swipe');
      }
    } catch (error) {
      console.error("❌ Like error:", error);
      // Still navigate back to continue swiping even if error
      navigate('/swipe');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.8)" translucent />
      
      {/* Background with user photo */}
      <ImageBackground 
        source={{ uri: user.photo }} 
        style={styles.backgroundImage}
        blurRadius={20}
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />
        
        {/* Header */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>HeartSync</Text>
          
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} />
          <View style={[styles.progressBar, styles.progressActive]} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Confirmation Modal */}
          <Animated.View 
            style={[
              styles.confirmationModal,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              }
            ]}
          >
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="arrow-forward" size={28} color="#4ECDC4" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>You've just swiped right!</Text>

            {/* Description */}
            <Text style={styles.modalDescription}>
              By swiping right, you're expressing interest in this person. If they also swipe right on your profile, it's a match! Do you want to continue?
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* User Info at Bottom */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user.name} {user.verified && <Ionicons name="checkmark-circle" size={18} color="#4ECDC4" />}
            </Text>
            
            <View style={styles.userTags}>
              {user.tags?.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.jobContainer}>
              <Ionicons name="briefcase-outline" size={16} color="#fff" />
              <Text style={styles.jobText}>{user.jobTitle}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", 
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progressActive: {
    backgroundColor: "#4ECDC4",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  confirmationModal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  continueButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  userInfo: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  userTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  tagText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  jobContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  jobText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "400",
  },
});
