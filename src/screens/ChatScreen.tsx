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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { Ionicons } from "@expo/vector-icons";

type NavProp = StackNavigationProp<RootStackParamList, "Chat">;
type RoutePropType = RouteProp<RootStackParamList, "Chat">;

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
];

export default function ChatScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate("ProfileView", { user })}
        >
          <Image source={{ uri: user.photo }} style={styles.userAvatar} />
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userStatus}>Active now</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("VideoCall", { user })}>
          <Ionicons name="videocam" size={28} color="#9D4EDD" />
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
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    gap: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  userStatus: {
    fontSize: 13,
    color: "#4CAF50",
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#9D4EDD",
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#000",
  },
  messageTime: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  attachButton: {
    marginRight: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
