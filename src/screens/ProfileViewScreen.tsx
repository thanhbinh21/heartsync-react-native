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

type NavProp = StackNavigationProp<RootStackParamList, "ProfileView">;
type RoutePropType = RouteProp<RootStackParamList, "ProfileView">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ProfileViewScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Mock expanded user data
  const userProfile = {
    ...user,
    photos: [
      user.photos[0],
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    ],
    job: "Marketing Manager",
    company: "Tech Solutions Inc.",
    education: "University of California",
    height: "5'6\"",
    zodiac: "Gemini",
    lifestyle: {
      smoking: "Never",
      drinking: "Socially",
      workout: "Often",
      diet: "Vegetarian"
    },
    about: "I love exploring new places and trying different cuisines. Weekend warrior who enjoys hiking and photography. Looking for someone to share adventures with!",
    interests: ["Travel", "Photography", "Hiking", "Food", "Art", "Music"],
  };

  const handlePhotoScroll = (event: any) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / screenWidth);
    setCurrentPhotoIndex(index);
  };

  const handleLike = () => {
    // Handle like action
    navigation.goBack();
  };

  const handlePass = () => {
    // Handle pass action
    navigation.goBack();
  };

  const handleSuperLike = () => {
    // Handle super like action
    navigation.navigate("SwipeConfirmation", { matchedUser: user });
  };

  const renderPhoto = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.photo} />
  );

  const renderInterest = ({ item }: { item: string }) => (
    <View style={styles.interestTag}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>↓</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.shareButton}>⋯</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Photos Section */}
        <View style={styles.photosContainer}>
          <FlatList
            ref={flatListRef}
            data={userProfile.photos}
            renderItem={renderPhoto}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handlePhotoScroll}
            scrollEventThrottle={16}
          />
          
          {/* Photo indicators */}
          <View style={styles.photoIndicators}>
            {userProfile.photos.map((_: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentPhotoIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.basicInfo}>
            <Text style={styles.userName}>
              {userProfile.name}, {userProfile.age}
            </Text>
            <Text style={styles.distance}>
              📍 {userProfile.distance} km away
            </Text>
          </View>

          {/* Job & Education */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>💼</Text>
              <Text style={styles.infoText}>
                {userProfile.job} at {userProfile.company}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🎓</Text>
              <Text style={styles.infoText}>{userProfile.education}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📏</Text>
              <Text style={styles.infoText}>{userProfile.height}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⭐</Text>
              <Text style={styles.infoText}>{userProfile.zodiac}</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About {userProfile.name}</Text>
            <Text style={styles.aboutText}>{userProfile.about}</Text>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <FlatList
              data={userProfile.interests}
              renderItem={renderInterest}
              keyExtractor={(item) => item}
              numColumns={3}
              scrollEnabled={false}
            />
          </View>

          {/* Lifestyle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lifestyle</Text>
            <View style={styles.lifestyleGrid}>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleIcon}>🚭</Text>
                <Text style={styles.lifestyleLabel}>Smoking</Text>
                <Text style={styles.lifestyleValue}>{userProfile.lifestyle.smoking}</Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleIcon}>🍷</Text>
                <Text style={styles.lifestyleLabel}>Drinking</Text>
                <Text style={styles.lifestyleValue}>{userProfile.lifestyle.drinking}</Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleIcon}>💪</Text>
                <Text style={styles.lifestyleLabel}>Workout</Text>
                <Text style={styles.lifestyleValue}>{userProfile.lifestyle.workout}</Text>
              </View>
              <View style={styles.lifestyleItem}>
                <Text style={styles.lifestyleIcon}>🥗</Text>
                <Text style={styles.lifestyleLabel}>Diet</Text>
                <Text style={styles.lifestyleValue}>{userProfile.lifestyle.diet}</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.superLikeButton} onPress={handleSuperLike}>
          <Text style={styles.actionButtonText}>⭐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.actionButtonText}>♡</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 40,
    height: 40,
    textAlign: "center",
    lineHeight: 40,
    borderRadius: 20,
  },
  shareButton: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: 40,
    height: 40,
    textAlign: "center",
    lineHeight: 40,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  photosContainer: {
    height: screenHeight * 0.6,
    position: "relative",
  },
  photo: {
    width: screenWidth,
    height: "100%",
    resizeMode: "cover",
  },
  photoIndicators: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  indicator: {
    width: "30%",
    height: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  userInfoContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  basicInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 5,
  },
  distance: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    marginBottom: 25,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 16,
    color: "#111",
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 15,
  },
  aboutText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  interestTag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  interestText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  lifestyleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  lifestyleItem: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  lifestyleIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  lifestyleLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  lifestyleValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  bottomSpacer: {
    height: 100,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  passButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  superLikeButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#00C6D7",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
});