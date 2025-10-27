import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavigation from "../components/BottomNavigation";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    id: "plus",
    name: "Plus",
    price: "$9.99",
    period: "/month",
    features: [
      "Unlimited Likes",
      "5 Super Likes/day",
      "1 Boost/month",
      "See Who Likes You",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "$19.99",
    period: "/month",
    badge: "MOST POPULAR",
    badgeColor: "#FFD700",
    highlighted: true,
    features: [
      "Everything in Plus",
      "Unlimited Super Likes",
      "5 Boosts/month",
      "Priority Likes",
      "Message Before Match",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$29.99",
    period: "/month",
    badge: "BEST VALUE",
    badgeColor: "#9D4EDD",
    features: [
      "Everything in Gold",
      "Message Anyone",
      "Unlimited Boosts",
      "See Everyone Who Likes You",
      "VIP Profile Badge",
    ],
  },
];

export default function SubscriptionScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Plans' | 'Safety'>('Plans');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?img=12' }}
              style={styles.profileImage}
            />
            <View style={styles.profileRing} />
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>45% complete</Text>
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Joshua Edwards, 29</Text>
            <Ionicons name="checkmark-circle" size={18} color="#00A9FF" style={styles.verifiedIcon} />
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigate("/create-profile")}
          >
            <Text style={styles.editProfileText}>Edit your profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#00BCD4" />
          </TouchableOpacity>
        </View>

        {/* Verification Banner */}
        <View style={styles.verificationBanner}>
          <View style={styles.verificationIconContainer}>
            <Ionicons name="shield-checkmark" size={24} color="#00A9FF" />
          </View>
          <View style={styles.verificationContent}>
            <Text style={styles.verificationTitle}>
              Verification adds an extra layer of{'\n'}
              authenticity and trust to your profile.
            </Text>
            <Text style={styles.verificationLink}>Verify your account now!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Plans' && styles.tabActive]}
            onPress={() => setActiveTab('Plans')}
          >
            <Text style={[styles.tabText, activeTab === 'Plans' && styles.tabTextActive]}>
              Plans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Safety' && styles.tabActive]}
            onPress={() => setActiveTab('Safety')}
          >
            <Text style={[styles.tabText, activeTab === 'Safety' && styles.tabTextActive]}>
              Safety
            </Text>
          </TouchableOpacity>
        </View>

        {/* Premium Card */}
        <LinearGradient
          colors={['#00BCD4', '#00A9C6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumCard}
        >
          <View style={styles.starIcon}>
            <Ionicons name="star" size={16} color="#00BCD4" />
          </View>
          <View style={styles.starIcon2}>
            <Ionicons name="star" size={12} color="#00BCD4" />
          </View>
          <View style={styles.starIcon3}>
            <Ionicons name="star" size={14} color="#00BCD4" />
          </View>
          <View style={styles.starIcon4}>
            <Ionicons name="star" size={10} color="#00BCD4" />
          </View>
          
          <Text style={styles.premiumTitle}>HeartSync Premium</Text>
          <Text style={styles.premiumSubtitle}>
            Unlock exclusive features and supercharge{'\n'}
            your dating experience.
          </Text>
          
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => navigate('/swipe')}
          >
            <Text style={styles.upgradeButtonText}>Upgrade from $7.99</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Features Table */}
        <View style={styles.featuresTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>What's included</Text>
            <Text style={styles.tableHeaderColumn}>Free</Text>
            <Text style={[styles.tableHeaderColumn, styles.premiumColumn]}>Premium</Text>
          </View>

          {/* Feature Rows */}
          <View style={styles.featureRow}>
            <Text style={styles.featureLabel}>Unlimited swipes</Text>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
          </View>

          <View style={[styles.featureRow, styles.featureRowAlt]}>
            <Text style={styles.featureLabel}>Advanced filters</Text>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureLabel}>Remove ads</Text>
            <View style={styles.featureCell}>
              <View style={styles.emptyCheckbox} />
            </View>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
          </View>

          <View style={[styles.featureRow, styles.featureRowAlt]}>
            <Text style={styles.featureLabel}>Undo accidental left swipes</Text>
            <View style={styles.featureCell}>
              <View style={styles.emptyCheckbox} />
            </View>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureLabel}>Push you profile to more{'\n'}viewers</Text>
            <View style={styles.featureCell}>
              <View style={styles.emptyCheckbox} />
            </View>
            <View style={styles.featureCell}>
              <Ionicons name="checkmark" size={20} color="#00BCD4" />
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/subscription" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  menuButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileRing: {
    position: "absolute",
    top: -5,
    left: -5,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#00BCD4",
    borderStyle: "solid",
    borderTopColor: "#00BCD4",
    borderRightColor: "#FFD700",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "-45deg" }],
  },
  completionBadge: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    transform: [{ translateX: -45 }],
    backgroundColor: "#00BCD4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginRight: 6,
  },
  verifiedIcon: {
    marginTop: 2,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00BCD4",
  },
  verificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  verificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  verificationContent: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  verificationLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#00BCD4",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#00BCD4",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#00BCD4",
  },
  premiumCard: {
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 25,
  },
  starIcon: {
    position: "absolute",
    top: 15,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon2: {
    position: "absolute",
    top: 20,
    right: 30,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon3: {
    position: "absolute",
    bottom: 25,
    left: 35,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  starIcon4: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.95,
  },
  upgradeButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#00BCD4",
  },
  featuresTable: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tableHeaderText: {
    flex: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  tableHeaderColumn: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
    textAlign: "center",
  },
  premiumColumn: {
    color: "#00BCD4",
  },
  featureRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  featureRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  featureLabel: {
    flex: 2,
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
  featureCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
});
