import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "Subscription">;

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
  const navigation = useNavigation<NavProp>();
  const [selectedPlan, setSelectedPlan] = useState("gold");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="sparkles" size={40} color="#9D4EDD" />
          </View>
          <Text style={styles.heroTitle}>Get More Matches</Text>
          <Text style={styles.heroSubtitle}>
            Upgrade to unlock premium features and boost your chances
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.highlighted && styles.planCardHighlighted,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <View style={[styles.badge, { backgroundColor: plan.badgeColor }]}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}

              {/* Radio Button */}
              <View style={styles.planHeader}>
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {selectedPlan === plan.id && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{plan.price}</Text>
                  <Text style={styles.period}>{plan.period}</Text>
                </View>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#9D4EDD" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features Highlight */}
        <View style={styles.highlightSection}>
          <Text style={styles.highlightTitle}>Why go Premium?</Text>
          
          <View style={styles.highlightItem}>
            <View style={styles.highlightIcon}>
              <Ionicons name="heart" size={24} color="#FF4458" />
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightItemTitle}>Unlimited Likes</Text>
              <Text style={styles.highlightItemDesc}>
                Like as many profiles as you want
              </Text>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <View style={styles.highlightIcon}>
              <Ionicons name="eye" size={24} color="#00C6D7" />
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightItemTitle}>See Who Likes You</Text>
              <Text style={styles.highlightItemDesc}>
                Know who's interested before you swipe
              </Text>
            </View>
          </View>

          <View style={styles.highlightItem}>
            <View style={styles.highlightIcon}>
              <Ionicons name="rocket" size={24} color="#FFD700" />
            </View>
            <View style={styles.highlightContent}>
              <Text style={styles.highlightItemTitle}>Boost Your Profile</Text>
              <Text style={styles.highlightItemDesc}>
                Be the top profile in your area
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Subscribe Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.subscribeButtonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>
          Auto-renews. Cancel anytime. Terms apply.
        </Text>
      </View>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3E5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  planCard: {
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#fff",
  },
  planCardSelected: {
    borderColor: "#9D4EDD",
    backgroundColor: "#F9F5FF",
  },
  planCardHighlighted: {
    borderColor: "#FFD700",
  },
  badge: {
    position: "absolute",
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9D4EDD",
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  period: {
    fontSize: 14,
    color: "#666",
  },
  featuresContainer: {
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: "#333",
  },
  highlightSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  highlightTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 20,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  highlightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  highlightContent: {
    flex: 1,
  },
  highlightItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  highlightItemDesc: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  subscribeButton: {
    backgroundColor: "#9D4EDD",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
