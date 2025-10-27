import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../constants/theme";

export default function StartedScreen() {
  const navigate = useNavigate();

  const handleAppleLogin = () => {
    // TODO: Implement Apple Sign-In
    console.log("Apple login pressed");
    navigate("/login");
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook login
    console.log("Facebook login pressed");
    navigate("/login");
  };

  const handlePhoneLogin = () => {
    navigate("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* Logo with Gradient Circle */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="heart" size={70} color="#fff" />
            </LinearGradient>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>HeartSync</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Where Hearts Connect, Love Finds Its Sync.
          </Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
          {/* Apple Login Button */}
          <TouchableOpacity
            style={[styles.button, styles.appleButton]}
            onPress={handleAppleLogin}
            activeOpacity={0.8}
          >
            <Ionicons
              name="logo-apple"
              size={22}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.appleButtonText]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Facebook Login Button */}
          <TouchableOpacity
            style={[styles.button, styles.facebookButton]}
            onPress={handleFacebookLogin}
            activeOpacity={0.8}
          >
            <Ionicons
              name="logo-facebook"
              size={22}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.facebookButtonText]}>
              Continue with Facebook
            </Text>
          </TouchableOpacity>

          {/* Phone Number Button */}
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={handlePhoneLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary]}
              style={styles.phoneGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="call-outline"
                size={22}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, styles.phoneButtonText]}>
                Use phone number
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            By signing up you agree to our{" "}
            <Text style={styles.linkText}>Terms and Conditions</Text>
          </Text>
          <Text style={styles.footerText}>
            See how we use your data in our{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginTop: SPACING["3xl"],
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.lg,
  },
  appName: {
    fontSize: TYPOGRAPHY.fontSize["4xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.base,
    paddingHorizontal: SPACING.xl,
  },

  // Buttons Section
  buttonsSection: {
    width: "100%",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    minHeight: 56,
    ...SHADOWS.sm,
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Apple Button
  appleButton: {
    backgroundColor: COLORS.apple,
  },
  appleButtonText: {
    color: COLORS.white,
  },

  // Facebook Button
  facebookButton: {
    backgroundColor: COLORS.facebook,
  },
  facebookButtonText: {
    color: COLORS.white,
  },

  // Phone Button
  phoneButton: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    ...SHADOWS.sm,
  },
  phoneGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 56,
  },
  phoneButtonText: {
    color: COLORS.white,
  },

  // Footer Section
  footerSection: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.tertiary,
    textAlign: "center",
    marginBottom: SPACING.xs,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.sm,
  },
  linkText: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

  // Bottom Indicator
  bottomIndicator: {
    width: 140,
    height: 4,
    backgroundColor: COLORS.text.primary,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
});
