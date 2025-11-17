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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate, useLocation } from "react-router-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { userService } from "../services/user.service";
import { useAuthContext } from "../context/AuthContext";

// Helper function to convert image URI to base64
const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image:', error);
    throw error;
  }
};


export default function CreateProfileScreen() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const returnTo = routeLocation.state?.returnTo;
  const { user, logout } = useAuthContext();
  const [photos, setPhotos] = useState<string[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("male");
  const [education, setEducation] = useState("");
  const [location, setLocation] = useState("NV 89104");
  const [height, setHeight] = useState("");
  const [smoking, setSmoking] = useState("");
  const [drinking, setDrinking] = useState("");
  const [pets, setPets] = useState("");
  const [children, setChildren] = useState("");
  const [zodiacSign, setZodiacSign] = useState("");
  const [religion, setReligion] = useState("");
  const [interests, setInterests] = useState<string[]>(["Sci-fi movies"]);
  const [languages, setLanguages] = useState<string[]>(["English", "Finnish"]);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Handle session expired - clear storage and redirect to login
  const handleSessionExpired = async () => {
    console.log("🚨 Session expired - clearing storage and redirecting to login");
    try {
      await AsyncStorage.clear();
      await logout();
      Alert.alert(
        "Session Expired", 
        "Your session has expired. Please login again.", 
        [
          {
            text: "OK",
            onPress: () => navigate('/login')
          }
        ]
      );
    } catch (error) {
      console.error("Error clearing storage:", error);
      navigate('/login');
    }
  };

  const interestsList = ["Coffee brewing", "Trekking", "Sci-fi movies", "Art", "Music", "Travel"];
  const languagesList = ["English", "Finnish", "Spanish", "French", "German"];

  // Calculate profile completion dynamically
  const calculateCompletion = (): number => {
    const fields = [
      // photos.length > 0,  // REMOVED - không yêu cầu photos nữa
      aboutMe.length >= 20,
      occupation,
      gender,
      education,
      location,
      height,
      smoking,
      drinking,
      pets,
      children,
      zodiacSign,
      religion,
      interests.length > 0,
      languages.length > 0,
      name,
      age,
    ];
    
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const profileCompletion = calculateCompletion();

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
      if (interests.length < 5) {
        setInterests([...interests, interest]);
      }
    }
  };

  const toggleLanguage = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter(l => l !== language));
    } else {
      setLanguages([...languages, language]);
    }
  };

  const handleSaveProfile = async () => {
    // Basic validation (bỏ qua yêu cầu photos)
    if (!name || name.trim().length < 2) {
      Alert.alert("Missing information", "Please enter your name");
      return;
    }

    if (!age || parseInt(age) < 18 || parseInt(age) > 100) {
      Alert.alert("Invalid age", "Please enter a valid age (18-100)");
      return;
    }

    if (!aboutMe || aboutMe.trim().length < 20) {
      Alert.alert("About me too short", "Please write at least 20 characters about yourself");
      return;
    }

    if (interests.length === 0) {
      Alert.alert("Missing interests", "Please select at least one interest");
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare profile data matching backend expectations
      const profileData: any = {
        name: name.trim(),
        age: parseInt(age),
        gender: gender.toLowerCase(),
        aboutMe: aboutMe.trim(),
        interests: interests,
        languages: languages,
        location: {
          zipCode: location,
        },
      };

      // Add optional fields only if they have values
      if (occupation.trim()) profileData.occupation = occupation.trim();
      if (education.trim()) profileData.education = education.trim();
      if (height.trim()) profileData.height = height.trim();
      if (smoking.trim()) profileData.smoking = smoking.trim();
      if (drinking.trim()) profileData.drinking = drinking.trim();
      if (pets.trim()) profileData.pets = pets.trim();
      if (children.trim()) profileData.children = children.trim();
      if (zodiacSign.trim()) profileData.zodiac = zodiacSign.trim();
      if (religion.trim()) profileData.religion = religion.trim();

      // Log data being sent
      console.log("📤 Profile data to send:", {
        ...profileData,
        interests: profileData.interests?.length,
        languages: profileData.languages?.length,
      });

      // Update profile via API
      const result = await userService.updateProfile(profileData);
      console.log("✅ Profile update successful:", result.profile?.name);
      
      // Always navigate to UserDetailScreen after save
      console.log("📱 Profile saved successfully, navigating to UserDetailScreen");
      navigate(`/user-detail`);
    } catch (error: any) {
      console.error("❌ Error saving profile:", error);
      
      let errorMessage = "Failed to save profile. Please try again.";
      
      // Parse error from different sources
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.log("📥 Server error message:", errorMessage);
      } else if (error.message) {
        console.log("📥 Error message:", error.message);
        
        if (error.message.includes('User not found') || 
            error.message.includes('Invalid user ID') ||
            error.message.includes('login again') ||
            error.message.includes('not logged in') ||
            error.message.includes('old userId')) {
          console.log("🚨 User not found - session expired");
          
          Alert.alert(
            "User ID Expired! 🚨", 
            `Your user ID is outdated due to database reset.\n\nOld ID: ${user?.id}\nNew ID needed!\n\nPlease login again to get the new user ID.`,
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Re-login Now", 
                onPress: handleSessionExpired,
                style: "default"
              }
            ]
          );
          return;
        } else if (error.message.includes('non-JSON')) {
          errorMessage = 'Server error. Please check your connection and try again.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailRow = (icon: any, label: string, value: string, onPress: () => void) => (
    <TouchableOpacity style={styles.detailRow} onPress={onPress}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={20} color="#666" />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <View style={styles.detailRight}>
        <Text style={value ? styles.detailValue : styles.detailAdd}>{value || "Add"}</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate(-1)}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Completion */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>Profile completion: <Text style={styles.progressPercent}>{profileCompletion}%</Text></Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${profileCompletion}%` }]} />
        </View>
      </View>

      {/* Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos (Optional)</Text>
        <Text style={styles.sectionSubtitle}>You can add photos later. The main photo is how you appear to others on the swipe view.</Text>
        
        <View style={styles.photoGrid}>
          {/* Main Photo */}
          <TouchableOpacity
            style={styles.mainPhoto}
            onPress={photos[0] ? () => removePhoto(0) : pickImage}
          >
            {photos[0] ? (
              <Image source={{ uri: photos[0] }} style={styles.photo} />
            ) : (
              <View style={styles.addPhotoButton}>
                <Ionicons name="add" size={32} color="#ccc" />
              </View>
            )}
          </TouchableOpacity>

          {/* Additional Photos */}
          <View style={styles.additionalPhotos}>
            {Array.from({ length: 5 }).map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={styles.smallPhoto}
                onPress={photos[index + 1] ? () => removePhoto(index + 1) : pickImage}
              >
                {photos[index + 1] ? (
                  <Image source={{ uri: photos[index + 1] }} style={styles.photo} />
                ) : (
                  <View style={styles.addPhotoButtonSmall}>
                    <Ionicons name="add" size={24} color="#ccc" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* About Me Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About me</Text>
        <Text style={styles.sectionSubtitle}>Make it easy for others to get a sense of who you are.</Text>
        <TextInput
          style={styles.bioInput}
          value={aboutMe}
          onChangeText={setAboutMe}
          placeholder="Share a few words about yourself, your interests, and what you're looking for in a connection..."
          placeholderTextColor="#ccc"
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{aboutMe.length} / 500 characters</Text>
      </View>

      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic information</Text>
        <Text style={styles.requiredNote}>* Required fields</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name *"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Your age *"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>

      {/* My Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My details</Text>
        {renderDetailRow("briefcase-outline", "Occupation", occupation, () => {
          Alert.prompt("Occupation", "Enter your occupation", (text) => setOccupation(text));
        })}
        
        {/* Gender Selection */}
        <View style={styles.detailRow}>
          <View style={styles.detailLeft}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.detailLabel}>Gender</Text>
          </View>
          <View style={styles.genderButtons}>
            <TouchableOpacity 
              style={[styles.genderButton, gender === "male" && styles.genderButtonActive]}
              onPress={() => setGender("male")}
            >
              <Text style={[styles.genderButtonText, gender === "male" && styles.genderButtonTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, gender === "female" && styles.genderButtonActive]}
              onPress={() => setGender("female")}
            >
              <Text style={[styles.genderButtonText, gender === "female" && styles.genderButtonTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, gender === "other" && styles.genderButtonActive]}
              onPress={() => setGender("other")}
            >
              <Text style={[styles.genderButtonText, gender === "other" && styles.genderButtonTextActive]}>
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {renderDetailRow("school-outline", "Education", education, () => {
          Alert.prompt("Education", "Enter your education", (text) => setEducation(text));
        })}
        {renderDetailRow("location-outline", "Location", location, () => {
          Alert.prompt("Location", "Enter your location (ZIP code)", (text) => setLocation(text));
        })}
      </View>

      {/* Most People Want to Know */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Most people also want to know:</Text>
        {renderDetailRow("resize-outline", "Height", height, () => {
          Alert.prompt("Height", "Enter your height (e.g., 5'6\" or 168cm)", (text) => setHeight(text));
        })}
        {renderDetailRow("cloud-outline", "Smoking", smoking, () => {
          Alert.alert("Smoking", "Select your smoking preference", [
            { text: "Never", onPress: () => setSmoking("Never") },
            { text: "Occasionally", onPress: () => setSmoking("Occasionally") },
            { text: "Regularly", onPress: () => setSmoking("Regularly") },
            { text: "Cancel", style: "cancel" },
          ]);
        })}
        {renderDetailRow("wine-outline", "Drinking", drinking, () => {
          Alert.alert("Drinking", "Select your drinking preference", [
            { text: "Never", onPress: () => setDrinking("Never") },
            { text: "Socially", onPress: () => setDrinking("Socially") },
            { text: "Regularly", onPress: () => setDrinking("Regularly") },
            { text: "Cancel", style: "cancel" },
          ]);
        })}
        {renderDetailRow("paw-outline", "Pets", pets, () => {
          Alert.alert("Pets", "Select your pet preference", [
            { text: "Dog lover", onPress: () => setPets("Dog lover") },
            { text: "Cat lover", onPress: () => setPets("Cat lover") },
            { text: "Both", onPress: () => setPets("Both") },
            { text: "None", onPress: () => setPets("None") },
            { text: "Cancel", style: "cancel" },
          ]);
        })}
        {renderDetailRow("people-outline", "Children", children, () => {
          Alert.alert("Children", "Select your preference", [
            { text: "Have children", onPress: () => setChildren("Have children") },
            { text: "Want children", onPress: () => setChildren("Want children") },
            { text: "Don't want", onPress: () => setChildren("Don't want") },
            { text: "Open to children", onPress: () => setChildren("Open to children") },
            { text: "Cancel", style: "cancel" },
          ]);
        })}
        {renderDetailRow("star-outline", "Zodiac sign", zodiacSign, () => {
          Alert.prompt("Zodiac Sign", "Enter your zodiac sign", (text) => setZodiacSign(text));
        })}
        {renderDetailRow("flower-outline", "Religion", religion, () => {
          Alert.prompt("Religion", "Enter your religion (optional)", (text) => setReligion(text));
        })}
      </View>

      {/* Interests Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I enjoy</Text>
        <Text style={styles.sectionSubtitle}>Adding your interest is a great way to find like-minded connections.</Text>
        
        <View style={styles.interestsContainer}>
          {interests.map((interest, index) => (
            <View key={index} style={styles.selectedInterest}>
              <Text style={styles.interestText}>{interest}</Text>
              <TouchableOpacity onPress={() => toggleInterest(interest)}>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>Sci-fi movies</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.interestTags}>
          {interestsList.filter(i => !interests.includes(i)).slice(0, 2).map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interestTag}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={styles.interestTagText}>{interest}</Text>
              <TouchableOpacity>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Languages Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I communicate in</Text>
        
        <TouchableOpacity style={styles.languageButton}>
          <Ionicons name="radio-button-on" size={20} color="#000" />
          <Text style={styles.languageText}>English</Text>
          <Ionicons name="chevron-down" size={20} color="#666" style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        <View style={styles.languageTags}>
          {languages.filter(l => l !== "English").map((lang, index) => (
            <View key={index} style={styles.languageTag}>
              <Text style={styles.languageTagText}>{lang}</Text>
              <TouchableOpacity onPress={() => toggleLanguage(lang)}>
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Linked Accounts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Linked accounts</Text>
        {renderDetailRow("logo-instagram", "Instagram", "", () => Alert.alert("Link Instagram"))}
        {renderDetailRow("logo-facebook", "Facebook", "", () => Alert.alert("Link Facebook"))}
        {renderDetailRow("logo-twitter", "Twitter", "", () => Alert.alert("Link Twitter"))}
      </View>

      {/* Save Button */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSaveProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>

     
       
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
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
    fontWeight: "500",
  },
  progressPercent: {
    color: "#9D4EDD",
    fontWeight: "700",
    fontSize: 16,
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#E8D5F5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#9D4EDD",
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 4,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#777",
    marginBottom: 16,
    lineHeight: 19,
  },
  requiredNote: {
    fontSize: 12,
    color: "#FF6B9D",
    marginBottom: 10,
    fontStyle: "italic",
  },
  photoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  mainPhoto: {
    width: 170,
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F5F0FA",
  },
  additionalPhotos: {
    flex: 1,
    gap: 12,
  },
  smallPhoto: {
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F9F5FF",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  addPhotoButtonSmall: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
    height: 110,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#FAFAFA",
    marginBottom: 14,
    height: 52,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    minHeight: 56,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  detailRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailValue: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  detailAdd: {
    fontSize: 15,
    color: "#ccc",
  },
  genderButtons: {
    flexDirection: "row",
    gap: 10,
  },
  genderButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#d0d0d0",
    backgroundColor: "#fff",
    minWidth: 70,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#9D4EDD",
    borderColor: "#9D4EDD",
  },
  genderButtonText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
  },
  genderButtonTextActive: {
    color: "#fff",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  selectedInterest: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 15,
    color: "#333",
  },
  interestTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
  },
  interestTagText: {
    fontSize: 14,
    color: "#333",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  languageText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  languageTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
  },
  languageTagText: {
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#9D4EDD",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    height: 56,
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: "#C9A9E5",
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 50,
  },
  
  // Debug styles
  debugSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 10,
    textAlign: "center",
  },
  debugButton: {
    backgroundColor: "#6c757d",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 4,
    alignItems: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});