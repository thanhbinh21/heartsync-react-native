import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigate } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { handleApiError } from "../utils/error-handler";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
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
      
      await login(username, password);
      console.log('✅ Login successful');
      
      // Navigate to Swipe screen after successful login
      console.log('🔄 Navigating to Swipe for testing...');
      navigate('/swipe', { replace: true });
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