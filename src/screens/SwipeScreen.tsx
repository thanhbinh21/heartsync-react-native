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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { UserService, LikeService, User } from "../services";
import { AnimationUtils } from "../utils/animations";

type NavProp = StackNavigationProp<RootStackParamList, "Swipe">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SwipeScreen() {
  const navigation = useNavigation<NavProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Load potential matches on component mount
  useEffect(() => {
    loadPotentialMatches();
    checkDailyLikeCount();
  }, []);

  const loadPotentialMatches = async () => {
    try {
      setLoading(true);
      const potentialMatches = await UserService.getPotentialMatches("user_1", 10);
      setUsers(potentialMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
      Alert.alert("Error", "Failed to load potential matches");
    } finally {
      setLoading(false);
    }
  };

  const checkDailyLikeCount = async () => {
    try {
      const count = await LikeService.getDailyLikeCount("user_1");
      setLikeCount(count);
    } catch (error) {
      console.error("Error checking like count:", error);
    }
  };

  const currentUser = users[currentUserIndex];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      rotate.setValue(gestureState.dx / screenWidth * 0.4);
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, dy } = gestureState;
      const isSwipeRight = dx > 120;
      const isSwipeLeft = dx < -120;
      const isSwipeUp = dy < -120;

      if (isSwipeRight) {
        handleSwipeRight();
      } else if (isSwipeLeft) {
        handleSwipeLeft();
      } else if (isSwipeUp) {
        handleSuperLike();
      } else {
        // Return to center
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleSwipeRight = async () => {
    // Check if user has reached daily like limit
    if (likeCount >= 10) {
      Alert.alert(
        "Daily Like Limit Reached",
        "You've reached your daily limit of 10 likes. Upgrade to Premium for unlimited likes!",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade", onPress: () => navigation.navigate("Subscription" as never) }
        ]
      );
      return;
    }

    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: screenWidth, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      try {
        const result = await LikeService.sendLike("user_1", currentUser.id, "like");
        setLikeCount(prev => prev + 1);
        
        if (result.isMatch) {
          navigation.navigate("SwipeConfirmation", { matchedUser: currentUser });
        }
      } catch (error) {
        console.error("Error liking user:", error);
      }
      nextUser();
    });
  };

  const handleSwipeLeft = async () => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: -screenWidth, y: 0 },
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: -0.4,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      try {
        await LikeService.sendLike("user_1", currentUser.id, "pass");
      } catch (error) {
        console.error("Error passing user:", error);
      }
      nextUser();
    });
  };

  const handleSuperLike = async () => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: 0, y: -screenHeight },
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(async () => {
      try {
        const result = await LikeService.sendLike("user_1", currentUser.id, "super_like");
        if (result.isMatch) {
          navigation.navigate("SwipeConfirmation", { matchedUser: currentUser });
        }
      } catch (error) {
        console.error("Error super liking user:", error);
      }
      nextUser();
    });
  };

  const nextUser = () => {
    pan.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      // Load more users when we reach the end
      loadPotentialMatches();
      setCurrentUserIndex(0);
    }
  };

  const rotateCard = rotate.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-30deg", "0deg", "30deg"],
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.noMoreCards, { fontSize: 18 }]}>Loading potential matches...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.noMoreCards}>No more profiles!</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 10, backgroundColor: '#ff4458', borderRadius: 20 }}
          onPress={loadPotentialMatches}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Load More</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.logo}>HeartSync</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Matches")}>
          <Text style={styles.headerIcon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        {/* Next card (background) */}
        {users[currentUserIndex + 1] && (
          <View style={[styles.card, styles.nextCard]}>
            <Image 
              source={{ uri: users[currentUserIndex + 1].photos[0] }} 
              style={styles.cardImage} 
            />
          </View>
        )}

        {/* Current card */}
        <Animated.View
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
          {...panResponder.panHandlers}
        >
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={() => navigation.navigate("ProfileView", { user: currentUser })}
          >
            <Image source={{ uri: currentUser.photos[0] }} style={styles.cardImage} />
            
            {/* Swipe indicators */}
            <Animated.View
              style={[
                styles.likeLabel,
                {
                  opacity: pan.x.interpolate({
                    inputRange: [0, 120],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Text style={styles.likeLabelText}>LIKE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.nopeLabel,
                {
                  opacity: pan.x.interpolate({
                    inputRange: [-120, 0],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Text style={styles.nopeLabelText}>NOPE</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.superLikeLabel,
                {
                  opacity: pan.y.interpolate({
                    inputRange: [-120, 0],
                    outputRange: [1, 0],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <Text style={styles.superLikeLabelText}>SUPER LIKE</Text>
            </Animated.View>

            {/* User info */}
            <View style={styles.userInfo}>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{currentUser.name}, {currentUser.age}</Text>
                <Text style={styles.userDistance}>{currentUser.distance} km away</Text>
                <Text style={styles.userBio}>{currentUser.bio}</Text>
              </View>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoButtonText}>ℹ️</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.rewindButton]}>
          <Text style={styles.actionButtonText}>↶</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.nopeButton]}
          onPress={handleSwipeLeft}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}
        >
          <Text style={styles.actionButtonText}>⭐</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleSwipeRight}
        >
          <Text style={styles.actionButtonText}>♡</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.boostButton]}
          onPress={() => navigation.navigate("Subscription")}
        >
          <Text style={styles.actionButtonText}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerIcon: {
    fontSize: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#8b5cf6",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.65,
    borderRadius: 20,
    backgroundColor: "#fff",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  likeLabel: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "green",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    transform: [{ rotate: "30deg" }],
  },
  likeLabelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  nopeLabel: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    transform: [{ rotate: "-30deg" }],
  },
  nopeLabelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  superLikeLabel: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    backgroundColor: "#00C6D7",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  superLikeLabelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  userInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  userDistance: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewindButton: {
    backgroundColor: "#f1c40f",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nopeButton: {
    backgroundColor: "#e74c3c",
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  superLikeButton: {
    backgroundColor: "#00C6D7",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  likeButton: {
    backgroundColor: "#2ecc71",
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  boostButton: {
    backgroundColor: "#8b5cf6",
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  noMoreCards: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    color: "#666",
  },
});