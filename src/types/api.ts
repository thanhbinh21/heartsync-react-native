// API Types - Synchronized with Backend
// Version: 1.0.0

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  profile: {
    name: string;
    age: number;
    photos: string[];
    aboutMe?: string;
    occupation?: string;
    education?: string;
    interests?: string[];
    height?: string;
    zodiac?: string;
    location?: {
      city?: string;
      state?: string;
    };
    lifestyle?: {
      smoking?: string;
      drinking?: string;
      workout?: string;
      diet?: string;
    };
  };
  preferences?: {
    gender?: string[];
    ageRange?: {
      min: number;
      max: number;
    };
    distance?: number;
  };
  subscription: "free" | "premium";
  verified: boolean;
  isOnline?: boolean;
  lastActive?: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedAt: string;
  isActive: boolean;
  matchedUser: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    bio?: string;
    isOnline: boolean;
    verified: boolean;
  };
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  messageType: "text" | "image" | "emoji";
}

export interface Conversation {
  matchId: string;
  user: {
    id: string;
    name: string;
    age: number;
    photos: string[];
    isOnline: boolean;
    verified: boolean;
  };
  lastMessage: {
    id: string;
    text: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  } | null;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "match" | "message" | "like" | "super_like";
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  timestamp: string;
}

export type LikeType = "like" | "super_like" | "pass";

// Request Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SwipeRequest {
  likedUserId: string;
  likeType: LikeType;
}

export interface SwipeResponse {
  isMatch: boolean;
  matchId: string | null;
  like: {
    id: string;
    userId: string;
    likedUserId: string;
    likeType: string;
    timestamp: string;
  };
}

export interface SendMessageRequest {
  text: string;
  messageType?: "text" | "image" | "emoji";
}

export interface UpdateProfileRequest {
  profile: Partial<User["profile"]>;
}

export interface UpdatePreferencesRequest {
  preferences: Partial<User["preferences"]>;
}

export interface UpdateSubscriptionRequest {
  subscriptionType: "free" | "premium";
}

export interface UnreadCountResponse {
  count: number;
}
