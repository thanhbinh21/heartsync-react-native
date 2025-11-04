import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNavigation from "../components/BottomNavigation";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const mockMatches = [
  {
    id: "1",
    name: "Emma Wilson",
    age: 28,
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
    lastMessage: "Hey! How's your day going?",
    timeAgo: "2h ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 25,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    lastMessage: "That sounds great! 😊",
    timeAgo: "1d ago",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Jessica Brown",
    age: 27,
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
    lastMessage: "Thanks for the recommendation!",
    timeAgo: "3d ago",
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Rachel Miller",
    age: 26,
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
    lastMessage: "See you soon! 💕",
    timeAgo: "5d ago",
    isOnline: false,
    unreadCount: 0,
  },
];

export default function MatchesScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"matches" | "likes">("matches");

  const renderMatchItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.matchItem}
      onPress={() => navigate(`/chat/${item.id}`, { state: { user: item } })}
    >
      <View style={styles.matchAvatarContainer}>
        <Image source={{ uri: item.photo }} style={styles.matchAvatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.name}</Text>
          <Text style={styles.matchTime}>{item.timeAgo}</Text>
        </View>
        <Text 
          style={[
            styles.matchMessage,
            item.unreadCount > 0 && styles.matchMessageUnread
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigate(-1)}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HeartSync</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="options" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "matches" && styles.tabActive]}
          onPress={() => setActiveTab("matches")}
        >
          <Text style={[styles.tabText, activeTab === "matches" && styles.tabTextActive]}>
            Matches
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "likes" && styles.tabActive]}
          onPress={() => setActiveTab("likes")}
        >
          <Text style={[styles.tabText, activeTab === "likes" && styles.tabTextActive]}>
            Likes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Matches List */}
      <FlatList
        data={mockMatches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
      />

      <BottomNavigation activeRoute="/matches" />
    </SafeAreaView>
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
    paddingTop: 10,
    paddingBottom: 10,
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#4ECDC4",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#999",
  },
  tabTextActive: {
    color: "#4ECDC4",
    fontWeight: "700",
  },
  matchesList: {
    paddingBottom: 100,
  },
  matchItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    alignItems: "center",
  },
  matchAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  matchAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
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
  unreadBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF6B9D",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  matchTime: {
    fontSize: 13,
    color: "#999",
  },
  matchMessage: {
    fontSize: 14,
    color: "#999",
  },
  matchMessageUnread: {
    fontWeight: "600",
    color: "#333",
  },
});
