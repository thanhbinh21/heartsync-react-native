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

type NavProp = StackNavigationProp<RootStackParamList, "Filters">;

interface FilterState {
  ageRange: [number, number];
  maxDistance: number;
  showMen: boolean;
  showWomen: boolean;
  showNonBinary: boolean;
  recentlyActive: boolean;
  education: string[];
  interests: string[];
  height: [number, number];
  lifestyle: {
    drinking: string[];
    smoking: string[];
    workout: string[];
    diet: string[];
  };
}

export default function FiltersScreen() {
  const navigation = useNavigation<NavProp>();
  
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 35],
    maxDistance: 50,
    showMen: true,
    showWomen: true,
    showNonBinary: true,
    recentlyActive: false,
    education: [],
    interests: [],
    height: [150, 200],
    lifestyle: {
      drinking: [],
      smoking: [],
      workout: [],
      diet: [],
    },
  });

  const educationOptions = [
    "High School", "Bachelor's", "Master's", "PhD", "Trade School", "Other"
  ];

  const interestOptions = [
    "Travel", "Music", "Sports", "Movies", "Books", "Art", "Cooking",
    "Dancing", "Photography", "Hiking", "Gaming", "Fitness", "Fashion", "Tech"
  ];

  const lifestyleOptions = {
    drinking: ["Never", "Rarely", "Socially", "Regularly"],
    smoking: ["Never", "Sometimes", "Regularly"],
    workout: ["Never", "Sometimes", "Often", "Daily"],
    diet: ["No Preference", "Vegetarian", "Vegan", "Keto", "Paleo"],
  };

  const handleAgeRangeChange = (type: 'min' | 'max', increment: boolean) => {
    const change = increment ? 1 : -1;
    setFilters(prev => {
      if (type === 'min') {
        const newMin = Math.max(18, Math.min(prev.ageRange[1] - 1, prev.ageRange[0] + change));
        return { ...prev, ageRange: [newMin, prev.ageRange[1]] };
      } else {
        const newMax = Math.min(65, Math.max(prev.ageRange[0] + 1, prev.ageRange[1] + change));
        return { ...prev, ageRange: [prev.ageRange[0], newMax] };
      }
    });
  };

  const handleDistanceChange = (increment: boolean) => {
    const change = increment ? 5 : -5;
    setFilters(prev => ({
      ...prev,
      maxDistance: Math.max(5, Math.min(100, prev.maxDistance + change))
    }));
  };

  const handleHeightChange = (type: 'min' | 'max', increment: boolean) => {
    const change = increment ? 5 : -5;
    setFilters(prev => {
      if (type === 'min') {
        const newMin = Math.max(140, Math.min(prev.height[1] - 5, prev.height[0] + change));
        return { ...prev, height: [newMin, prev.height[1]] };
      } else {
        const newMax = Math.min(220, Math.max(prev.height[0] + 5, prev.height[1] + change));
        return { ...prev, height: [prev.height[0], newMax] };
      }
    });
  };

  const toggleEducation = (education: string) => {
    setFilters(prev => ({
      ...prev,
      education: prev.education.includes(education)
        ? prev.education.filter(e => e !== education)
        : [...prev.education, education]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleLifestyle = (category: keyof typeof lifestyleOptions, option: string) => {
    setFilters(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [category]: prev.lifestyle[category].includes(option)
          ? prev.lifestyle[category].filter(o => o !== option)
          : [...prev.lifestyle[category], option]
      }
    }));
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [18, 35],
      maxDistance: 50,
      showMen: true,
      showWomen: true,
      showNonBinary: true,
      recentlyActive: false,
      education: [],
      interests: [],
      height: [150, 200],
      lifestyle: {
        drinking: [],
        smoking: [],
        workout: [],
        diet: [],
      },
    });
  };

  const applyFilters = () => {
    // Apply filters and navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetButton}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Age Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          <View style={styles.rangeContainer}>
            <View style={styles.rangeInput}>
              <TouchableOpacity onPress={() => handleAgeRangeChange('min', false)}>
                <Text style={styles.rangeButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{filters.ageRange[0]}</Text>
              <TouchableOpacity onPress={() => handleAgeRangeChange('min', true)}>
                <Text style={styles.rangeButton}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.rangeSeparator}>to</Text>
            <View style={styles.rangeInput}>
              <TouchableOpacity onPress={() => handleAgeRangeChange('max', false)}>
                <Text style={styles.rangeButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{filters.ageRange[1]}</Text>
              <TouchableOpacity onPress={() => handleAgeRangeChange('max', true)}>
                <Text style={styles.rangeButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maximum Distance</Text>
          <View style={styles.distanceContainer}>
            <TouchableOpacity onPress={() => handleDistanceChange(false)}>
              <Text style={styles.rangeButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.distanceValue}>{filters.maxDistance} km</Text>
            <TouchableOpacity onPress={() => handleDistanceChange(true)}>
              <Text style={styles.rangeButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Me</Text>
          <View style={styles.genderOptions}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Men</Text>
              <Switch
                value={filters.showMen}
                onValueChange={(value) => setFilters(prev => ({ ...prev, showMen: value }))}
                trackColor={{ false: "#e0e0e0", true: "#8b5cf6" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Women</Text>
              <Switch
                value={filters.showWomen}
                onValueChange={(value) => setFilters(prev => ({ ...prev, showWomen: value }))}
                trackColor={{ false: "#e0e0e0", true: "#8b5cf6" }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Non-binary</Text>
              <Switch
                value={filters.showNonBinary}
                onValueChange={(value) => setFilters(prev => ({ ...prev, showNonBinary: value }))}
                trackColor={{ false: "#e0e0e0", true: "#8b5cf6" }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Recently Active */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.sectionTitle}>Recently Active</Text>
            <Switch
              value={filters.recentlyActive}
              onValueChange={(value) => setFilters(prev => ({ ...prev, recentlyActive: value }))}
              trackColor={{ false: "#e0e0e0", true: "#8b5cf6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Height */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Height (cm)</Text>
          <View style={styles.rangeContainer}>
            <View style={styles.rangeInput}>
              <TouchableOpacity onPress={() => handleHeightChange('min', false)}>
                <Text style={styles.rangeButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{filters.height[0]}</Text>
              <TouchableOpacity onPress={() => handleHeightChange('min', true)}>
                <Text style={styles.rangeButton}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.rangeSeparator}>to</Text>
            <View style={styles.rangeInput}>
              <TouchableOpacity onPress={() => handleHeightChange('max', false)}>
                <Text style={styles.rangeButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.rangeValue}>{filters.height[1]}</Text>
              <TouchableOpacity onPress={() => handleHeightChange('max', true)}>
                <Text style={styles.rangeButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.optionsGrid}>
            {educationOptions.map((education) => (
              <TouchableOpacity
                key={education}
                style={[
                  styles.optionTag,
                  filters.education.includes(education) && styles.selectedTag
                ]}
                onPress={() => toggleEducation(education)}
              >
                <Text style={[
                  styles.optionText,
                  filters.education.includes(education) && styles.selectedText
                ]}>
                  {education}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.optionsGrid}>
            {interestOptions.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.optionTag,
                  filters.interests.includes(interest) && styles.selectedTag
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text style={[
                  styles.optionText,
                  filters.interests.includes(interest) && styles.selectedText
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          
          {Object.entries(lifestyleOptions).map(([category, options]) => (
            <View key={category} style={styles.lifestyleCategory}>
              <Text style={styles.lifestyleCategoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <View style={styles.optionsGrid}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionTag,
                      filters.lifestyle[category as keyof typeof lifestyleOptions].includes(option) && styles.selectedTag
                    ]}
                    onPress={() => toggleLifestyle(category as keyof typeof lifestyleOptions, option)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.lifestyle[category as keyof typeof lifestyleOptions].includes(option) && styles.selectedText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cancelButton: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  resetButton: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 15,
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  rangeInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  rangeButton: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8b5cf6",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  rangeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    minWidth: 40,
    textAlign: "center",
  },
  rangeSeparator: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 20,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignSelf: "center",
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    minWidth: 80,
    textAlign: "center",
  },
  genderOptions: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionTag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedTag: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  optionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
  },
  lifestyleCategory: {
    marginBottom: 20,
  },
  lifestyleCategoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  applyButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});