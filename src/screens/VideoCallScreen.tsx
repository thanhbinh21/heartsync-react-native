import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "VideoCall">;
type RoutePropType = RouteProp<RootStackParamList, "VideoCall">;

const { width, height } = Dimensions.get("window");

export default function VideoCallScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const endCall = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Remote Video View */}
      <View style={styles.remoteVideo}>
        <Image
          source={{ uri: user.photo }}
          style={styles.remoteVideoBackground}
          blurRadius={20}
        />
        <Image source={{ uri: user.photo }} style={styles.remoteVideoImage} />
      </View>

      {/* Local Video View (PiP) */}
      <View style={styles.localVideo}>
        {isCameraOff ? (
          <View style={styles.cameraOffView}>
            <Ionicons name="videocam-off" size={32} color="#fff" />
          </View>
        ) : (
          <View style={styles.cameraOnView}>
            <Text style={styles.cameraOnText}>You</Text>
          </View>
        )}
      </View>

      {/* Top Info */}
      <View style={styles.topInfo}>
        <View style={styles.userInfoCard}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Ionicons
            name={isMuted ? "mic-off" : "mic"}
            size={28}
            color={isMuted ? "#FF4458" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
        >
          <Ionicons
            name={isCameraOff ? "videocam-off" : "videocam"}
            size={28}
            color={isCameraOff ? "#FF4458" : "#fff"}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <Ionicons name="call" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="swap-horizontal" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="volume-high" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  remoteVideo: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideoBackground: {
    position: "absolute",
    width: width,
    height: height,
  },
  remoteVideoImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  localVideo: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#333",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraOffView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  cameraOnView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#444",
  },
  cameraOnText: {
    color: "#fff",
    fontSize: 12,
  },
  topInfo: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  userInfoCard: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  callDuration: {
    fontSize: 13,
    color: "#4CAF50",
    marginTop: 2,
  },
  bottomControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255, 68, 88, 0.3)",
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF4458",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
});
