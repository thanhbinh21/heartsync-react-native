import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigate, useLocation, useParams } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { messageService } from "../services/message.service";

const mockMessages = [
  {
    id: "1",
    text: "Hey! How's your day going?",
    timestamp: new Date(Date.now() - 3600000),
    isMyMessage: false,
  },
  {
    id: "2",
    text: "Hi! Going great, thanks 😊 How about yours?",
    timestamp: new Date(Date.now() - 3500000),
    isMyMessage: true,
  },
  {
    id: "3",
    text: "Pretty good! I saw you're into photography. That's awesome!",
    timestamp: new Date(Date.now() - 3400000),
    isMyMessage: false,
  },
  {
    id: "4",
    text: "Yes! I love capturing moments. Do you have any hobbies?",
    timestamp: new Date(Date.now() - 3300000),
    isMyMessage: true,
  },
  {
    id: "5",
    text: "I'm really into hiking and outdoor adventures!",
    timestamp: new Date(Date.now() - 3200000),
    isMyMessage: false,
  },
];

import { getRandomPhoto } from "../utils/photo-utils";

export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId } = useParams<{ matchId: string }>();
  const { user: currentUser } = useAuthContext();
  const { user: matchedUser } = location.state || {
    user: {
      id: "1",
      name: "Emma Wilson",
      photo: getRandomPhoto(),
      age: 28,
    },
  };
  
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date(),
        isMyMessage: true,
      };
      
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return timestamp.toLocaleDateString();
  };

  const renderMessage = ({ item }: any) => (
    <View
      style={[
        styles.messageContainer,
        item.isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate(-1)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => navigate(`/user-detail/${matchedUser?.id}`, { state: { user: matchedUser } })}
          >
            <Image source={{ uri: matchedUser?.photo }} style={styles.userAvatar} />
            <View>
              <Text style={styles.userName}>{matchedUser?.name}</Text>
              <Text style={styles.userStatus}>Active now</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.videoButton}
            onPress={() => navigate(`/video-call/${matchId || matchedUser?.id}`, { state: { user: matchedUser } })}
          >
            <Ionicons name="videocam" size={28} color="#FF6B9D" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color="#888" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline
          />
          
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backButton: {
    padding: 6,
  },
  videoButton: {
    padding: 6,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.2,
  },
  userStatus: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "600",
  },
  messagesList: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  myMessageBubble: {
    backgroundColor: "#9D4EDD",
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: "#F5F0FA",
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#222",
  },
  messageTime: {
    fontSize: 11,
    color: "#999",
    marginTop: 5,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  attachButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#F5F0FA",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E8D5F5",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 6,
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#d0d0d0",
    shadowOpacity: 0,
    elevation: 0,
  },
});
