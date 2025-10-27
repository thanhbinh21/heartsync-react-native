import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from "../constants/theme";
import { useAuthContext } from "../context/AuthContext";

export default function PhoneLoginScreen() {
  const navigate = useNavigate();
  const { login: authLogin, user, isLoading: authLoading } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debug: Log when component renders
  console.log("🔍 PhoneLoginScreen rendered successfully!");

  // Debug: Log auth state
  console.log("🔍 PhoneLoginScreen - Auth state:", { 
    authLoading, 
    hasUser: !!user,
    username: username.length > 0,
    password: password.length > 0
  });

  const handleLogin = async () => {
    console.log("🔘 Login button clicked!");
    
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      console.log("🔐 Login attempt:", { username: username.trim() });

      // Use AuthContext login which handles token and user storage
      const loginResponse = await authLogin(username.trim(), password.trim());
      console.log("✅ Login successful");

      // Check if profile is complete
      const userProfile = loginResponse.user.profile || {};
      const hasPhotos =
        userProfile.photos &&
        Array.isArray(userProfile.photos) &&
        userProfile.photos.length > 0;

      // Navigate based on profile completion
      if (!hasPhotos) {
        console.log("📝 Profile incomplete, navigating to create-profile");
        navigate("/create-profile");
      } else {
        console.log("✅ Profile complete, navigating to swipe");
        navigate("/swipe");
      }
      
    } catch (error: any) {
      console.error("❌ Login error:", error);
      Alert.alert("Login Failed", error.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // Test function to verify button works
  const handleTestClick = () => {
    console.log("🧪 Test button clicked - buttons are working!");
    Alert.alert("Test", "Button click detected! Now try the login button.");
  };

  // Test API connection
  const handleTestAPI = async () => {
    try {
      console.log("🌐 Testing API connection...");
      Alert.alert("Testing", "Checking API connection...");
      
      const response = await fetch('http://192.168.1.31:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'test',
          password: 'test'
        })
      });
      
      const data = await response.text();
      console.log("🌐 API Test Response:", response.status, data);
      Alert.alert("API Test", `Status: ${response.status}\nResponse: ${data.substring(0, 100)}`);
    } catch (error: any) {
      console.error("🌐 API Test Error:", error);
      Alert.alert("API Error", error.message);
    }
  };

  // Clear all storage for testing
  const handleClearStorage = async () => {
    try {
      console.log("🗑️ Clearing all storage...");
      await AsyncStorage.clear();
      Alert.alert("Storage Cleared", "All AsyncStorage data has been cleared. Please restart the app.");
    } catch (error: any) {
      console.error("🗑️ Clear storage error:", error);
      Alert.alert("Clear Error", error.message);
    }
  };

  const handleTestLogin = async (testUsername: string, testPassword: string) => {
    setUsername(testUsername);
    setPassword(testPassword);
    // Wait a bit for state to update
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log("🔙 Back button clicked - navigating back");
              navigate(-1);
            }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign In</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log("🏠 Home button clicked - navigating to /login");
              navigate("/login");
            }}
          >
            <Ionicons name="home-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="heart" size={40} color="#fff" />
            </LinearGradient>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="person-outline" size={20} color={COLORS.text.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={COLORS.text.tertiary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.secondary} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.text.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  loading
                    ? [COLORS.gray[400], COLORS.gray[400]]
                    : [COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]
                }
                style={styles.loginGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Debug Test Button */}
            <TouchableOpacity
              style={styles.debugButton}
              onPress={handleTestClick}
            >
              <Text style={styles.debugButtonText}>🧪 Test Button Click</Text>
            </TouchableOpacity>

            {/* API Test Button */}
            <TouchableOpacity
              style={[styles.debugButton, {backgroundColor: '#4CAF50'}]}
              onPress={handleTestAPI}
            >
              <Text style={styles.debugButtonText}>🌐 Test API Connection</Text>
            </TouchableOpacity>

            {/* Clear Storage Button */}
            <TouchableOpacity
              style={[styles.debugButton, {backgroundColor: '#FFA500'}]}
              onPress={handleClearStorage}
            >
              <Text style={styles.debugButtonText}>🗑️ Clear Storage</Text>
            </TouchableOpacity>

            {/* Test Accounts */}
            <View style={styles.testSection}>
              <Text style={styles.testTitle}>Quick Test Accounts:</Text>
              <View style={styles.testButtons}>
                <TouchableOpacity
                  style={[styles.testButton, styles.testButtonAdmin]}
                  onPress={() => handleTestLogin("admin", "admin")}
                  disabled={loading}
                >
                  <Text style={styles.testButtonText}>👑 Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.testButton, styles.testButtonUser]}
                  onPress={() => handleTestLogin("ava", "password")}
                  disabled={loading}
                >
                  <Text style={styles.testButtonText}>👤 Ava</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.testButton, styles.testButtonUser2]}
                  onPress={() => handleTestLogin("joshua", "password")}
                  disabled={loading}
                >
                  <Text style={styles.testButtonText}>👤 Joshua</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigate("/register")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Auth Loading Overlay */}
      {authLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  placeholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginTop: SPACING["3xl"],
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  welcomeText: {
    fontSize: TYPOGRAPHY.fontSize["3xl"],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
  },

  // Form Section
  formSection: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  inputIconContainer: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.primary,
  },
  eyeButton: {
    padding: SPACING.sm,
  },

  // Forgot Password
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: SPACING.lg,
  },
  forgotText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Login Button
  loginButton: {
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginGradient: {
    paddingVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  loginButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },

  // Test Section
  testSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderStyle: "dashed",
  },
  testTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  testButtons: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  testButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  testButtonAdmin: {
    backgroundColor: "#4CAF50",
  },
  testButtonUser: {
    backgroundColor: "#2196F3",
  },
  testButtonUser2: {
    backgroundColor: "#FF9800",
  },
  testButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.white,
  },

  // Sign Up
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  signupText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
  },
  signupLink: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },

  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },

  // Debug styles
  debugButton: {
    marginVertical: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FF6B6B',
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  debugButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});
