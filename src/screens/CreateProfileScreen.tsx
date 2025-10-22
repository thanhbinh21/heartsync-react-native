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
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "CreateProfile">;

export default function CreateProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [aboutMe, setAboutMe] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("Male");
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

  const interestsList = ["Coffee brewing", "Trekking", "Sci-fi movies", "Art", "Music", "Travel"];
  const languagesList = ["English", "Finnish", "Spanish", "French", "German"];

  const profileCompletion = 45; // Calculate based on filled fields

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

  const handleSaveProfile = () => {
    if (photos.length === 0) {
      Alert.alert("Missing information", "Please add at least one photo");
      return;
    }
    
    // Save profile logic here
    navigation.navigate("Swipe");
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
        <Text style={styles.sectionTitle}>Photos</Text>
        <Text style={styles.sectionSubtitle}>The main photo is how you appear to others on the swipe view.</Text>
        
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
      </View>

      {/* My Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My details</Text>
        {renderDetailRow("briefcase-outline", "Occupation", occupation, () => Alert.alert("Add Occupation"))}
        {renderDetailRow("person-outline", "Gender & Pronouns", gender, () => Alert.alert("Select Gender"))}
        {renderDetailRow("school-outline", "Education", education, () => Alert.alert("Add Education"))}
        {renderDetailRow("location-outline", "Location", location, () => Alert.alert("Set Location"))}
      </View>

      {/* Most People Want to Know */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Most people also want to know:</Text>
        {renderDetailRow("resize-outline", "Height", height, () => Alert.alert("Add Height"))}
        {renderDetailRow("cloud-outline", "Smoking", smoking, () => Alert.alert("Add Smoking"))}
        {renderDetailRow("wine-outline", "Drinking", drinking, () => Alert.alert("Add Drinking"))}
        {renderDetailRow("paw-outline", "Pets", pets, () => Alert.alert("Add Pets"))}
        {renderDetailRow("people-outline", "Children", children, () => Alert.alert("Add Children"))}
        {renderDetailRow("star-outline", "Zodiac sign", zodiacSign, () => Alert.alert("Add Zodiac"))}
        {renderDetailRow("flower-outline", "Religion", religion, () => Alert.alert("Add Religion"))}
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
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressPercent: {
    color: "#00C6D7",
    fontWeight: "600",
  },
  progressBarBg: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0F7FA",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#00C6D7",
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 15,
    lineHeight: 18,
  },
  photoGrid: {
    flexDirection: "row",
    gap: 10,
  },
  mainPhoto: {
    width: 180,
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFF9C4",
  },
  additionalPhotos: {
    flex: 1,
    gap: 10,
  },
  smallPhoto: {
    height: 84,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
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
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#666",
    backgroundColor: "#fff",
    height: 100,
    textAlignVertical: "top",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#333",
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
  bottomSpacer: {
    height: 50,
  },
});