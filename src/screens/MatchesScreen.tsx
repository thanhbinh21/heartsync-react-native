import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";

const mockMatches = [
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
  },
];

export default function MatchesScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"matches" | "messages">("matches");
  
  const newMatches = mockMatches.filter((m) => !m.lastMessage);
  const messages = mockMatches.filter((m) => m.lastMessage);

  const renderNewMatch = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => navigate("/profile-view", { state: { user: item } })}
    >
      <Image source={{ uri: item.photo }} style={styles.matchPhoto} />
      {item.isOnline && <View style={styles.onlineDot} />}
      <Text style={styles.matchName}>{item.name}</Text>
      <Text style={styles.matchTime}>{item.timeAgo}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.messageRow}
      onPress={() => navigate("/chat", { state: { matchId: item.id, user: item } })}
    >
      <View style={styles.messageAvatarContainer}>
        <Image source={{ uri: item.photo }} style={styles.messageAvatar} />
        {item.isOnline && <View style={styles.onlineDotSmall} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageName}>{item.name}</Text>
          <Text style={styles.messageTime}>{item.timeAgo}</Text>
        </View>
        <Text
          style={[
            styles.messageText,
            item.hasNewMessage && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.hasNewMessage && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate(-1)}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matches</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "matches" && styles.activeTab]}
          onPress={() => setActiveTab("matches")}
        >
          <Text style={[styles.tabText, activeTab === "matches" && styles.activeTabText]}>
            New Matches ({newMatches.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <Text style={[styles.tabText, activeTab === "messages" && styles.activeTabText]}>
            Messages ({messages.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "matches" ? (
        newMatches.length > 0 ? (
          <FlatList
            key="matches-grid"
            data={newMatches}
            renderItem={renderNewMatch}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.matchesGrid}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💕</Text>
            <Text style={styles.emptyTitle}>No new matches yet</Text>
            <Text style={styles.emptyText}>
              Keep swiping to find more people!
            </Text>
          </View>
        )
      ) : (
        <FlatList
          key="messages-list"
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />
      )}
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#9D4EDD",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#9D4EDD",
    fontWeight: "600",
  },
  matchesGrid: {
    padding: 15,
  },
  matchCard: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  matchPhoto: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 8,
  },
  onlineDot: {
    position: "absolute",
    top: 10,
    right: 20,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  matchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  matchTime: {
    fontSize: 13,
    color: "#888",
  },
  messagesList: {
    padding: 0,
  },
  messageRow: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  messageAvatarContainer: {
    position: "relative",
  },
  messageAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineDotSmall: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  messageContent: {
    flex: 1,
    marginLeft: 15,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  messageTime: {
    fontSize: 13,
    color: "#888",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#000",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4458",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
