import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from "../utils/error-handler";

type NavProp = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    // Debug: Log what we're sending
    console.log('🔐 Login attempt:', {
      username: username.trim(),
      password: password.trim(),
      usernameLength: username.trim().length,
      passwordLength: password.trim().length
    });

    try {
      setLoading(true);
      console.log('🚀 Starting login process...');
      
      const loginResponse = await login(username, password);
      console.log('✅ Login successful, response:', loginResponse);
      
      // Save user info to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(loginResponse.user));
      console.log('💾 User info saved to AsyncStorage');
      
      // Check if profile is complete
      const userProfile = loginResponse.user.profile || {};
      const hasPhotos = userProfile.photos && 
                        Array.isArray(userProfile.photos) && 
                        userProfile.photos.length > 0;
      
      console.log('📸 Profile check:', { 
        hasProfile: !!loginResponse.user.profile,
        hasPhotos, 
        photosArray: userProfile.photos,
        photosLength: userProfile.photos?.length || 0
      });
      
      // For testing - always go to Swipe screen
      console.log('🔄 Force navigating to Swipe for testing...');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Swipe" }],
        });
      }, 200);
      
      /*
      if (!hasPhotos) {
        // Redirect to profile creation if no photos
        console.log('🔄 Navigating to CreateProfile...');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "CreateProfile" }],
          });
        }, 100);
      } else {
        // Navigate to Swipe screen after successful login
        console.log('🔄 Navigating to Swipe...');
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Swipe" }],
          });
        }, 100);
      }
      */
      
      console.log('✨ Navigation completed!');
    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert("Login Failed", handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    Alert.alert("Coming Soon", "Apple login will be available soon");
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    Alert.alert("Coming Soon", "Facebook login will be available soon");
  };

  const handlePhoneLogin = () => {
    // Show login form for now
    setShowLoginForm(true);
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <View style={styles.logoInnerCircle}>
            <Ionicons name="heart" size={60} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>HeartSync</Text>
        <Text style={styles.subtitle}>Where Hearts Connect, Love Finds Its Sync.</Text>
      </View>

      {showLoginForm ? (
        /* Login Form */
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </TouchableOpacity>
          
          {/* Test Login Buttons - Now Working! */}
          <View style={styles.testButtonsContainer}>
            <TouchableOpacity
              style={[styles.testBtn, { backgroundColor: "#4CAF50" }]}
              onPress={async () => {
                setUsername("admin");
                setPassword("admin");
                console.log("🧪 Testing admin login");
                setTimeout(() => handleLogin(), 500);
              }}
              disabled={loading}
            >
              <Text style={styles.testBtnText}>🔑 Login as Admin (Premium)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.testBtn, { backgroundColor: "#2196F3" }]}
              onPress={async () => {
                setUsername("ava");
                setPassword("password");
                console.log("🧪 Testing ava login");
                setTimeout(() => handleLogin(), 500);
              }}
              disabled={loading}
            >
              <Text style={styles.testBtnText}>🔑 Login as Ava (Free)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.testBtn, { backgroundColor: "#FF9800" }]}
              onPress={async () => {
                setUsername("joshua");
                setPassword("password");
                console.log("🧪 Testing joshua login");
                setTimeout(() => handleLogin(), 500);
              }}
              disabled={loading}
            >
              <Text style={styles.testBtnText}>🔑 Login as Joshua (Premium)</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => setShowLoginForm(false)}>
            <Text style={styles.backText}>← Back to social login</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Social Login Buttons */
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.appleBtn} onPress={handleAppleLogin}>
            <Ionicons name="logo-apple" size={24} color="#fff" />
            <Text style={styles.btnText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.facebookBtn} onPress={handleFacebookLogin}>
            <Ionicons name="logo-facebook" size={24} color="#fff" />
            <Text style={styles.btnText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.phoneBtn} onPress={handlePhoneLogin}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
            <Text style={styles.btnText}>Login with Username</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Terms and Conditions */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing up you agree to our{" "}
          <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
        <Text style={styles.termsText}>
          See how we use your data in our{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#E8D5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoInnerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  formContainer: {
    width: "100%",
    gap: 15,
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loginBtn: {
    backgroundColor: "#9D4EDD",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  backText: {
    textAlign: "center",
    color: "#9D4EDD",
    fontSize: 15,
    marginTop: 10,
  },
  appleBtn: {
    backgroundColor: "#1C1C1E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  facebookBtn: {
    backgroundColor: "#1877F2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  phoneBtn: {
    backgroundColor: "#00C6D7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  testBtn: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 5,
  },
  testBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  testButtonsContainer: {
    marginTop: 10,
    gap: 5,
  },
  termsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#00C6D7",
    textDecorationLine: "underline",
  },
});