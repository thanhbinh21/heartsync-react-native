export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  photos: string[];
  bio: string;
  location: string;
  distance?: number;
  job: string;
  company: string;
  education: string;
  height: string;
  zodiac: string;
  interests: string[];
  lifestyle: {
    smoking: string;
    drinking: string;
    workout: string;
    diet: string;
  };
  isOnline?: boolean;
  lastActive?: string;
  verified?: boolean;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedAt: string;
  isActive: boolean;
  lastMessageId?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'emoji';
}

export interface Like {
  id: string;
  userId: string;
  likedUserId: string;
  likeType: 'like' | 'super_like' | 'pass';
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like' | 'super_like';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  timestamp: string;
}

export interface Profile extends User {
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
    showMen: boolean;
    showWomen: boolean;
    showNonBinary: boolean;
  };
  isPremium: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}