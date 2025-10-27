# HeartSync API Reference - Simple Version

**Base URL:** `http://localhost:5000/api` hoặc `http://192.168.1.31:5000/api`

**Authentication:** Không cần JWT token - API đã được đơn giản hóa

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)  
3. [Matching & Swiping](#matching--swiping)
4. [Messages](#messages)
5. [Notifications](#notifications)
6. [Error Handling](#error-handling)

---

## 🔐 Authentication

### 1. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "672123abc456def789",
    "username": "admin", 
    "profile": {
      "name": "Admin User",
      "age": 30,
      "photos": ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"],
      "aboutMe": "I am the administrator...",
      "occupation": "System Administrator",
      "gender": "Male",
      "pronouns": "He/Him/His",
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "zipCode": "94102"
      },
      "interests": ["Technology", "Hiking", "Photography"],
      "languages": ["English", "Spanish"]
    },
    "preferences": {
      "gender": ["Female", "Male"],
      "ageRange": { "min": 25, "max": 35 },
      "distance": 100,
      "languages": ["English"]
    },
    "subscription": "premium"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2. Register
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "name": "John Doe",
  "age": 25,
  "gender": "Male"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "user": {
    "id": "672123abc456def789",
    "username": "newuser",
    "profile": {
      "name": "John Doe",
      "age": 25,
      "gender": "Male",
      "photos": [],
      "interests": []
    }
  }
}
```

---

## 👤 User Management

### 3. Get User Profile by ID
**GET** `/api/users/me/{userId}`

**Example:** `GET /api/users/me/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "672123abc456def789",
    "username": "admin",
    "profile": {
      "name": "Admin User",
      "age": 30,
      "photos": ["https://example.com/photo.jpg"],
      "aboutMe": "Description here...",
      "occupation": "System Administrator",
      "gender": "Male",
      "location": {
        "city": "San Francisco",
        "state": "CA"
      },
      "interests": ["Technology", "Hiking"]
    },
    "preferences": {
      "gender": ["Female"],
      "ageRange": { "min": 25, "max": 35 },
      "distance": 50
    },
    "subscription": "premium",
    "verified": true
  }
}
```

### 4. Update User Profile
**PUT** `/api/users/profile/{userId}`

**Example:** `PUT /api/users/profile/672123abc456def789`

**Request Body:**
```json
{
  "profile": {
    "name": "Updated Name",
    "age": 26,
    "aboutMe": "New bio here",
    "occupation": "Software Engineer",
    "photos": ["https://newphoto.jpg"],
    "interests": ["Coding", "Travel", "Music"],
    "location": {
      "city": "New York",
      "state": "NY"
    }
  },
  "preferences": {
    "gender": ["Female"],
    "ageRange": { "min": 22, "max": 30 },
    "distance": 25
  }
}
```

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "672123abc456def789",
    "username": "admin",
    "profile": {
      "name": "Updated Name",
      "age": 26,
      "aboutMe": "New bio here",
      "occupation": "Software Engineer",
      "photos": ["https://newphoto.jpg"],
      "interests": ["Coding", "Travel", "Music"],
      "location": {
        "city": "New York",
        "state": "NY"
      }
    },
    "preferences": {
      "gender": ["Female"],
      "ageRange": { "min": 22, "max": 30 },
      "distance": 25
    }
  }
}
```

### 5. Get Any User by ID
**GET** `/api/users/{userId}`

**Example:** `GET /api/users/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "user": {
    "id": "672123abc456def789",
    "username": "ava",
    "profile": {
      "name": "Ava Jones",
      "age": 25,
      "photos": ["https://example.com/ava.jpg"],
      "aboutMe": "Love arts and music..."
    },
    "subscription": "free",
    "verified": true
  }
}
```

---

## 💕 Matching & Swiping

### 6. Discover Users to Swipe
**GET** `/api/matches/discover/{userId}`

**Example:** `GET /api/matches/discover/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "672456def789abc123",
      "name": "Ava Jones",
      "age": 25,
      "photos": ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
      "bio": "It would be wonderful to meet someone...",
      "location": "Las Vegas",
      "job": "Business Analyst at Tech",
      "education": "University of Nevada",
      "interests": ["Sci-fi movies", "Coffee", "Bowling"],
      "verified": true
    },
    {
      "id": "672789abc123def456",
      "name": "Joshua Edwards", 
      "age": 29,
      "photos": ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      "bio": "Software engineer who loves hiking...",
      "location": "Las Vegas",
      "job": "Software Engineer",
      "education": "MIT",
      "interests": ["Hiking", "Technology", "Cooking"],
      "verified": true
    }
  ]
}
```

### 7. Swipe Action (Like or Pass)
**POST** `/api/matches/swipe`

**Request Body:**
```json
{
  "userId": "672123abc456def789",
  "targetUserId": "672456def789abc123", 
  "action": "like"
}
```
*Hoặc `"action": "pass"` để bỏ qua*

**Response Success (200):**
```json
{
  "success": true,
  "isMatch": true,
  "matchId": "672999abc111def222"
}
```

**Nếu không match:**
```json
{
  "success": true,
  "isMatch": false,
  "matchId": null
}
```

### 8. Get User Matches
**GET** `/api/matches/{userId}`

**Example:** `GET /api/matches/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "matches": [
    {
      "id": "672999abc111def222",
      "matchedAt": "2025-10-25T10:30:00.000Z",
      "user": {
        "id": "672456def789abc123",
        "name": "Ava Jones",
        "age": 25,
        "photos": ["https://example.com/ava.jpg"],
        "bio": "Love arts and music..."
      }
    }
  ]
}
```

---

## 💬 Messages

### 9. Get Conversations for User
**GET** `/api/messages/conversations/{userId}`

**Example:** `GET /api/messages/conversations/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "conversations": [
    {
      "matchId": "672999abc111def222",
      "user": {
        "id": "672456def789abc123",
        "name": "Ava Jones",
        "photo": "https://example.com/ava.jpg"
      },
      "lastMessage": {
        "text": "Hey! How are you doing?",
        "timestamp": "2025-10-25T14:30:00.000Z",
        "senderId": "672456def789abc123"
      }
    }
  ]
}
```

### 10. Get Messages for a Match
**GET** `/api/messages/{matchId}`

**Example:** `GET /api/messages/672999abc111def222`

**Response Success (200):**
```json
{
  "success": true,
  "messages": [
    {
      "_id": "672111aaa222bbb333",
      "matchId": "672999abc111def222",
      "senderId": "672456def789abc123",
      "text": "Hey! How are you doing?",
      "timestamp": "2025-10-25T14:30:00.000Z"
    },
    {
      "_id": "672222bbb333ccc444", 
      "matchId": "672999abc111def222",
      "senderId": "672123abc456def789",
      "text": "Hi! I'm doing great, thanks for asking!",
      "timestamp": "2025-10-25T14:32:00.000Z"
    }
  ]
}
```

### 11. Send Message
**POST** `/api/messages/send`

**Request Body:**
```json
{
  "matchId": "672999abc111def222",
  "senderId": "672123abc456def789",
  "text": "Hello! Nice to meet you 😊"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": {
    "_id": "672333ccc444ddd555",
    "matchId": "672999abc111def222",
    "senderId": "672123abc456def789", 
    "text": "Hello! Nice to meet you 😊",
    "timestamp": "2025-10-25T14:35:00.000Z"
  }
}
```

---

## 🔔 Notifications

### 12. Get User Notifications
**GET** `/api/notifications/{userId}`

**Example:** `GET /api/notifications/672123abc456def789`

**Response Success (200):**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "672444ddd555eee666",
      "userId": "672123abc456def789",
      "type": "match",
      "title": "New Match!",
      "message": "You matched with Ava Jones",
      "data": {
        "matchId": "672999abc111def222",
        "userId": "672456def789abc123"
      },
      "isRead": false,
      "createdAt": "2025-10-25T10:30:00.000Z"
    },
    {
      "_id": "672555eee666fff777",
      "userId": "672123abc456def789", 
      "type": "message",
      "title": "New Message",
      "message": "Ava sent you a message",
      "data": {
        "matchId": "672999abc111def222",
        "messageId": "672111aaa222bbb333"
      },
      "isRead": true,
      "createdAt": "2025-10-25T14:30:00.000Z"
    }
  ]
}
```

### 13. Mark Notification as Read
**PUT** `/api/notifications/{notificationId}/read`

**Example:** `PUT /api/notifications/672444ddd555eee666/read`

**Response Success (200):**
```json
{
  "success": true,
  "notification": {
    "_id": "672444ddd555eee666",
    "userId": "672123abc456def789",
    "type": "match",
    "title": "New Match!",
    "message": "You matched with Ava Jones",
    "isRead": true,
    "createdAt": "2025-10-25T10:30:00.000Z"
  }
}
```

### 14. Create Notification
**POST** `/api/notifications/create`

**Request Body:**
```json
{
  "userId": "672123abc456def789",
  "type": "match",
  "title": "New Match!",
  "message": "You matched with someone special",
  "data": {
    "matchId": "672999abc111def222"
  }
}
```

**Response Success (200):**
```json
{
  "success": true,
  "notification": {
    "_id": "672666fff777ggg888",
    "userId": "672123abc456def789",
    "type": "match", 
    "title": "New Match!",
    "message": "You matched with someone special",
    "data": {
      "matchId": "672999abc111def222"
    },
    "isRead": false,
    "createdAt": "2025-10-25T15:00:00.000Z"
  }
}
```

---

## ❌ Error Handling

Tất cả API endpoints sẽ trả về error format như sau:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Username and password required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Database connection failed"
}
```

---

## 📱 Frontend Usage Examples

### React Native/Expo Code Examples:

#### 1. Login Function:
```javascript
const login = async (username, password) => {
  try {
    const response = await fetch('http://192.168.1.31:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Lưu user data vào AsyncStorage hoặc state
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

#### 2. Get Discover Users:
```javascript
const getDiscoverUsers = async (userId) => {
  try {
    const response = await fetch(`http://192.168.1.31:5000/api/matches/discover/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.users;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Discover error:', error);
    return [];
  }
};
```

#### 3. Swipe Action:
```javascript
const swipeUser = async (userId, targetUserId, action) => {
  try {
    const response = await fetch('http://192.168.1.31:5000/api/matches/swipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        targetUserId,
        action // 'like' hoặc 'pass'
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Swipe error:', error);
    return { success: false };
  }
};
```

#### 4. Send Message:
```javascript
const sendMessage = async (matchId, senderId, text) => {
  try {
    const response = await fetch('http://192.168.1.31:5000/api/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId,
        senderId,
        text
      })
    });
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Send message error:', error);
    return null;
  }
};
```

---

## 🗂️ Sample Test Data

**Tài khoản test có sẵn:**
- Username: `admin`, Password: `admin`
- Username: `ava`, Password: `password` 
- Username: `joshua`, Password: `password`

**Test User IDs (sau khi login thành công):**
- Admin: Sẽ nhận được từ response login
- Ava: Sẽ nhận được từ response login
- Joshua: Sẽ nhận được từ response login

---

## 🔧 Important Notes

1. **Không cần Authentication Header** - API đã được đơn giản hóa
2. **User ID** được truyền qua URL params hoặc request body
3. **Passwords** được lưu dạng plain text (chỉ cho development)
4. **CORS** đã được enable cho tất cả origins
5. **MongoDB** connection string trong file `.env`
6. **Server** chạy trên port 5000

**Chạy server:**
```bash
npm start
# hoặc
node src/server.js
```

**Health Check:**
```
GET http://localhost:5000/api/test
```

Sẽ trả về:
```json
{
  "success": true,
  "message": "HeartSync API is running! 🚀",
  "version": "2.0.0",
  "timestamp": "2025-10-25T10:00:00.000Z"
}
```