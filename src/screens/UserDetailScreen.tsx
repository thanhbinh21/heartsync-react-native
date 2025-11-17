import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigate, useParams, useLocation } from "react-router-native";
import { useAuthContext } from "../context/AuthContext";
import BottomNavigation from "../components/BottomNavigation";
import { getRandomPhoto, getRandomPhotos } from "../utils/photo-utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface DetailItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}

interface ProfileData {
  name: string;
  age: number;
  verified: boolean;
  location: string;
  distance?: string;
  gender: string;
  job: string;
  photos: string[];
  about: string;
  myDetails: DetailItem[];
  interests: string[];
  languages: string[];
}

export default function UserDetailScreen() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const passedUser = location.state?.user;
  const { user: currentUser } = useAuthContext();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Determine if viewing own profile
  const isOwnProfile = userId === currentUser?.id || !userId;

  console.log("🔍 UserDetailScreen Debug:", {
    userId,
    currentUserId: currentUser?.id,
    isOwnProfile,
    passedUser: passedUser?.name,
  });

  // Build profile data
  const profile: ProfileData = (() => {
    // If viewing own profile
    if (isOwnProfile && currentUser) {
      console.log("📱 Loading own profile data");
      return {
        name: currentUser.profile?.name || currentUser.username || "You",
        age: currentUser.profile?.age || 25,
        verified: currentUser.verified || false,
        location: currentUser.profile?.location?.city 
          ? `${currentUser.profile.location.city}, ${currentUser.profile.location.state || 'NV'} ${currentUser.profile.location.zipCode || '89104'}`
          : "Las Vegas, NV 89104",
        distance: undefined,
        gender: currentUser.profile?.gender || "Not specified",
        job: currentUser.profile?.occupation || "Business Analyst at Tech",
        photos: currentUser.profile?.photos || [getRandomPhoto()],
        about: currentUser.profile?.aboutMe || "No bio available",
        myDetails: [
          { icon: "resize-outline", label: currentUser.profile?.height || "5'6\" (168 cm)", color: "#FF6B9D" },
          { icon: "close-circle-outline", label: currentUser.profile?.smoking || "Non-smoker", color: "#9D4EDD" },
          { icon: "paw-outline", label: currentUser.profile?.pets || "Cat lover", color: "#4CAF50" },
          { icon: "school-outline", label: currentUser.profile?.education || "Master degree", color: "#FF9800" },
          { icon: "document-text-outline", label: currentUser.profile?.children || "Want two", color: "#00BCD4" },
          { icon: "heart-outline", label: "Relationship", color: "#E91E63" },
          { icon: "location-outline", label: currentUser.profile?.drinking || "Occasionally", color: "#3F51B5" },
          { icon: "ban-outline", label: currentUser.profile?.religion || "No religious affiliation", color: "#795548" },
        ],
        interests: currentUser.profile?.interests || [
          "Classical Music & Art",
          "Thriller Films",
          "Nature",
          "Biking",
          "Asian Food",
          "Mathematics & Technology",
        ],
        languages: currentUser.profile?.languages || ["English (Native)", "Spanish (Fluent)"],
      };
    }
    
    // If viewing another user (passed from swipe/other screens)
    if (passedUser) {
      console.log("📱 Loading passed user data:", passedUser.name);
      return {
        name: passedUser.name,
        age: passedUser.age,
        verified: passedUser.verified || true,
        location: passedUser.location || "Las Vegas, NV 89104",
        distance: "2.0 kilometers away",
        gender: "she/her/hers",
        job: passedUser.job || "Business Analyst at Tech",
        photos: passedUser.photos || getRandomPhotos(3),
        about: passedUser.bio || "It would be wrong to meet someone who appreciates good arts and enjoys exploring the vibrant culture of the city. I value open-mindedness, good communication, and a shared passion for classical music and fine arts. Also: mother of 2 cats :)",
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
        interests: passedUser.interests || [
          "Classical Music & Art",
          "Thriller Films",
          "Nature",
          "Biking",
          "Asian Food",
          "Mathematics & Technology",
        ],
        languages: ["English (Native)", "Spanish (Fluent)", "Tagalog (Verbal)", "Mandarin Chinese (Verbal)"],
      };
    }

    // Fallback mock data
    console.log("📱 Using fallback mock data");
    return {
      name: "Ava Jones",
      age: 25,
      verified: true,
      location: "Las Vegas, NV 89104",
      distance: "2.0 kilometers away",
      gender: "she/her/hers",
      job: "Business Analyst at Tech",
      photos: getRandomPhotos(3),
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
      languages: ["English (Native)", "Spanish (Fluent)", "Tagalog (Verbal)", "Mandarin Chinese (Verbal)"],
    };
  })();

  // Edit state
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({
    name: profile.name,
    age: profile.age,
    job: profile.job,
    about: profile.about,
  });

  const handleSave = () => {
    console.log("💾 Saving profile:", editedProfile);
    // TODO: Call API to update profile
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setEditedProfile({
      name: profile.name,
      age: profile.age,
      job: profile.job,
      about: profile.about,
    });
    setIsEditMode(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigate(-1)}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>HeartSync</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        {/* Main Photo */}
        <View style={styles.photoContainer}>
          <Image 
            source={{ uri: profile.photos[currentPhotoIndex] }} 
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          
          {/* Name Badge Overlay */}
          <View style={styles.nameBadge}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              {profile.verified && (
                <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
              )}
            </View>
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>{profile.gender}</Text>
            </View>
            <View style={styles.jobRow}>
              <Ionicons name="briefcase-outline" size={14} color="#666" />
              <Text style={styles.jobText}>{profile.job}</Text>
            </View>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#4ECDC4" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>
          {profile.distance && (
            <View style={styles.distanceRow}>
              <Ionicons name="navigate" size={16} color="#999" />
              <Text style={styles.distanceText}>{profile.distance}</Text>
            </View>
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About me</Text>
          <Text style={styles.aboutText}>{profile.about}</Text>
        </View>

        {/* My Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My details</Text>
          <View style={styles.detailsList}>
            {profile.myDetails.map((detail, index) => (
              <View key={index} style={styles.detailRow}>
                <Ionicons name={detail.icon} size={20} color={detail.color} />
                <Text style={styles.detailText}>{detail.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I enjoy</Text>
          <View style={styles.interestsContainer}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Languages */}
        {profile.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I communicate in</Text>
            <View style={styles.languagesContainer}>
              {profile.languages.map((language, index) => (
                <View key={index} style={styles.languageChip}>
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Photo Gallery */}
        {profile.photos.length > 1 && (
          <View style={styles.section}>
            <View style={styles.galleryGrid}>
              {profile.photos.slice(1).map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.galleryItem}
                  onPress={() => setCurrentPhotoIndex(index + 1)}
                >
                  <Image
                    source={{ uri: photo }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Bottom Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.passBtn}>
              <Ionicons name="close" size={32} color="#FF6B6B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeBtn}>
              <Ionicons name="checkmark" size={32} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        )}

        {/* Hide and Report */}
        {!isOwnProfile && (
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportText}>Hide and Report Profile</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.5,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: "#F0F0F0",
    position: "relative",
  },
  mainPhoto: {
    width: "100%",
    height: "100%",
  },
  nameBadge: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
  },
  genderBadge: {
    backgroundColor: "#E8F5F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  genderText: {
    fontSize: 11,
    color: "#4ECDC4",
    fontWeight: "600",
  },
  jobRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  jobText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  locationSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  distanceText: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  aboutText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  detailsList: {
    gap: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  interestText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  languagesContainer: {
    gap: 10,
  },
  languageChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  languageText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  galleryItem: {
    width: (SCREEN_WIDTH - 56) / 3,
    height: (SCREEN_WIDTH - 56) / 3 * 1.3,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 24,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  passBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#FF6B6B",
  },
  likeBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  reportButton: {
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  reportText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
});
