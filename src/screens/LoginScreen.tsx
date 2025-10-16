import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavProp>();

  const handleLogin = () => {
    if (phone && password) {
      navigation.navigate("CreateProfile");
    } else {
      Alert.alert("Please enter phone number and password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to HeartSync</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 30 },
  input: {
    width: "90%",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginBtn: { backgroundColor: "#00C6D7", paddingVertical: 14, borderRadius: 30, width: "90%" },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "600", textAlign: "center" },
});
