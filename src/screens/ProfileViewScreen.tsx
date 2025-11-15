import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigate, useParams, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";
import { useAuthContext } from "../context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileViewScreen() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const passedUser = location.state?.user;
  const { user: currentUser } = useAuthContext();
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Debug logging
  console.log("📱 ProfileViewScreen - userId:", userId);
  console.log("📱 ProfileViewScreen - currentUser ID:", currentUser?.id);
  console.log("📱 ProfileViewScreen - passedUser:", passedUser?.name);

  // Determine if this is viewing own profile
  const isOwnProfile = userId === currentUser?.id;
  
  // Use current user data if viewing own profile, otherwise use passed user or mock data
  const profile = (() => {
    if (isOwnProfile && currentUser?.profile) {
      console.log("📱 Using current user profile data");
      return {
        name: currentUser.profile.name,
        age: currentUser.profile.age,
        verified: true,
        location: currentUser.profile.location?.zipCode || "Unknown location",
        distance: "Your location",
        gender: currentUser.profile.gender,
        job: currentUser.profile.occupation || "Not specified",
        photos: currentUser.profile.photos || [
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600",
        ],
        about: currentUser.profile.aboutMe || "No bio available",
        myDetails: [
          { icon: "resize-outline", label: currentUser.profile.height || "Not specified", color: "#FF6B9D" },
          { icon: "close-circle-outline", label: currentUser.profile.smoking || "Not specified", color: "#9D4EDD" },
          { icon: "paw-outline", label: currentUser.profile.pets || "Not specified", color: "#4CAF50" },
          { icon: "school-outline", label: currentUser.profile.education || "Not specified", color: "#FF9800" },
          { icon: "document-text-outline", label: currentUser.profile.children || "Not specified", color: "#00BCD4" },
          { icon: "wine-outline", label: currentUser.profile.drinking || "Not specified", color: "#3F51B5" },
          { icon: "star-outline", label: currentUser.profile.zodiac || "Not specified", color: "#795548" },
        ],
        interests: currentUser.profile.interests || [],
        languages: currentUser.profile.languages || [],
      };
    }
    
    // Fallback to passed user or mock data
    console.log("📱 Using passed user or mock data");
    return {
      name: passedUser?.name || "Ava Jones",
      age: passedUser?.age || 25,
      verified: true,
      location: "Las Vegas, NV 89104",
      distance: "2.0 kilometers away",
      gender: "she/her/hers",
      job: "Business Analyst at Tech",
      photos: passedUser?.photos || [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
      ],
      about: "It would be wrong to meet someone who appreciates good arts and enjoys exploring the vibrant culture of the city. I value open-mindedness, good communication, and a shared passion for classical music and fine arts. Also: mother of 2 cats :)",
      myDetails: [
        { icon: "resize-outline", label: "5'6\" (168 cm)", color: "#FF6B9D" },
        { icon: "close-circle-outline", label: "Non-smoker", color: "#9D4EDD" },
        { icon: "paw-outline", label: "Cat lover", color: "#4CAF50" },
        { icon: "school-outline", label: "Master degree", color: "#FF9800" },
        { icon: "document-text-outline", label: "Want two", color: "#00BCD4" },
        { icon: "heart-outline", label: "Relationship", color: "#E91E63" },
        { icon: "location-outline", label: "Occasionally", color: "#3F51B5" },
        { icon: "ban-outline", label: "No religious affiliation", color: "#795548" },
      ],
      interests: [
        "Classical Music & Art",
        "Thriller Films", 
        "Nature",
        "Biking",
        "Asian Food",
        "Mathematics & Technology",
      ],
      languages: [
        "English (Native)",
        "Spanish (Fluent)",
        "Tagalog (Verbal)",
        "Mandarin Chinese (Verbal)",
      ],
    };
  })();

  const handlePhotoScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setCurrentPhotoIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Full Screen Photo Background */}
      <ImageBackground 
        source={{ uri: profile.photos[0] }} 
        style={styles.photoBackground}
        resizeMode="cover"
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigate(-1)}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.gradientOverlay}
        >
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              {profile.verified && (
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
              )}
            </View>
            
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#fff" />
              <Text style={styles.location}>{profile.location}</Text>
            </View>
            
            <Text style={styles.job}>{profile.job}</Text>
          </View>

          {/* Action Buttons - Only for own profile */}
          {isOwnProfile && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => {
                  console.log("❌ Back to Create Profile");
                  navigate('/create-profile');
                }}
              >
                <Ionicons name="pencil" size={24} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.homeButton}
                onPress={() => {
                  console.log("✅ Go to Home/Swipe");
                  navigate('/swipe');
                }}
              >
                <Ionicons name="checkmark" size={24} color="#fff" />
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>

      {/* Scrollable Content */}
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>

          {/* Basic Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="resize-outline" size={20} color="#FF6B9D" />
                <Text style={styles.detailText}>Height: {profile.myDetails[0]?.label || "Not specified"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="school-outline" size={20} color="#9D4EDD" />
                <Text style={styles.detailText}>Education: {profile.myDetails[3]?.label || "Not specified"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="briefcase-outline" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>Job: {profile.job}</Text>
              </View>
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.slice(0, 6).map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  photoBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
    gap: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  gradientOverlay: {
    padding: 20,
    paddingBottom: 30,
  },
  profileInfo: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  location: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  job: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(157,78,221,0.95)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76,217,100,0.95)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
    minWidth: 120,
    justifyContent: "center",
    shadowColor: "#4CD964",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#222",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  aboutText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
  },
  detailsContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#F5F0FA",
    borderWidth: 1.5,
    borderColor: "#E8D5F5",
  },
  interestText: {
    fontSize: 14,
    color: "#7209B7",
    fontWeight: "600",
  },
});
