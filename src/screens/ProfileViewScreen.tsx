import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "ProfileView">;
type RoutePropType = RouteProp<RootStackParamList, "ProfileView">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ProfileViewScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock full profile data
  const profile = {
    ...user,
    photos: user.photos || [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    ],
    job: user.job || "Marketing Manager",
    company: user.company || "Tech Startup",
    school: user.education || "UCLA",
    lives: user.location || "Los Angeles",
    distance: user.distance || "2 km away",
    about: user.bio || "Love traveling, good food, and great conversations",
    interests: user.interests || ["Travel", "Coffee", "Music", "Art"],
    basics: {
      height: "5'6\"",
      exercise: "Often",
      education: "Bachelor's",
      drinking: "Socially",
      smoking: "Never",
      kids: "Want someday",
    },
  };

  const handlePhotoScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SCREEN_WIDTH);
    setCurrentPhotoIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Photos Carousel */}
        <View style={styles.photosContainer}>
          <FlatList
            ref={flatListRef}
            data={profile.photos}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.photo} />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handlePhotoScroll}
            scrollEventThrottle={16}
          />
          
          {/* Photo Indicators */}
          <View style={styles.photoIndicators}>
            {profile.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentPhotoIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoContainer}>
          {/* Name & Age */}
          <View style={styles.nameSection}>
            <Text style={styles.name}>
              {profile.name}, {profile.age}
            </Text>
            <Ionicons name="checkmark-circle" size={24} color="#00C6D7" />
          </View>

          {/* Job & School */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
              <Text style={styles.detailText}>
                {profile.job} at {profile.company}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="school-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{profile.school}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="home-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Lives in {profile.lives}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{profile.distance}</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {profile.name}</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Basics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basics</Text>
            <View style={styles.basicsGrid}>
              <View style={styles.basicItem}>
                <Ionicons name="resize-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Height</Text>
                <Text style={styles.basicValue}>{profile.basics.height}</Text>
              </View>
              <View style={styles.basicItem}>
                <Ionicons name="barbell-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Exercise</Text>
                <Text style={styles.basicValue}>{profile.basics.exercise}</Text>
              </View>
              <View style={styles.basicItem}>
                <Ionicons name="school-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Education</Text>
                <Text style={styles.basicValue}>{profile.basics.education}</Text>
              </View>
              <View style={styles.basicItem}>
                <Ionicons name="wine-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Drinking</Text>
                <Text style={styles.basicValue}>{profile.basics.drinking}</Text>
              </View>
              <View style={styles.basicItem}>
                <Ionicons name="cloud-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Smoking</Text>
                <Text style={styles.basicValue}>{profile.basics.smoking}</Text>
              </View>
              <View style={styles.basicItem}>
                <Ionicons name="people-outline" size={24} color="#9D4EDD" />
                <Text style={styles.basicLabel}>Kids</Text>
                <Text style={styles.basicValue}>{profile.basics.kids}</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={32} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]}>
          <Ionicons name="star" size={24} color="#00C6D7" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
          <Ionicons name="heart" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  photosContainer: {
    height: SCREEN_HEIGHT * 0.6,
  },
  photo: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  photoIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 20,
  },
  infoContainer: {
    padding: 20,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  detailsSection: {
    marginBottom: 25,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3E5FF",
    borderWidth: 1,
    borderColor: "#9D4EDD",
  },
  interestText: {
    fontSize: 14,
    color: "#9D4EDD",
    fontWeight: "500",
  },
  basicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  basicItem: {
    width: (SCREEN_WIDTH - 60) / 3,
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },
  basicLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  basicValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 4,
    textAlign: "center",
  },
  actionsContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  superLikeButton: {
    width: 50,
    height: 50,
  },
  likeButton: {
    width: 70,
    height: 70,
  },
});
