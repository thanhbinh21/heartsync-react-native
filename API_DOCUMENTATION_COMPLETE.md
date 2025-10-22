# 📚 HeartSync API - Complete Documentation for Frontend

> **Tài liệu API đầy đủ để Frontend tích hợp hoàn chỉnh**  
> Version: 1.0.0  
> Last Updated: October 22, 2025

---

## 📋 Table of Contents

1. [Tổng Quan](#tổng-quan)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Matching System](#matching-system)
5. [Messaging](#messaging)
6. [Notifications](#notifications)
7. [Error Handling](#error-handling)
8. [Testing Guide](#testing-guide)

---

## 🎯 Tổng Quan

### Base URL

```
Development: http://YOUR_IP:5000/api
Production:  https://api.heartsync.app/api
```

### Authentication

Tất cả các endpoint (trừ login/register) cần JWT token:

```typescript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}
```

### Response Format

**Tất cả API đều trả về format:**

```typescript
interface ApiResponse<T> {
  success: boolean;     // true nếu thành công, false nếu lỗi
  data?: T;            // Dữ liệu trả về (nếu có)
  message?: string;    // Thông báo (thành công hoặc lỗi)
}
```

**Success Example:**
```json
{
  "success": true,
  "data": { "id": "123", "name": "John" },
  "message": "Operation successful"
}
```

**Error Example:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| `200` | OK | Hiển thị data |
| `201` | Created | Show success, redirect |
| `400` | Bad Request | Hiển thị validation error |
| `401` | Unauthorized | Redirect to login, clear token |
| `403` | Forbidden | Show "Access denied" hoặc upgrade prompt |
| `404` | Not Found | Show "Not found" message |
| `500` | Server Error | Show "Try again later" |

---

## 🔐 1. AUTHENTICATION

### 1.1. Login

**Đăng nhập tài khoản**

```http
POST /api/auth/login
```

**Request Body:**
```typescript
{
  username: string;  // Required - Tên đăng nhập
  password: string;  // Required - Mật khẩu
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Login successful",
  token: string,  // JWT token - LƯU VÀO STORAGE!
  user: {
    id: string,
    username: string,
    profile: {
      name: string,
      age: number,
      photos: string[],
      aboutMe: string,
      // ... other profile fields
    },
    preferences: {
      gender: string[],
      ageRange: { min: number, max: number },
      distance: number
    },
    subscription: "free" | "premium",
    verified: boolean
  }
}
```

**Error Responses:**
```json
// 400 - Missing fields
{
  "success": false,
  "message": "Username and password are required"
}

// 401 - Invalid credentials
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Frontend Usage:**
```typescript
const response = await fetch('http://YOUR_IP:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin'
  })
});

const data = await response.json();

if (data.success) {
  // Lưu token vào AsyncStorage
  await AsyncStorage.setItem('authToken', data.token);
  // Lưu user info
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  // Navigate to Home
  navigation.navigate('Home');
} else {
  Alert.alert('Login Failed', data.message);
}
```

**Test Accounts:**
```
Username: admin     | Password: admin
Username: ava       | Password: password
Username: joshua    | Password: password
```

---

### 1.2. Register

**Đăng ký tài khoản mới**

```http
POST /api/auth/register
```

**Request Body:**
```typescript
{
  username: string;  // Required - Unique
  password: string;  // Required - Min 6 chars
  email?: string;    // Optional
}
```

**Success Response (201):**
```typescript
{
  success: true,
  message: "Registration successful",
  token: string,
  user: {
    id: string,
    username: string,
    profile: {
      name: string,  // Default = username
      photos: []     // Empty initially
    }
  }
}
```

**Error Responses:**
```json
// 400 - Username exists
{
  "success": false,
  "message": "Username already exists"
}

// 400 - Missing fields
{
  "success": false,
  "message": "Username and password are required"
}
```

**Frontend Usage:**
```typescript
const response = await fetch('http://YOUR_IP:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: newUsername,
    password: newPassword,
    email: userEmail
  })
});

const data = await response.json();

if (data.success) {
  await AsyncStorage.setItem('authToken', data.token);
  await AsyncStorage.setItem('user', JSON.stringify(data.user));
  navigation.navigate('CompleteProfile'); // Redirect to profile setup
} else {
  Alert.alert('Registration Failed', data.message);
}
```

---

## 👤 2. USER MANAGEMENT

### 2.1. Get Current User Profile

**Lấy thông tin profile của user đang đăng nhập**

```http
GET /api/users/me
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  user: {
    id: string,
    username: string,
    email?: string,
    profile: {
      name: string,
      age: number,
      gender: string,
      photos: string[],
      aboutMe: string,
      occupation: string,
      education: string,
      location: {
        city: string,
        state: string,
        zipCode?: string
      },
      height?: string,
      smoking?: string,
      drinking?: string,
      pets?: string,
      children?: string,
      zodiac?: string,
      religion?: string,
      interests: string[],
      languages: string[]
    },
    preferences: {
      gender: string[],
      ageRange: { min: number, max: number },
      distance: number,
      languages?: string[]
    },
    subscription: "free" | "premium",
    verified: boolean
  }
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();

if (data.success) {
  setUserProfile(data.user);
} else if (response.status === 401) {
  // Token expired - redirect to login
  await AsyncStorage.clear();
  navigation.navigate('Login');
}
```

---

### 2.2. Get User by ID

**Xem profile của user khác**

```http
GET /api/users/:userId
```

**Parameters:**
- `userId` (string) - ID của user cần xem

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: {
    id: string,
    name: string,
    age: number,
    gender: string,
    photos: string[],
    bio: string,
    location: string,
    job: string,
    education: string,
    height?: string,
    zodiac?: string,
    interests: string[],
    lifestyle: {
      smoking?: string,
      drinking?: string,
      workout?: string,
      diet?: string
    },
    isOnline?: boolean,
    lastActive?: string,  // ISO 8601 format
    verified: boolean
  }
}
```

**Error Response:**
```json
// 404 - User not found
{
  "success": false,
  "message": "User not found"
}
```

**Frontend Usage:**
```typescript
const userId = '670d1234567890abcdef';
const token = await AsyncStorage.getItem('authToken');

const response = await fetch(`http://YOUR_IP:5000/api/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

if (data.success) {
  setViewedProfile(data.data);
} else {
  Alert.alert('Error', data.message);
}
```

---

### 2.3. Update Profile

**Cập nhật thông tin profile**

```http
PUT /api/users/profile
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  profile: {
    name?: string,
    age?: number,
    photos?: string[],
    aboutMe?: string,
    occupation?: string,
    education?: string,
    height?: string,
    zodiac?: string,
    interests?: string[],
    smoking?: string,
    drinking?: string,
    location?: {
      city?: string,
      state?: string,
      zipCode?: string
    }
    // Tất cả fields đều optional - chỉ gửi fields cần update
  }
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Profile updated successfully",
  user: {
    // Full updated user object
  }
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/users/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    profile: {
      name: 'John Doe',
      age: 28,
      aboutMe: 'Love hiking and outdoor activities',
      interests: ['Hiking', 'Photography', 'Travel']
    }
  })
});

const data = await response.json();

if (data.success) {
  Alert.alert('Success', 'Profile updated!');
  setUserProfile(data.user);
} else {
  Alert.alert('Error', data.message);
}
```

---

### 2.4. Update Preferences

**Cập nhật preferences (người muốn tìm)**

```http
PUT /api/users/preferences
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  preferences: {
    gender?: string[],        // ["male", "female", "non-binary"]
    ageRange?: {
      min: number,           // 18-100
      max: number            // 18-100
    },
    distance?: number,       // kilometers (1-500)
    languages?: string[]
  }
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Preferences updated successfully",
  preferences: {
    gender: string[],
    ageRange: { min: number, max: number },
    distance: number
  }
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/users/preferences', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    preferences: {
      gender: ['female'],
      ageRange: { min: 25, max: 35 },
      distance: 50
    }
  })
});

const data = await response.json();

if (data.success) {
  Alert.alert('Success', 'Preferences saved!');
}
```

---

### 2.5. Update Subscription

**Nâng cấp/hạ cấp subscription**

```http
PUT /api/users/subscription
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  subscriptionType: "free" | "premium"  // Required
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Subscription updated to premium",
  subscription: "premium"
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/users/subscription', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subscriptionType: 'premium'
  })
});

const data = await response.json();

if (data.success) {
  Alert.alert('Success', 'You are now Premium! 🎉');
  // Update local state
  setIsPremium(true);
}
```

---

## 💕 3. MATCHING SYSTEM

### 3.1. Get Discover Users

**Lấy danh sách users để swipe**

```http
GET /api/matches/discover
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      name: string,
      age: number,
      photos: string[],
      bio: string,
      location: string,
      job: string,
      interests: string[],
      verified: boolean
    },
    // ... more users (max 50)
  ]
}
```

**Notes:**
- Kết quả được filter theo preferences của user
- Loại bỏ users đã swipe (liked/passed)
- Loại bỏ users đã matched
- Trả về max 50 users

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/matches/discover', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

if (data.success) {
  setDiscoverUsers(data.data);
  setCurrentIndex(0);
} else {
  Alert.alert('Error', data.message);
}
```

---

### 3.2. Swipe (Like/Pass/Super Like)

**Swipe trên một user**

```http
POST /api/matches/swipe
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  likedUserId: string,                          // Required - ID của user được swipe
  likeType: "like" | "super_like" | "pass"     // Required
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: {
    isMatch: boolean,        // TRUE nếu 2 người like nhau!
    matchId: string | null,  // Match ID nếu isMatch = true
    like: {
      id: string,
      userId: string,         // Your ID
      likedUserId: string,    // Their ID
      likeType: string,
      timestamp: string       // ISO 8601
    }
  },
  message: "It's a match!" | "Action recorded"
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');
const currentUser = discoverUsers[currentIndex];

// Swipe Right (Like)
const response = await fetch('http://YOUR_IP:5000/api/matches/swipe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    likedUserId: currentUser.id,
    likeType: 'like'
  })
});

const data = await response.json();

if (data.success) {
  if (data.data.isMatch) {
    // 🎉 IT'S A MATCH!
    showMatchModal({
      matchId: data.data.matchId,
      user: currentUser
    });
  }
  
  // Move to next user
  setCurrentIndex(prev => prev + 1);
}
```

**Example - Super Like:**
```typescript
body: JSON.stringify({
  likedUserId: currentUser.id,
  likeType: 'super_like'  // ⭐ Super Like
})
```

**Example - Pass (Swipe Left):**
```typescript
body: JSON.stringify({
  likedUserId: currentUser.id,
  likeType: 'pass'  // ← Pass
})
```

---

### 3.3. Get Matches

**Lấy danh sách matches (người đã match)**

```http
GET /api/matches/matches
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string,              // Match ID
      userId: string,          // Your ID
      matchedUserId: string,   // Their ID
      matchedAt: string,       // ISO 8601 timestamp
      isActive: boolean,       // false nếu đã unmatch
      matchedUser: {
        id: string,
        name: string,
        age: number,
        photos: string[],
        bio: string,
        isOnline: boolean,
        verified: boolean
      }
    },
    // ... more matches
  ]
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/matches/matches', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

if (data.success) {
  setMatches(data.data);
  // Filter active matches
  const activeMatches = data.data.filter(m => m.isActive);
  setActiveMatchCount(activeMatches.length);
}
```

---

### 3.4. Unmatch

**Unmatch với một user**

```http
DELETE /api/matches/matches/:matchId
```

**Parameters:**
- `matchId` (string) - ID của match cần xóa

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Unmatched successfully"
}
```

**Error Response:**
```json
// 404 - Match not found
{
  "success": false,
  "message": "Match not found"
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');
const matchId = '670d1234567890abcdef';

Alert.alert(
  'Unmatch',
  'Are you sure you want to unmatch?',
  [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Unmatch',
      style: 'destructive',
      onPress: async () => {
        const response = await fetch(
          `http://YOUR_IP:5000/api/matches/matches/${matchId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();
        
        if (data.success) {
          Alert.alert('Unmatched', 'You have been unmatched');
          // Remove from list
          setMatches(prev => prev.filter(m => m.id !== matchId));
        }
      }
    }
  ]
);
```

---

## 💬 4. MESSAGING

### 4.1. Get Conversations

**Lấy danh sách conversations (inbox)**

```http
GET /api/messages/conversations
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: [
    {
      matchId: string,
      user: {
        id: string,
        name: string,
        age: number,
        photos: string[],
        isOnline: boolean,
        verified: boolean,
        lastActive?: string
      },
      lastMessage: {
        id: string,
        text: string,
        timestamp: string,    // ISO 8601
        isRead: boolean,
        senderId: string
      } | null,               // null nếu chưa có message
      unreadCount: number     // Số message chưa đọc
    },
    // ... more conversations
  ]
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch('http://YOUR_IP:5000/api/messages/conversations', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();

if (data.success) {
  // Sort by last message time
  const sorted = data.data.sort((a, b) => {
    const timeA = a.lastMessage?.timestamp || 0;
    const timeB = b.lastMessage?.timestamp || 0;
    return new Date(timeB) - new Date(timeA);
  });
  
  setConversations(sorted);
  
  // Calculate total unread
  const totalUnread = data.data.reduce((sum, conv) => sum + conv.unreadCount, 0);
  setBadgeCount(totalUnread);
}
```

---

### 4.2. Get Messages

**Lấy tin nhắn trong một conversation**

```http
GET /api/messages/matches/:matchId/messages
```

**Parameters:**
- `matchId` (string) - Match ID

**Query Parameters:**
- `limit` (number, optional) - Số lượng messages, default: 50
- `before` (string, optional) - ISO timestamp để pagination

**Example URLs:**
```
/api/messages/matches/670d123/messages
/api/messages/matches/670d123/messages?limit=20
/api/messages/matches/670d123/messages?limit=20&before=2025-10-22T10:00:00Z
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      matchId: string,
      senderId: string,
      receiverId: string,
      text: string,
      timestamp: string,              // ISO 8601
      isRead: boolean,
      messageType: "text" | "image" | "emoji"
    },
    // ... more messages (newest first)
  ]
}
```

**Notes:**
- Messages tự động được mark as read khi fetch
- Sorted by timestamp descending (newest first)
- Use pagination với `before` parameter để load more

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');
const matchId = route.params.matchId;

const response = await fetch(
  `http://YOUR_IP:5000/api/messages/matches/${matchId}/messages?limit=50`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const data = await response.json();

if (data.success) {
  setMessages(data.data.reverse()); // Reverse để oldest first
}
```

**Load More (Pagination):**
```typescript
const loadMoreMessages = async () => {
  const oldestMessage = messages[0];
  const beforeTimestamp = oldestMessage.timestamp;

  const response = await fetch(
    `http://YOUR_IP:5000/api/messages/matches/${matchId}/messages?limit=20&before=${beforeTimestamp}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();
  
  if (data.success && data.data.length > 0) {
    setMessages(prev => [...data.data.reverse(), ...prev]);
  }
};
```

---

### 4.3. Send Message

**Gửi tin nhắn**

```http
POST /api/messages/matches/:matchId/messages
```

**Parameters:**
- `matchId` (string) - Match ID

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  text: string,                                    // Required
  messageType?: "text" | "image" | "emoji"        // Optional, default: "text"
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: {
    id: string,
    matchId: string,
    senderId: string,
    receiverId: string,
    text: string,
    timestamp: string,      // ISO 8601
    isRead: false,
    messageType: string
  },
  message: "Message sent successfully"
}
```

**Error Response:**
```json
// 404 - Match not found or inactive
{
  "success": false,
  "message": "Match not found or inactive"
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');
const matchId = route.params.matchId;
const [messageText, setMessageText] = useState('');

const sendMessage = async () => {
  if (!messageText.trim()) return;

  const response = await fetch(
    `http://YOUR_IP:5000/api/messages/matches/${matchId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: messageText,
        messageType: 'text'
      })
    }
  );

  const data = await response.json();

  if (data.success) {
    // Add to message list
    setMessages(prev => [...prev, data.data]);
    setMessageText('');
    // Scroll to bottom
    flatListRef.current?.scrollToEnd();
  } else {
    Alert.alert('Error', data.message);
  }
};
```

---

### 4.4. Mark Messages as Read

**Đánh dấu tất cả messages là đã đọc**

```http
PUT /api/messages/matches/:matchId/messages/read
```

**Parameters:**
- `matchId` (string) - Match ID

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Messages marked as read"
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');
const matchId = route.params.matchId;

// Call when user opens chat screen
useEffect(() => {
  const markAsRead = async () => {
    await fetch(
      `http://YOUR_IP:5000/api/messages/matches/${matchId}/messages/read`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  };

  markAsRead();
}, [matchId]);
```

---

## 🔔 5. NOTIFICATIONS

### 5.1. Get Notifications

**Lấy danh sách notifications**

```http
GET /api/notifications
```

**Query Parameters:**
- `limit` (number, optional) - Default: 50
- `unreadOnly` (boolean, optional) - Default: false

**Example URLs:**
```
/api/notifications
/api/notifications?limit=20
/api/notifications?unreadOnly=true
/api/notifications?limit=20&unreadOnly=true
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: [
    {
      id: string,
      userId: string,
      type: "match" | "message" | "like" | "super_like",
      title: string,
      message: string,
      data: any,              // Extra data (matchId, userId, etc.)
      isRead: boolean,
      timestamp: string       // ISO 8601
    },
    // ... more notifications
  ]
}
```

**Notification Types:**

| Type | Title | Message | Data |
|------|-------|---------|------|
| `match` | "It's a Match!" | "You and {name} liked each other" | `{ matchId, userId }` |
| `message` | "New Message" | "{name} sent you a message" | `{ matchId, messageId, senderId }` |
| `like` | "New Like" | "{name} likes you!" | `{ userId }` |
| `super_like` | "Super Like!" | "{name} super liked you!" | `{ userId }` |

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

const response = await fetch(
  'http://YOUR_IP:5000/api/notifications?limit=50',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const data = await response.json();

if (data.success) {
  setNotifications(data.data);
  
  // Handle notification tap
  const handleNotificationTap = (notification) => {
    if (notification.type === 'match' || notification.type === 'message') {
      navigation.navigate('Chat', { matchId: notification.data.matchId });
    } else if (notification.type === 'like' || notification.type === 'super_like') {
      navigation.navigate('UserProfile', { userId: notification.data.userId });
    }
    
    // Mark as read
    markNotificationAsRead(notification.id);
  };
}
```

---

### 5.2. Get Unread Count

**Lấy số lượng notifications chưa đọc**

```http
GET /api/notifications/unread/count
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  data: {
    count: number
  }
}
```

**Frontend Usage:**
```typescript
const token = await AsyncStorage.getItem('authToken');

// Poll mỗi 10 giây
useEffect(() => {
  const fetchUnreadCount = async () => {
    const response = await fetch(
      'http://YOUR_IP:5000/api/notifications/unread/count',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    
    if (data.success) {
      setBadgeCount(data.data.count);
    }
  };

  fetchUnreadCount(); // Initial fetch
  
  const interval = setInterval(fetchUnreadCount, 10000); // Every 10s

  return () => clearInterval(interval);
}, []);
```

---

### 5.3. Mark Notification as Read

**Đánh dấu 1 notification đã đọc**

```http
PUT /api/notifications/:notificationId/read
```

**Parameters:**
- `notificationId` (string) - Notification ID

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Notification marked as read"
}
```

**Frontend Usage:**
```typescript
const markAsRead = async (notificationId) => {
  const token = await AsyncStorage.getItem('authToken');

  await fetch(
    `http://YOUR_IP:5000/api/notifications/${notificationId}/read`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  // Update local state
  setNotifications(prev =>
    prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
  );
};
```

---

### 5.4. Mark All as Read

**Đánh dấu tất cả notifications đã đọc**

```http
PUT /api/notifications/read-all
```

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "All notifications marked as read"
}
```

**Frontend Usage:**
```typescript
const markAllAsRead = async () => {
  const token = await AsyncStorage.getItem('authToken');

  const response = await fetch(
    'http://YOUR_IP:5000/api/notifications/read-all',
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (data.success) {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
    setBadgeCount(0);
  }
};
```

---

### 5.5. Delete Notification

**Xóa một notification**

```http
DELETE /api/notifications/:notificationId
```

**Parameters:**
- `notificationId` (string) - Notification ID

**Headers:**
```typescript
{
  'Authorization': 'Bearer YOUR_TOKEN'
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Notification deleted"
}
```

**Frontend Usage:**
```typescript
const deleteNotification = async (notificationId) => {
  const token = await AsyncStorage.getItem('authToken');

  const response = await fetch(
    `http://YOUR_IP:5000/api/notifications/${notificationId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  if (data.success) {
    setNotifications(prev =>
      prev.filter(n => n.id !== notificationId)
    );
  }
};
```

---

## ⚠️ 6. ERROR HANDLING

### Error Response Format

```typescript
{
  success: false,
  message: string  // Error description
}
```

### Common Errors

| Status | Error | Cause | Solution |
|--------|-------|-------|----------|
| 400 | Bad Request | Missing/invalid fields | Check request body |
| 401 | Unauthorized | Token invalid/expired | Redirect to login, clear token |
| 403 | Forbidden | Feature requires premium | Show upgrade prompt |
| 404 | Not Found | Resource doesn't exist | Show "Not found" message |
| 500 | Server Error | Internal error | Show "Try again later" |

### Frontend Error Handler

```typescript
// utils/error-handler.ts
export function handleApiError(error: any, navigation?: any) {
  if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
    // Token expired
    AsyncStorage.clear();
    navigation?.navigate('Login');
    return 'Your session has expired. Please login again.';
  } 
  
  if (error.message?.includes('403')) {
    return 'This feature requires a premium subscription.';
  } 
  
  if (error.message?.includes('404')) {
    return 'Not found';
  } 
  
  if (error.message?.includes('Network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'Something went wrong';
}
```

**Usage:**
```typescript
try {
  const result = await matchService.swipe(userId, 'like');
  // Handle success
} catch (error) {
  const errorMessage = handleApiError(error, navigation);
  Alert.alert('Error', errorMessage);
}
```

---

## 🧪 7. TESTING GUIDE

### 7.1. Test với cURL (PowerShell)

**Test Login:**
```powershell
curl -X POST http://192.168.1.31:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin"}'
```

**Test Get Profile:**
```powershell
$token = "YOUR_TOKEN_HERE"
curl http://192.168.1.31:5000/api/users/me `
  -H "Authorization: Bearer $token"
```

**Test Discover:**
```powershell
curl http://192.168.1.31:5000/api/matches/discover `
  -H "Authorization: Bearer $token"
```

**Test Swipe:**
```powershell
curl -X POST http://192.168.1.31:5000/api/matches/swipe `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"likedUserId":"670d123","likeType":"like"}'
```

### 7.2. Test Accounts

```
Username: admin     | Password: admin     | Type: Premium
Username: ava       | Password: password  | Type: Free
Username: joshua    | Password: password  | Type: Premium
```

### 7.3. Complete User Flow Test

```typescript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin' })
});
const { token } = await loginRes.json();

// 2. Get Profile
const profileRes = await fetch('/api/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const profile = await profileRes.json();

// 3. Get Users to Swipe
const discoverRes = await fetch('/api/matches/discover', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const users = await discoverRes.json();

// 4. Swipe Right
const swipeRes = await fetch('/api/matches/swipe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    likedUserId: users.data[0].id,
    likeType: 'like'
  })
});
const swipeResult = await swipeRes.json();

if (swipeResult.data.isMatch) {
  console.log('🎉 MATCH!');
  
  // 5. Get Matches
  const matchesRes = await fetch('/api/matches/matches', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const matches = await matchesRes.json();
  
  // 6. Send Message
  const messageRes = await fetch(
    `/api/messages/matches/${swipeResult.data.matchId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: 'Hi! 👋' })
    }
  );
  
  // 7. Get Conversations
  const convoRes = await fetch('/api/messages/conversations', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  console.log('✅ Full flow completed!');
}
```

---

## 📋 Quick Reference

### API Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/login` | Login | ❌ |
| `POST` | `/api/auth/register` | Register | ❌ |
| `GET` | `/api/users/me` | Get current user | ✅ |
| `GET` | `/api/users/:userId` | Get user by ID | ✅ |
| `PUT` | `/api/users/profile` | Update profile | ✅ |
| `PUT` | `/api/users/preferences` | Update preferences | ✅ |
| `PUT` | `/api/users/subscription` | Update subscription | ✅ |
| `GET` | `/api/matches/discover` | Get users to swipe | ✅ |
| `POST` | `/api/matches/swipe` | Swipe (like/pass) | ✅ |
| `GET` | `/api/matches/matches` | Get matches | ✅ |
| `DELETE` | `/api/matches/matches/:id` | Unmatch | ✅ |
| `GET` | `/api/messages/conversations` | Get conversations | ✅ |
| `GET` | `/api/messages/matches/:id/messages` | Get messages | ✅ |
| `POST` | `/api/messages/matches/:id/messages` | Send message | ✅ |
| `PUT` | `/api/messages/matches/:id/messages/read` | Mark as read | ✅ |
| `GET` | `/api/notifications` | Get notifications | ✅ |
| `GET` | `/api/notifications/unread/count` | Get unread count | ✅ |
| `PUT` | `/api/notifications/:id/read` | Mark as read | ✅ |
| `PUT` | `/api/notifications/read-all` | Mark all as read | ✅ |
| `DELETE` | `/api/notifications/:id` | Delete notification | ✅ |

### Date/Time Format

- All timestamps: **ISO 8601** format
- Example: `"2025-10-22T10:30:00.000Z"`
- JavaScript: `new Date(timestamp)`

### Token Management

- Token expires: **30 days**
- Store in: **AsyncStorage** or **SecureStore**
- Include in header: `Authorization: Bearer TOKEN`
- Handle 401: Clear token, redirect to login

---

## 🎯 Integration Checklist

- [ ] Copy [`api-types.ts`](api-types.ts ) to frontend
- [ ] Create API client service
- [ ] Implement auth service (login/register)
- [ ] Implement user service (profile/preferences)
- [ ] Implement match service (discover/swipe/matches)
- [ ] Implement message service (conversations/send)
- [ ] Implement notification service (get/read)
- [ ] Create custom hooks (useAuth, useNotifications)
- [ ] Implement error handling
- [ ] Test all flows end-to-end
- [ ] Handle offline scenarios
- [ ] Implement token refresh logic

---

## 💡 Best Practices

1. **Always handle errors gracefully**
2. **Show loading states for API calls**
3. **Cache data when appropriate**
4. **Implement retry logic for failed requests**
5. **Use TypeScript for type safety**
6. **Poll notifications every 10-15 seconds**
7. **Mark messages as read when viewing chat**
8. **Store tokens securely**
9. **Clear sensitive data on logout**
10. **Test on slow network connections**

---

## 📞 Support

- **API Contract:** [`API_CONTRACT.md`](API_CONTRACT.md )
- **Frontend Guide:** [`FRONTEND_GUIDE.md`](FRONTEND_GUIDE.md )
- **TypeScript Types:** [`api-types.ts`](api-types.ts )
- **Postman Collection:** `HeartSync_API.postman_collection.json`

---

**Happy Coding! 🚀**

*Last updated: October 22, 2025*
