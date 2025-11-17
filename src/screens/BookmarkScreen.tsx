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
  Modal,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { matchService } from "../services/match.service";
import { DiscoverUser } from "../types/api";
import { handleApiError } from "../utils/error-handler";
import BottomNavigation from "../components/BottomNavigation";
import { useAuthContext } from "../context/AuthContext";
import { getRandomPhoto } from "../utils/photo-utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function BookmarkScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuthContext();
  const [allUsers, setAllUsers] = useState<DiscoverUser[]>([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingLikeUser, setPendingLikeUser] = useState<DiscoverUser | null>(null);
  const [matchData, setMatchData] = useState<{ matchId: string | null; user: DiscoverUser } | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;
  const modalFade = useRef(new Animated.Value(0)).current;

  const users = allUsers;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading bookmarked users...');
      const discoverUsers = await matchService.getDiscoverUsers();
      
      // Lấy users từ index 2 đến 7 (5 users)
      const bookmarkedUsers = discoverUsers.slice(2, 7);
      console.log('✅ Got bookmarked users:', bookmarkedUsers.length);
      console.log('📋 Users data:', bookmarkedUsers);
      
      setCurrentIndex(0);
      setAllUsers(bookmarkedUsers);
      
      if (bookmarkedUsers.length === 0) {
        console.warn('⚠️ No bookmarked users');
        Alert.alert(
          "No Bookmarked Users", 
          "You don't have any bookmarked users yet. Start swiping to save your favorites!",
          [
            { text: "OK" },
            { text: "Go to Swipe", onPress: () => navigate("/swipe") }
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

  const handleLike = () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      console.log('👍 Swiped right on:', currentUser.name);
      setPendingLikeUser(currentUser);
      setShowConfirmationModal(true);
      
      Animated.parallel([
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalFade, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      nextCard();
    });
  };

  const handleCancelLike = () => {
    console.log('❌ User cancelled like confirmation');
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmationModal(false);
      setPendingLikeUser(null);
    });
  };

  const handleConfirmLike = async () => {
    if (!pendingLikeUser) {
      console.log('⚠️ No pending like user');
      return;
    }
    
    console.log('✅ User confirmed like, processing...', pendingLikeUser.name);
    
    Animated.parallel([
      Animated.timing(modalScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmationModal(false);
    });

    try {
      const result = await matchService.like(pendingLikeUser.id);
      
      if (result.isMatch) {
        navigate('/match-found', {
          state: {
            matchedUser: pendingLikeUser,
            currentUserPhoto: authUser?.profile?.photos?.[0] || getRandomPhoto(),
            matchId: result.matchId,
          }
        });
      }
      setPendingLikeUser(null);
    } catch (error) {
      console.error("❌ Like error:", error);
      Alert.alert("Error", handleApiError(error));
      setPendingLikeUser(null);
    }
  };

  const handleSuperLike = async () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
      duration: 300,
      useNativeDriver: false,
    }).start(async () => {
      try {
        console.log('⭐ Super liking user:', currentUser.name);
        const result = await matchService.superLike(currentUser.id);
        console.log('💖 Super like result:', result);
        
        if (result.isMatch) {
          console.log('🎉 IT\'S A SUPER MATCH!');
          setMatchData({
            matchId: result.matchId,
            user: currentUser
          });
          setShowMatchModal(true);
        }
      } catch (error) {
        console.error("❌ Super like error:", error);
        Alert.alert("Error", handleApiError(error));
      }
      nextCard();
    });
  };

  const nextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    rotate.setValue(0);
    setCurrentIndex((prev) => prev + 1);
    
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
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#5AC8FA" />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser || currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.centerContent]}>
          <Ionicons name="heart-dislike" size={80} color="#ccc" />
          <Text style={styles.noMoreText}>No more bookmarked users</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={loadUsers}>
            <Text style={styles.reloadText}>Reload</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              console.log('🔄 Reloading users...');
              loadUsers();
            }}
          >
            <Ionicons name="refresh" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>💜 Bookmarked</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigate("/swipe")}
          >
            <Ionicons name="arrow-back" size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar} />
        <View style={[styles.progressBar, styles.progressBarInactive]} />
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        {/* Next Card Preview (behind) */}
        {users[currentIndex + 1] && (
          <View style={[styles.card, styles.nextCard]}>
            <Image 
              source={{ uri: users[currentIndex + 1].photos?.[0] || getRandomPhoto() }} 
              style={styles.cardImage} 
            />
          </View>
        )}

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
            source={{ uri: currentUser.photos?.[0] || getRandomPhoto() }} 
            style={styles.cardImage} 
          />
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.gradientOverlay}
          />

          {/* Swipe Instructions Overlay */}
          <View style={styles.instructionsOverlay}>
            {/* Right Swipe */}
            <View style={styles.rightSwipeInstruction}>
              <Ionicons name="arrow-forward" size={24} color="#fff" style={styles.instructionIcon} />
              <Text style={styles.instructionTitle}>Swipe right if you like</Text>
              <Text style={styles.instructionSubtitle}>
                If the person also swipes right on you,{'\n'}
                it's a match and you can connect.
              </Text>
            </View>

            {/* Left Swipe */}
            <View style={styles.leftSwipeInstruction}>
              <Ionicons name="arrow-back" size={24} color="#fff" style={styles.instructionIcon} />
              <Text style={styles.instructionTitle}>Swipe left to pass</Text>
              <Text style={styles.instructionSubtitle}>
                If the person is not your cup of tea,{'\n'}
                simply pass. It's that easy!
              </Text>
            </View>
          </View>

          {/* User Info at Bottom */}
          <View style={styles.cardInfo}>
            <TouchableOpacity
              onPress={() => {
                console.log("👤 Navigating to user detail:", currentUser.id);
                navigate(`/user-detail/${currentUser.id}`, {
                  state: { user: currentUser }
                });
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.userName}>
                {currentUser.name || 'Unknown'}, {currentUser.age || 0}{' '}
                {currentUser.verified && (
                  <Ionicons name="checkmark-circle" size={22} color="#4ECDC4" />
                )}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.userDetails}>
              <View style={styles.genderTag}>
                <Text style={styles.genderText}>she/her/hers</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="briefcase-outline" size={14} color="#fff" />
              <Text style={styles.locationText}>
                {currentUser.job || 'Business Analyst'} at {currentUser.location || 'Tech'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/bookmark" />

      {/* Confirmation Modal (when swipe right) */}
      <Modal
        visible={showConfirmationModal}
        transparent
        animationType="none"
        onRequestClose={handleCancelLike}
      >
        <View style={styles.confirmationOverlay}>
          <Animated.View 
            style={[
              styles.confirmationModal,
              {
                transform: [{ scale: modalScale }],
                opacity: modalFade,
              }
            ]}
          >
            {/* Success Icon */}
            <View style={styles.confirmIconContainer}>
              <View style={styles.confirmIconCircle}>
                <Ionicons name="arrow-forward" size={28} color="#4ECDC4" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.confirmTitle}>You've just swiped right!</Text>

            {/* Description */}
            <Text style={styles.confirmDescription}>
              By swiping right, you're expressing interest in this person. If they also swipe right on your profile, it's a match! Do you want to continue?
            </Text>

            {/* Action Buttons */}
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity 
                style={styles.confirmCancelButton}
                onPress={handleCancelLike}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmContinueButton}
                onPress={handleConfirmLike}
              >
                <Text style={styles.confirmContinueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Match Modal */}
      <Modal
        visible={showMatchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMatchModal(false)}
      >
        <View style={styles.matchModalOverlay}>
          <View style={styles.matchModalContainer}>
            <View style={styles.matchModalContent}>
              <View style={styles.matchIconsContainer}>
                <Ionicons name="heart" size={80} color="#FF6B9D" />
                <Text style={styles.matchTitle}>It's a Match! 🎉</Text>
              </View>

              {matchData && (
                <>
                  <View style={styles.matchUserContainer}>
                    {matchData.user.photos && matchData.user.photos.length > 0 && (
                      <Image
                        source={{ uri: matchData.user.photos[0] }}
                        style={styles.matchUserPhoto}
                      />
                    )}
                    <Text style={styles.matchUserName}>{matchData.user.name}</Text>
                    <Text style={styles.matchText}>
                      You and {matchData.user.name} liked each other!
                    </Text>
                  </View>

                  <View style={styles.matchModalButtons}>
                    <TouchableOpacity
                      style={styles.sendMessageBtn}
                      onPress={() => {
                        setShowMatchModal(false);
                        navigate(`/chat/${matchData.matchId}`, { 
                          state: { user: matchData.user }
                        });
                      }}
                    >
                      <Text style={styles.sendMessageText}>Send Message 💬</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.keepSwipingBtn}
                      onPress={() => setShowMatchModal(false)}
                    >
                      <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreText: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    fontWeight: "600",
  },
  reloadButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: "#5AC8FA",
    borderRadius: 25,
  },
  reloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerLeft: {
    width: 50,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    width: 50,
    alignItems: "flex-end",
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9D4EDD",
    marginTop: 2,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "#fff",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#5AC8FA",
    borderRadius: 2,
  },
  progressBarInactive: {
    backgroundColor: "#E0E0E0",
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "center",
  },
  card: {
    width: SCREEN_WIDTH - 32,
    height: CARD_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  nextCard: {
    position: "absolute",
    zIndex: -1,
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  instructionsOverlay: {
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  rightSwipeInstruction: {
    alignItems: "flex-end",
    marginBottom: 50,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  leftSwipeInstruction: {
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  instructionIcon: {
    marginBottom: 6,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  instructionSubtitle: {
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "left",
    lineHeight: 16,
  },
  cardInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  userName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  genderTag: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  genderText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#fff",
  },
  matchModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  matchModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: SCREEN_WIDTH - 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  matchModalContent: {
    alignItems: 'center',
  },
  matchIconsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  matchUserContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  matchUserPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  matchUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  matchModalButtons: {
    width: '100%',
    gap: 15,
  },
  sendMessageBtn: {
    backgroundColor: "#FF6B9D",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  sendMessageText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  keepSwipingBtn: {
    paddingVertical: 12,
  },
  keepSwipingText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  // Confirmation Modal Styles
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationModal: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 30,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  confirmIconContainer: {
    marginBottom: 24,
  },
  confirmIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  confirmDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  confirmButtonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  confirmCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  confirmCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmContinueButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
  },
  confirmContinueText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
