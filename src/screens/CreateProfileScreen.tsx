import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import * as ImagePicker from "expo-image-picker";

type NavProp = StackNavigationProp<RootStackParamList, "CreateProfile">;

export default function CreateProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const availableInterests = [
    "Travel", "Music", "Sports", "Movies", "Books", "Art", "Cooking",
    "Dancing", "Photography", "Hiking", "Gaming", "Fitness"
  ];

  const pickImage = async () => {
    if (photos.length >= 6) {
      Alert.alert("Maximum photos", "You can only add up to 6 photos");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSaveProfile = () => {
    if (!name || !age || photos.length === 0) {
      Alert.alert("Missing information", "Please fill in all required fields and add at least one photo");
      return;
    }
    
    // Save profile logic here
    navigation.navigate("Swipe");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create My Profile</Text>
        <TouchableOpacity onPress={handleSaveProfile}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Photos *</Text>
        <Text style={styles.sectionSubtitle}>Add at least 1 photo to continue</Text>
        
        <View style={styles.photoGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoSlot}
              onPress={photos[index] ? () => removePhoto(index) : pickImage}
            >
              {photos[index] ? (
                <Image source={{ uri: photos[index] }} style={styles.photo} />
              ) : (
                <View style={styles.addPhotoButton}>
                  <Text style={styles.addPhotoText}>+</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="Enter your age"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your location"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <Text style={styles.sectionSubtitle}>Select your interests</Text>
        
        <View style={styles.interestsGrid}>
          {availableInterests.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestTag,
                interests.includes(interest) && styles.selectedInterestTag
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestText,
                interests.includes(interest) && styles.selectedInterestText
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  backButton: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },
  saveButton: {
    fontSize: 16,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoSlot: {
    width: "31%",
    aspectRatio: 3/4,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  addPhotoText: {
    fontSize: 24,
    color: "#999",
    fontWeight: "300",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#f9f9f9",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedInterestTag: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  interestText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedInterestText: {
    color: "#fff",
  },
  bottomSpacer: {
    height: 50,
  },
});