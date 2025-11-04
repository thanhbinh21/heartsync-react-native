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
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "Hey! How's your day going?",
    timeAgo: "2h ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 25,
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    lastMessage: "That sounds great! 😊",
    timeAgo: "1d ago",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Jessica Brown",
    age: 27,
    photo: "https://randomuser.me/api/portraits/women/3.jpg",
    lastMessage: "Thanks for the recommendation!",
    timeAgo: "3d ago",
    isOnline: true,
    unreadCount: 1,
  },
  {
    id: "4",
    name: "Rachel Miller",
    age: 26,
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
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
