import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "Subscription">;

const { width: screenWidth } = Dimensions.get("window");

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  originalPrice?: string;
  discount?: string;
  isPopular?: boolean;
  features: string[];
}

const subscriptionPlans: Plan[] = [
  {
    id: "plus_1m",
    name: "HeartSync Plus",
    price: "$9.99",
    duration: "per month",
    features: [
      "Unlimited Likes",
      "See Who Likes You",
      "5 Super Likes per day",
      "1 Boost per month",
      "Advanced Filters",
      "Read Receipts",
      "No Ads"
    ]
  },
  {
    id: "gold_1m",
    name: "HeartSync Gold",
    price: "$19.99",
    duration: "per month",
    originalPrice: "$29.99",
    discount: "33% OFF",
    isPopular: true,
    features: [
      "Everything in Plus",
      "See Who Likes You First",
      "Priority Likes",
      "Unlimited Super Likes",
      "5 Boosts per month",
      "Profile Controls",
      "Travel Mode",
      "Premium Support"
    ]
  },
  {
    id: "platinum_1m",
    name: "HeartSync Platinum",
    price: "$34.99",
    duration: "per month",
    features: [
      "Everything in Gold",
      "Message Before Matching",
      "VIP Profile Badge",
      "Unlimited Boosts",
      "Advanced Incognito Mode",
      "Personal Dating Assistant",
      "Video Call Priority",
      "Exclusive Events Access"
    ]
  }
];

const features = [
  {
    icon: "💕",
    title: "Unlimited Likes",
    description: "Like as many profiles as you want without limits"
  },
  {
    icon: "👀",
    title: "See Who Likes You",
    description: "Know exactly who's interested in you before you swipe"
  },
  {
    icon: "⭐",
    title: "Super Likes",
    description: "Stand out with Super Likes to get 3x more matches"
  },
  {
    icon: "🚀",
    title: "Boosts",
    description: "Be the top profile in your area for 30 minutes"
  },
  {
    icon: "🔍",
    title: "Advanced Filters",
    description: "Filter by education, lifestyle, and more preferences"
  },
  {
    icon: "✉️",
    title: "Message First",
    description: "Send messages before matching with Platinum"
  }
];

export default function SubscriptionScreen() {
  const navigation = useNavigation<NavProp>();
  const [selectedPlan, setSelectedPlan] = useState<string>(subscriptionPlans[1].id);

  const handleSubscribe = (planId: string) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    Alert.alert(
      "Confirm Subscription",
      `Subscribe to ${plan?.name} for ${plan?.price}${plan?.duration}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Subscribe", 
          onPress: () => {
            Alert.alert("Success!", "Subscription activated! Welcome to premium features.");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderPlan = (plan: Plan) => (
    <View key={plan.id} style={[
      styles.planCard,
      selectedPlan === plan.id && styles.selectedPlanCard,
      plan.isPopular && styles.popularPlanCard
    ]}>
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      {plan.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{plan.discount}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.planContent}
        onPress={() => setSelectedPlan(plan.id)}
      >
        <Text style={styles.planName}>{plan.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planDuration}>{plan.duration}</Text>
          {plan.originalPrice && (
            <Text style={styles.originalPrice}>{plan.originalPrice}</Text>
          )}
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            selectedPlan === plan.id && styles.selectedButton
          ]}
          onPress={() => handleSubscribe(plan.id)}
        >
          <Text style={[
            styles.selectButtonText,
            selectedPlan === plan.id && styles.selectedButtonText
          ]}>
            {selectedPlan === plan.id ? "Selected" : "Select Plan"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const renderFeature = (feature: typeof features[0]) => (
    <View key={feature.title} style={styles.featureCard}>
      <Text style={styles.featureIcon}>{feature.icon}</Text>
      <View style={styles.featureInfo}>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>HeartSync Premium</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Unlock Your Dating Potential</Text>
          <Text style={styles.heroSubtitle}>
            Get premium features to find your perfect match faster
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map(renderFeature)}
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          {subscriptionPlans.map(renderPlan)}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Go Premium?</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>3x More Matches</Text>
              <Text style={styles.benefitDescription}>
                Premium users get significantly more matches than free users
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Faster Connections</Text>
              <Text style={styles.benefitDescription}>
                Skip the wait and connect with people who already like you
              </Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Better Quality Matches</Text>
              <Text style={styles.benefitDescription}>
                Advanced filters help you find exactly what you're looking for
              </Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
          <View style={styles.termsLinks}>
            <TouchableOpacity>
              <Text style={styles.termsLink}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.termsSeparator}>•</Text>
            <TouchableOpacity>
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  closeButton: {
    fontSize: 20,
    color: "#666",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  placeholder: {
    width: 20,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8b5cf6",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  plansSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    position: "relative",
    overflow: "hidden",
  },
  selectedPlanCard: {
    borderColor: "#8b5cf6",
  },
  popularPlanCard: {
    borderColor: "#ec4899",
  },
  popularBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ec4899",
    paddingVertical: 8,
    alignItems: "center",
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
  planContent: {
    padding: 20,
    paddingTop: 30,
  },
  planName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 15,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: "700",
    color: "#8b5cf6",
  },
  planDuration: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkmark: {
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "700",
    marginRight: 10,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  selectButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#8b5cf6",
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  selectedButtonText: {
    color: "#fff",
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  termsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 10,
  },
  termsLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsLink: {
    fontSize: 12,
    color: "#8b5cf6",
    textDecorationLine: "underline",
  },
  termsSeparator: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 8,
  },
  bottomSpacer: {
    height: 50,
  },
});