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
import { getPhotoByIndex } from "../utils/photo-utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const mockMatches = [
  {
    id: "1",
    name: "Emma Wilson",
    age: 28,
    photo: getPhotoByIndex(0),
    lastMessage: "Hey! How's your day going?",
    timeAgo: "2h ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 25,
    photo: getPhotoByIndex(1),
    lastMessage: "That sounds great! 😊",
    timeAgo: "1d ago",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Jessica Brown",
    age: 27,
    photo: getPhotoByIndex(2),
    lastMessage: "Thanks for the recommendation!",
    timeAgo: "3d ago",
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Rachel Miller",
    age: 26,
    photo: getPhotoByIndex(3),
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
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigate(-1)}>
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>HeartSync</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
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
    paddingTop: 12,
    paddingBottom: 14,
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#9D4EDD",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: "#9D4EDD",
    fontWeight: "700",
  },
  matchesList: {
    paddingBottom: 100,
  },
  matchItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  matchAvatarContainer: {
    position: "relative",
    marginRight: 14,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#fff",
  },
  unreadBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF6B9D",
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 2,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  matchName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.2,
  },
  matchTime: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  matchMessage: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
  },
  matchMessageUnread: {
    fontWeight: "600",
    color: "#222",
  },
});
