import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "Started">;

export default function StartedScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/833/833472.png" }}
        style={styles.logo}
      />
      <Text style={styles.title}>HeartSync</Text>
      <Text style={styles.subtitle}>
        Where Hearts Connect, Love Finds Its Sync.
      </Text>

      <TouchableOpacity style={styles.appleBtn}>
        <Text style={styles.appleText}> Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.fbBtn}>
        <Text style={styles.fbText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.phoneBtn}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.phoneText}>Use phone number</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        By signing up you agree to our Terms and Conditions
      </Text>
      <Text style={styles.footer}>See how we use your data in our Privacy Policy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  logo: { width: 100, height: 100, marginBottom: 20, tintColor: "#8b5cf6" },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 40, textAlign: "center" },

  appleBtn: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 30, width: "90%", marginBottom: 10 },
  appleText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },

  fbBtn: { backgroundColor: "#1877F2", paddingVertical: 14, borderRadius: 30, width: "90%", marginBottom: 10 },
  fbText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },

  phoneBtn: { backgroundColor: "#00C6D7", paddingVertical: 14, borderRadius: 30, width: "90%", marginBottom: 20 },
  phoneText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "600" },

  footer: { fontSize: 12, color: "#777", textAlign: "center", marginTop: 4 },
});
