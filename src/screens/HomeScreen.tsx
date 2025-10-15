import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>HeartSync</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/45.jpg" }}
          style={styles.image}
        />
        <Text style={styles.name}>Ava Jones, 25 💙</Text>
        <Text style={styles.desc}>Business Analyst at Tech</Text>
      </View>
      <Text style={styles.tip}>Swipe right to like, left to pass 👈👉</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", paddingTop: 60 },
  header: { fontSize: 24, fontWeight: "700", color: "#111", marginBottom: 20 },
  card: {
    backgroundColor: "#EAF9FA",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  image: { width: 200, height: 260, borderRadius: 15, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "700" },
  desc: { fontSize: 14, color: "#555", marginBottom: 10 },
  tip: { fontSize: 14, color: "#777", marginTop: 20 },
});
