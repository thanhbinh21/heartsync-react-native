import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "Matches">;

const { width: screenWidth } = Dimensions.get("window");

interface MatchWithDetails {
  id: string;
  name: string;
  photo: string;
  lastMessage?: string;
  timeAgo: string;
  isOnline: boolean;
  hasNewMessage: boolean;
}

export default function MatchesScreen() {
  const navigation = useNavigation<NavProp>();
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      
      // Set mock data for demo
      setMatches([
        {
          id: "1",
          name: "Emma",
          photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
          lastMessage: "Hey! How's your day going?",
          timeAgo: "2h",
          isOnline: true,
          hasNewMessage: true,
        },
        {
          id: "2",
          name: "Sarah",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
          timeAgo: "1d",
          isOnline: false,
          hasNewMessage: false,
        },
        {
          id: "3",
          name: "Jessica",
          photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
          lastMessage: "Thanks for the recommendation! 😊",
          timeAgo: "3d",
          isOnline: false,
          hasNewMessage: true,
        }
      ]);
    } catch (error) {
      console.error("Error loading matches:", error);
      Alert.alert("Error", "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };
  
  const newMatches = matches.filter(match => !match.lastMessage);
  const messagesMatches = matches.filter(match => match.lastMessage);

  const handleMatchPress = (match: MatchWithDetails) => {
    if (match.lastMessage) {
      navigation.navigate("Chat", { user: match });
    } else {
      navigation.navigate("ProfileView", { user: match });
    }
  };

  const renderNewMatch = ({ item }: { item: MatchWithDetails }) => (
    <TouchableOpacity 
      style={styles.newMatchItem}
      onPress={() => handleMatchPress(item)}
    >
      <View style={styles.newMatchImageContainer}>
        <Image source={{ uri: item.photo }} style={styles.newMatchImage} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.newMatchName}>{item.name}</Text>
      <Text style={styles.newMatchTime}>{item.timeAgo}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: MatchWithDetails }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => handleMatchPress(item)}
    >
      <View style={styles.messageImageContainer}>
        <Image source={{ uri: item.photo }} style={styles.messageImage} />
        {item.isOnline && <View style={styles.onlineIndicatorMessage} />}
        {item.hasNewMessage && <View style={styles.newMessageIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.timeAgo}</Text>
        </View>
        <Text style={[
          styles.messageText,
          item.hasNewMessage && styles.unreadMessage
        ]}>
          {item.lastMessage || "Start the conversation..."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.emptyStateTitle}>Loading matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Matches</Text>
        <TouchableOpacity>
          <Text style={styles.filterButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            New Matches ({newMatches.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages ({messagesMatches.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'matches' ? (
        <View style={styles.content}>
          {newMatches.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                You have {newMatches.length} new matches!
              </Text>
              <FlatList
                data={newMatches}
                renderItem={renderNewMatch}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.newMatchesGrid}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💕</Text>
              <Text style={styles.emptyStateTitle}>No new matches yet</Text>
              <Text style={styles.emptyStateText}>
                Keep swiping to find more people you might like!
              </Text>
              <TouchableOpacity 
                style={styles.discoverButton}
                onPress={() => navigation.navigate("Swipe")}
              >
                <Text style={styles.discoverButtonText}>Start Swiping</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          {messagesMatches.length > 0 ? (
            <FlatList
              data={messagesMatches}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>💬</Text>
              <Text style={styles.emptyStateTitle}>No messages yet</Text>
              <Text style={styles.emptyStateText}>
                Start a conversation with your matches!
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("Swipe")}
      >
        <Text style={styles.fabIcon}>🔥</Text>
      </TouchableOpacity>
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
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  filterButton: {
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#8b5cf6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#8b5cf6",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
  },
  newMatchesGrid: {
    paddingBottom: 100,
  },
  newMatchItem: {
    width: (screenWidth - 60) / 2,
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 10,
  },
  newMatchImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  newMatchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#8b5cf6",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2ecc71",
    borderWidth: 3,
    borderColor: "#fff",
  },
  newMatchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  newMatchTime: {
    fontSize: 12,
    color: "#666",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  messageImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  messageImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicatorMessage: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#2ecc71",
    borderWidth: 2,
    borderColor: "#fff",
  },
  newMessageIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF4458",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  unreadMessage: {
    color: "#111",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  discoverButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  discoverButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF4458",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
});