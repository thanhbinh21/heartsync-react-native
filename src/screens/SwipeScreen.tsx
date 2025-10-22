import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { matchService } from "../services/match.service";
import { DiscoverUser } from "../types/api";
import { handleApiError } from "../utils/error-handler";

type NavProp = StackNavigationProp<RootStackParamList, "Swipe">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SwipeScreen() {
  const navigation = useNavigation<NavProp>();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading discover users...');
      const discoverUsers = await matchService.getDiscoverUsers();
      console.log('✅ Got users:', discoverUsers.length);
      console.log('📋 Users data:', discoverUsers);
      setUsers(discoverUsers);
      
      if (discoverUsers.length === 0) {
        console.warn('⚠️ No users returned from backend');
        Alert.alert(
          "No Users Available", 
          "There are currently no users to show. This could mean:\n\n" +
          "1. You've already swiped on all available users\n" +
          "2. No other users match your preferences\n" +
          "3. Backend database needs more users\n\n" +
          "Try adjusting your preferences or check back later!",
          [
            { text: "OK" },
            { text: "Reload", onPress: () => loadUsers() }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Load users error:', error);
      Alert.alert("Error", handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users[currentIndex];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      rotate.setValue(gestureState.dx / SCREEN_WIDTH);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 120) {
        handleLike();
      } else if (gestureState.dx < -120) {
        handlePass();
      } else if (gestureState.dy < -120) {
        handleSuperLike();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handlePass = async () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      try {
        await matchService.pass(currentUser.id);
      } catch (error) {
        console.error("Pass error:", error);
      }
      nextCard();
    });
  };

  const handleLike = async () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      try {
        const result = await matchService.like(currentUser.id);
        if (result.isMatch) {
          navigation.navigate("SwipeConfirmation", { matchedUser: currentUser });
        }
      } catch (error) {
        console.error("Like error:", error);
      }
      nextCard();
    });
  };

  const handleSuperLike = async () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      try {
        const result = await matchService.superLike(currentUser.id);
        if (result.isMatch) {
          navigation.navigate("SwipeConfirmation", { matchedUser: currentUser });
        }
      } catch (error) {
        console.error("Super like error:", error);
      }
      nextCard();
    });
  };

  const nextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    setCurrentIndex((prev) => prev + 1);
    
    // Load more users if running low
    if (currentIndex >= users.length - 3) {
      loadUsers();
    }
  };

  const rotateCard = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#9D4EDD" />
      </View>
    );
  }

  if (!currentUser || currentIndex >= users.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="heart-dislike" size={80} color="#ccc" />
        <Text style={styles.noMoreText}>No more users to show</Text>
        <Text style={styles.debugText}>Total users loaded: {users.length}</Text>
        <Text style={styles.debugText}>Current position: {currentIndex + 1}</Text>
        
        {users.length === 0 && (
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>Possible reasons:</Text>
            <Text style={styles.helpBullet}>• Already swiped all users</Text>
            <Text style={styles.helpBullet}>• No users match preferences</Text>
            <Text style={styles.helpBullet}>• Backend needs more users</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.reloadButton} onPress={loadUsers}>
          <Ionicons name="reload" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.reloadText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
          <Ionicons name="chatbubbles" size={28} color="#FF4458" />
        </TouchableOpacity>
        <View style={styles.logoPlaceholder}>
          <Ionicons name="heart" size={24} color="#9D4EDD" />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
          <Ionicons name="options" size={28} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate: rotateCard },
              ],
            },
          ]}
        >
          <Image 
            source={{ uri: currentUser.photos?.[0] || 'https://via.placeholder.com/400' }} 
            style={styles.cardImage} 
          />
          
          {/* Like/Nope Overlay */}
          <Animated.View
            style={[
              styles.likeOverlay,
              {
                opacity: pan.x.interpolate({
                  inputRange: [0, SCREEN_WIDTH / 4],
                  outputRange: [0, 1],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={styles.likeText}>LIKE</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.nopeOverlay,
              {
                opacity: pan.x.interpolate({
                  inputRange: [-SCREEN_WIDTH / 4, 0],
                  outputRange: [1, 0],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <Text style={styles.nopeText}>NOPE</Text>
          </Animated.View>

          {/* User Info */}
          <View style={styles.cardInfo}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {currentUser.name || 'Unknown'}, {currentUser.age || 0}
              </Text>
              <Text style={styles.userBio}>{currentUser.bio || 'No bio'}</Text>
              <View style={styles.distanceRow}>
                <Ionicons name="location" size={14} color="#fff" />
                <Text style={styles.distance}>
                  {currentUser.location || 'Location'} • {currentUser.job || 'Occupation'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => navigation.navigate("ProfileView", { user: currentUser })}
            >
              <Ionicons name="information-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePass}>
          <Ionicons name="close" size={32} color="#FF4458" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={handleSuperLike}>
          <Ionicons name="star" size={24} color="#00C6D7" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  noMoreText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  reloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9D4EDD",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  reloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  debugText: {
    color: "#888",
    fontSize: 14,
    marginTop: 8,
  },
  helpContainer: {
    marginTop: 20,
    paddingHorizontal: 40,
    alignItems: "flex-start",
  },
  helpText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  helpBullet: {
    fontSize: 13,
    color: "#888",
    marginLeft: 10,
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 300,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  likeOverlay: {
    position: "absolute",
    top: 50,
    left: 30,
    borderWidth: 4,
    borderColor: "#4CAF50",
    borderRadius: 8,
    padding: 10,
    transform: [{ rotate: "-20deg" }],
  },
  likeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  nopeOverlay: {
    position: "absolute",
    top: 50,
    right: 30,
    borderWidth: 4,
    borderColor: "#FF4458",
    borderRadius: 8,
    padding: 10,
    transform: [{ rotate: "20deg" }],
  },
  nopeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF4458",
  },
  cardInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 15,
    color: "#fff",
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distance: {
    fontSize: 13,
    color: "#fff",
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
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
    shadowRadius: 4,
    elevation: 3,
  },
  superLikeButton: {
    width: 50,
    height: 50,
  },
  likeButton: {
    width: 60,
    height: 60,
  },
});
