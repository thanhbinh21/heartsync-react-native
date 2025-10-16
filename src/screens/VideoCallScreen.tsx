import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "VideoCall">;
type RoutePropType = RouteProp<RootStackParamList, "VideoCall">;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function VideoCallScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    // Simulate connecting
    const connectTimer = setTimeout(() => {
      setIsConnecting(false);
      setIsCallActive(true);
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      "End Call",
      "Are you sure you want to end the call?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "End Call", 
          style: "destructive",
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const handleSwitchCamera = () => {
    // Switch between front and back camera
    Alert.alert("Camera", "Camera switched");
  };

  if (isConnecting) {
    return (
      <View style={styles.connectingContainer}>
        <Image source={{ uri: user.photo }} style={styles.connectingAvatar} />
        <Text style={styles.connectingName}>Calling {user.name}...</Text>
        <Text style={styles.connectingStatus}>Connecting...</Text>
        
        <View style={styles.connectingButtons}>
          <TouchableOpacity style={styles.endCallButton} onPress={() => navigation.goBack()}>
            <Text style={styles.endCallIcon}>📞</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Remote video (main view) */}
      <View style={styles.remoteVideoContainer}>
        {!isVideoOff ? (
          <Image source={{ uri: user.photo }} style={styles.remoteVideo} blurRadius={0} />
        ) : (
          <View style={styles.videoOffContainer}>
            <Image source={{ uri: user.photo }} style={styles.videoOffAvatar} />
            <Text style={styles.videoOffText}>{user.name} turned off camera</Text>
          </View>
        )}
        
        {/* Call info overlay */}
        <View style={styles.callInfoOverlay}>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
          <Text style={styles.callStatus}>Connected</Text>
        </View>
      </View>

      {/* Local video (picture-in-picture) */}
      <View style={styles.localVideoContainer}>
        {!isVideoOff ? (
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }} 
            style={styles.localVideo} 
          />
        ) : (
          <View style={styles.localVideoOff}>
            <Text style={styles.localVideoOffIcon}>📷</Text>
          </View>
        )}
      </View>

      {/* User info */}
      <View style={styles.userInfoOverlay}>
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={handleToggleMute}
        >
          <Text style={styles.controlButtonIcon}>
            {isMuted ? "🎤" : "🔇"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={handleToggleVideo}
        >
          <Text style={styles.controlButtonIcon}>
            {isVideoOff ? "📹" : "📵"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleSwitchCamera}
        >
          <Text style={styles.controlButtonIcon}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Text style={styles.controlButtonIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Additional actions */}
      <View style={styles.additionalActions}>
        <TouchableOpacity style={styles.additionalButton}>
          <Text style={styles.additionalButtonIcon}>💬</Text>
          <Text style={styles.additionalButtonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalButton}>
          <Text style={styles.additionalButtonIcon}>📷</Text>
          <Text style={styles.additionalButtonText}>Screenshot</Text>
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
  connectingContainer: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  connectingAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    borderWidth: 4,
    borderColor: "#fff",
  },
  connectingName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  connectingStatus: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 60,
    textAlign: "center",
  },
  connectingButtons: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
  },
  remoteVideoContainer: {
    flex: 1,
    position: "relative",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoOffContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  videoOffAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  videoOffText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  callInfoOverlay: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callDuration: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  callStatus: {
    fontSize: 12,
    color: "#2ecc71",
    textAlign: "center",
  },
  localVideoContainer: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  localVideo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  localVideoOff: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  localVideoOffIcon: {
    fontSize: 30,
  },
  userInfoOverlay: {
    position: "absolute",
    bottom: 180,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  controlButtonIcon: {
    fontSize: 24,
  },
  endCallButton: {
    backgroundColor: "#e74c3c",
  },
  endCallIcon: {
    fontSize: 24,
    transform: [{ rotate: "135deg" }],
  },
  additionalActions: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  additionalButton: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  additionalButtonIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  additionalButtonText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.8,
  },
});