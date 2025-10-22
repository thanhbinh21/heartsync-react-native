import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "Filters">;

export default function FiltersScreen() {
  const navigation = useNavigation<NavProp>();
  
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [distance, setDistance] = useState(50);
  const [showMen, setShowMen] = useState(true);
  const [showWomen, setShowWomen] = useState(true);
  const [recentlyActive, setRecentlyActive] = useState(false);

  const adjustAge = (type: "min" | "max", delta: number) => {
    if (type === "min") {
      setAgeRange([Math.max(18, Math.min(ageRange[0] + delta, ageRange[1] - 1)), ageRange[1]]);
    } else {
      setAgeRange([ageRange[0], Math.min(65, Math.max(ageRange[1] + delta, ageRange[0] + 1))]);
    }
  };

  const adjustDistance = (delta: number) => {
    setDistance(Math.max(5, Math.min(100, distance + delta)));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={() => {
          setAgeRange([18, 35]);
          setDistance(50);
          setShowMen(true);
          setShowWomen(true);
          setRecentlyActive(false);
        }}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Age Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          <View style={styles.rangeContainer}>
            <View style={styles.rangeControl}>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustAge("min", -1)}
              >
                <Ionicons name="remove" size={20} color="#9D4EDD" />
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{ageRange[0]}</Text>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustAge("min", 1)}
              >
                <Ionicons name="add" size={20} color="#9D4EDD" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.rangeSeparator}>to</Text>
            
            <View style={styles.rangeControl}>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustAge("max", -1)}
              >
                <Ionicons name="remove" size={20} color="#9D4EDD" />
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{ageRange[1]}</Text>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustAge("max", 1)}
              >
                <Ionicons name="add" size={20} color="#9D4EDD" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Distance</Text>
          <Text style={styles.distanceValue}>{distance} km</Text>
          <View style={styles.rangeContainer}>
            <View style={styles.rangeControl}>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustDistance(-5)}
              >
                <Ionicons name="remove" size={20} color="#9D4EDD" />
              </TouchableOpacity>
              <View style={styles.distanceSlider}>
                <View 
                  style={[styles.distanceSliderFill, { width: `${distance}%` }]} 
                />
              </View>
              <TouchableOpacity 
                style={styles.rangeButton}
                onPress={() => adjustDistance(5)}
              >
                <Ionicons name="add" size={20} color="#9D4EDD" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Show Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Me</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Men</Text>
            <Switch
              value={showMen}
              onValueChange={setShowMen}
              trackColor={{ false: "#d0d0d0", true: "#9D4EDD" }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Women</Text>
            <Switch
              value={showWomen}
              onValueChange={setShowWomen}
              trackColor={{ false: "#d0d0d0", true: "#9D4EDD" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Advanced Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Recently Active</Text>
              <Text style={styles.switchDesc}>Only show people active in the last 7 days</Text>
            </View>
            <Switch
              value={recentlyActive}
              onValueChange={setRecentlyActive}
              trackColor={{ false: "#d0d0d0", true: "#9D4EDD" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Premium Filters */}
        <View style={styles.premiumSection}>
          <View style={styles.premiumIcon}>
            <Ionicons name="sparkles" size={24} color="#FFD700" />
          </View>
          <Text style={styles.premiumTitle}>Unlock More Filters</Text>
          <Text style={styles.premiumDesc}>
            Filter by education, lifestyle, and more with Premium
          </Text>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => navigation.navigate("Subscription")}
          >
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
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
  resetText: {
    fontSize: 16,
    color: "#9D4EDD",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },
  rangeControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  rangeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  rangeValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    minWidth: 40,
    textAlign: "center",
  },
  rangeSeparator: {
    fontSize: 16,
    color: "#666",
  },
  distanceValue: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  distanceSlider: {
    flex: 1,
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  distanceSliderFill: {
    height: "100%",
    backgroundColor: "#9D4EDD",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  switchDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  premiumSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#F9F5FF",
    alignItems: "center",
  },
  premiumIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  premiumDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  upgradeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#9D4EDD",
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  applyButton: {
    backgroundColor: "#9D4EDD",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
