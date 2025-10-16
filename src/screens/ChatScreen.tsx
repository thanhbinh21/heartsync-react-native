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
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type NavProp = StackNavigationProp<RootStackParamList, "Chat">;
type RoutePropType = RouteProp<RootStackParamList, "Chat">;

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isMyMessage: boolean;
  isRead?: boolean;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hey! How's your day going?",
    timestamp: new Date(Date.now() - 3600000),
    isMyMessage: false,
    isRead: true,
  },
  {
    id: "2",
    text: "Hi! Going great, thanks for asking 😊 How about yours?",
    timestamp: new Date(Date.now() - 3500000),
    isMyMessage: true,
    isRead: true,
  },
  {
    id: "3",
    text: "Pretty good! I saw you're into photography. That's awesome!",
    timestamp: new Date(Date.now() - 3400000),
    isMyMessage: false,
    isRead: true,
  },
  {
    id: "4",
    text: "Yes! I love capturing moments. Do you have any hobbies?",
    timestamp: new Date(Date.now() - 3300000),
    isMyMessage: true,
    isRead: true,
  },
  {
    id: "5",
    text: "I'm really into hiking and trying new restaurants. Maybe we could check out that new place downtown sometime?",
    timestamp: new Date(Date.now() - 3200000),
    isMyMessage: false,
    isRead: false,
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { user } = route.params;
  
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date(),
        isMyMessage: true,
        isRead: false,
      };
      
      setMessages([...messages, newMessage]);
      setInputText("");
      
      // Simulate typing indicator and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate a response (optional)
        if (Math.random() > 0.7) {
          const responses = [
            "That sounds great!",
            "I'd love that! 😊",
            "Absolutely!",
            "Count me in!",
            "Perfect timing!",
          ];
          
          const responseMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            isMyMessage: false,
            isRead: false,
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }
      }, 2000);
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    if (diff < 60000) { // Less than 1 minute
      return "now";
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isMyMessage ? styles.myMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={[
        styles.messageTime,
        item.isMyMessage ? styles.myMessageTime : styles.otherMessageTime
      ]}>
        {formatTime(item.timestamp)}
        {item.isMyMessage && (
          <Text style={styles.readStatus}>
            {item.isRead ? " ✓✓" : " ✓"}
          </Text>
        )}
      </Text>
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Text style={styles.typingText}>typing...</Text>
      </View>
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
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation.navigate("ProfileView", { user })}
        >
          <Image source={{ uri: user.photo }} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userStatus}>Active now</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate("VideoCall", { user })}
          >
            <Text style={styles.headerButtonText}>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => Alert.alert("Report", "Report this user?")}
          >
            <Text style={styles.headerButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Typing Indicator */}
      {isTyping && renderTypingIndicator()}

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachButtonText}>📎</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    fontSize: 24,
    color: "#8b5cf6",
    fontWeight: "600",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: "#2ecc71",
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  headerButtonText: {
    fontSize: 18,
  },
  messagesList: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginVertical: 2,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: "#8b5cf6",
    borderBottomRightRadius: 6,
  },
  otherMessageBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#111",
  },
  messageTime: {
    fontSize: 11,
    marginBottom: 8,
  },
  myMessageTime: {
    color: "#8b5cf6",
    textAlign: "right",
  },
  otherMessageTime: {
    color: "#999",
    textAlign: "left",
  },
  readStatus: {
    color: "#8b5cf6",
    fontSize: 10,
  },
  typingContainer: {
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: "flex-start",
  },
  typingBubble: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
  },
  typingText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111",
    maxHeight: 100,
    paddingVertical: 5,
  },
  attachButton: {
    marginLeft: 10,
    padding: 5,
  },
  attachButtonText: {
    fontSize: 18,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonActive: {
    backgroundColor: "#8b5cf6",
  },
  sendButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});