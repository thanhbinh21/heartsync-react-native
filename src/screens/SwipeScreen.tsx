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
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { matchService } from "../services/match.service";
import { DiscoverUser } from "../types/api";
import { handleApiError } from "../utils/error-handler";
import BottomNavigation from "../components/BottomNavigation";
import { useAuthContext } from "../context/AuthContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function SwipeScreen() {
  const navigate = useNavigate();
  const { user: authUser } = useAuthContext();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
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

  const handleLike = () => {
    if (!currentUser) return;
    
    Animated.timing(pan, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      // Show confirmation modal
      console.log('👍 Swiped right on:', currentUser.name);
      setPendingLikeUser(currentUser);
      setShowConfirmationModal(true);
      
      // Animate modal in
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
    
    // Close confirmation modal first
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
      console.log('📡 Calling matchService.like for user:', pendingLikeUser.id);
      console.log('👤 Pending like user data:', JSON.stringify(pendingLikeUser, null, 2));
      const result = await matchService.like(pendingLikeUser.id);
      console.log('💕 Like result received:', JSON.stringify(result, null, 2));
      
      // 🧪 FORCE MATCH FOR TESTING - Remove this in production
      const isMatch = true; // Force match for testing
      // const isMatch = result.isMatch; // Use this in production
      
      if (isMatch) {
        console.log('🎉 IT\'S A MATCH! Navigating to MatchFoundScreen...');
        console.log('📱 Navigation params:', {
          matchedUser: pendingLikeUser,
          currentUserPhoto: authUser?.profile?.photos?.[0] || 'https://randomuser.me/api/portraits/men/1.jpg',
          matchId: result.matchId || 'test-match-id',
        });
        
        // Navigate to MatchFoundScreen
        navigate('/match-found', {
          state: {
            matchedUser: pendingLikeUser,
            currentUserPhoto: authUser?.profile?.photos?.[0] || 'https://randomuser.me/api/portraits/men/1.jpg',
            matchId: result.matchId || 'test-match-id',
          }
        });
      } else {
        console.log('👍 Like sent successfully, but no match yet');
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
          <Text style={styles.noMoreText}>No more users to show</Text>
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
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            // Test navigation to MatchFoundScreen
            console.log('🧪 Test: Navigating to MatchFoundScreen');
            navigate('/match-found', {
              state: {
                matchedUser: currentUser,
                matchId: 'test-match-id',
              }
            });
          }}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HeartSync</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigate("/filters")}
        >
          <Ionicons name="options" size={24} color="#333" />
        </TouchableOpacity>
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
              source={{ uri: users[currentIndex + 1].photos?.[0] || 'https://via.placeholder.com/400' }} 
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
            source={{ uri: currentUser.photos?.[0] || 'https://via.placeholder.com/400' }} 
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
            <Text style={styles.userName}>
              {currentUser.name || 'Unknown'}, {currentUser.age || 0}{' '}
              {currentUser.verified && (
                <Ionicons name="checkmark-circle" size={22} color="#4ECDC4" />
              )}
            </Text>
            
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
      <BottomNavigation activeRoute="/swipe" />

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
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  filterButton: {
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
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
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "center",
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
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
    top: "25%",
    left: 0,
    right: 0,
    paddingHorizontal: 30,
  },
  rightSwipeInstruction: {
    alignItems: "flex-end",
    marginBottom: 40,
  },
  leftSwipeInstruction: {
    alignItems: "flex-start",
  },
  instructionIcon: {
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  instructionSubtitle: {
    fontSize: 13,
    color: "#fff",
    textAlign: "left",
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  userName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    width: SCREEN_WIDTH - 60,
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
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    width: SCREEN_WIDTH - 60,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  confirmIconContainer: {
    marginBottom: 20,
  },
  confirmIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
