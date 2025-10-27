# HeartSync App - Complete 13 Screens Implementation with React Router

## Technology Stack
- **Navigation**: `react-router-native` (NOT @react-navigation/stack)
- **Routing**: File-based routing with `<Routes>` and `<Route>`
- **State Management**: Context API (AuthContext)
- **Styling**: React Native StyleSheet + theme constants

## Routing Structure

### Current Router Setup
Location: `/src/router/AppRouter.tsx`

```typescript
<NativeRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/started" element={<StartedScreen />} />
    
    {/* Auth Routes (redirect if logged in) */}
    <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
    <Route path="/phone-login" element={<AuthRoute><PhoneLoginScreen /></AuthRoute>} />
    <Route path="/register" element={<AuthRoute><RegisterScreen /></AuthRoute>} />
    
    {/* Protected Routes (require auth) */}
    <Route path="/swipe" element={<ProtectedRoute><SwipeScreen /></ProtectedRoute>} />
    <Route path="/create-profile" element={<ProtectedRoute><CreateProfileScreen /></ProtectedRoute>} />
    <Route path="/profile-view/:userId" element={<ProtectedRoute><ProfileViewScreen /></ProtectedRoute>} />
    <Route path="/filters" element={<ProtectedRoute><FiltersScreen /></ProtectedRoute>} />
    <Route path="/matches" element={<ProtectedRoute><MatchesScreen /></ProtectedRoute>} />
    <Route path="/chat/:matchId" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
    <Route path="/video-call/:matchId" element={<ProtectedRoute><VideoCallScreen /></ProtectedRoute>} />
    <Route path="/subscription" element={<ProtectedRoute><SubscriptionScreen /></ProtectedRoute>} />
    
    {/* Default redirect */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
</NativeRouter>
```

---

## 13 Screens Implementation Plan

### ✅ COMPLETED SCREENS

#### 1. LoginScreen.tsx ✅
- **Route**: `/login`
- **Design**: `1.Login.png`
- **Status**: Complete with social login buttons
- **Navigation**: 
  - Apple/Facebook login → TBD
  - Phone number → `/phone-login`

#### 2. PhoneLoginScreen.tsx ✅ (NEW)
- **Route**: `/phone-login`
- **Design**: Custom (username/password input)
- **Status**: Just created
- **Features**:
  - Username + Password input
  - Test account buttons (admin, ava, joshua)
  - Form validation
  - Loading state
  - Navigate to `/create-profile` or `/swipe` based on profile completion
- **Navigation**:
  - Back → `/login`
  - Success → `/create-profile` or `/swipe`
  - Sign Up link → `/register`

#### 3. StartedScreen.tsx ✅
- **Route**: `/started`
- **Design**: `2.Getting Started.png`
- **Status**: Complete
- **Navigation**: All buttons → `/login`

#### 4. SubscriptionScreen.tsx ✅
- **Route**: `/subscription`
- **Design**: `3.Subscription Plans.png`
- **Status**: Complete with gradient cards
- **Navigation**:
  - Skip/Subscribe → `/swipe`
  - Back → previous screen

---

### 🚧 IN PROGRESS

#### 5. SwipeScreen.tsx 🚧
- **Route**: `/swipe`
- **Design**: `7.Swiping Right to Match.png`
- **Status**: 80% complete
- **Navigation (using `useNavigate`)**:
  ```typescript
  const navigate = useNavigate();
  
  // View full profile
  navigate(`/profile-view/${user.id}`);
  
  // Open filters
  navigate('/filters');
  
  // View matches
  navigate('/matches');
  ```
- **TODO**:
  - [ ] Fix navigation to use router instead of stack
  - [ ] Test match modal
  - [ ] Polish UI

---

### 📋 TODO SCREENS (11 remaining)

#### 6. CreateProfileScreen.tsx ⏳
- **Route**: `/create-profile`
- **Design**: `4.Create My Profile.png`
- **Priority**: HIGH (needed for onboarding flow)
- **Features Required**:
  - Multi-step wizard (steps indicator)
  - Photo upload with preview
  - Form fields: name, DOB, gender, location
  - Bio/about me textarea
  - Interests multi-select chips
  - Job/education fields
  - Preview step
  - Progress save
- **Navigation**:
  ```typescript
  // Skip for now
  navigate('/swipe');
  
  // Complete profile
  // Save to API → navigate('/subscription'); // or '/swipe'
  ```
- **API Calls**:
  - `PUT /api/users/profile`
  - `POST /api/users/photos`
  - `GET /api/interests`

#### 7. ProfileViewScreen.tsx ⏳
- **Route**: `/profile-view/:userId`
- **Design**: `5.View a Profile.png`
- **Priority**: HIGH (used in swipe and matches)
- **Features Required**:
  - URL params: `const { userId } = useParams();`
  - Full-screen photo carousel
  - User details overlay
  - Swipe actions (Like, Nope, Superlike)
  - Back button
  - Report/Block button
- **Navigation**:
  ```typescript
  const { userId } = useParams<{ userId: string }>();
  
  // Back
  navigate(-1);
  
  // Like and continue
  navigate('/swipe');
  
  // Report user
  navigate(`/report/${userId}`);
  ```
- **API Calls**:
  - `GET /api/users/:userId`

#### 8. FiltersScreen.tsx ⏳
- **Route**: `/filters`
- **Design**: `6.Filters for Profile.png`
- **Priority**: MEDIUM
- **Features Required**:
  - Distance slider (1-100 km)
  - Age range slider (18-99)
  - Gender preferences checkboxes
  - Advanced filters accordion
  - Apply button
  - Reset button
- **Navigation**:
  ```typescript
  // Save and close
  // Save preferences → navigate(-1);
  
  // Cancel
  navigate(-1);
  ```
- **API Calls**:
  - `GET /api/users/preferences`
  - `PUT /api/users/preferences`

#### 9. SwipeConfirmationScreen.tsx ⏳
- **Route**: `/swipe-confirmation`
- **Design**: `8.Swipe-Right Confirmation.png`
- **Priority**: LOW (can use modal in SwipeScreen)
- **Features Required**:
  - Confirmation animation
  - User photo/name display
  - "Keep Swiping" button
  - "Send Message" button (if match)
- **Navigation**:
  ```typescript
  // Keep swiping
  navigate('/swipe');
  
  // Send message
  navigate(`/chat/${matchId}`);
  ```
- **Note**: May be replaced by Match Modal in SwipeScreen

#### 10. MatchesScreen.tsx ⏳
- **Route**: `/matches`
- **Design**: `11.List of Matched Profiles.png`
- **Priority**: HIGH (core feature)
- **Features Required**:
  - Grid/List of matches
  - Profile photos + names
  - Match date
  - Unread message badge
  - Search bar
  - Pull to refresh
  - Tap to open chat
- **Navigation**:
  ```typescript
  // Open chat
  navigate(`/chat/${matchId}`);
  
  // View profile
  navigate(`/profile-view/${userId}`);
  
  // Back to swipe
  navigate('/swipe');
  ```
- **API Calls**:
  - `GET /api/matches`
  - `GET /api/matches/:id`

#### 11. ChatScreen.tsx ⏳
- **Route**: `/chat/:matchId`
- **Design**: `12.Inbox - Chat with a Matched Profile.png`
- **Priority**: HIGH (core feature)
- **Features Required**:
  - URL params: `const { matchId } = useParams();`
  - Message list (FlatList, inverted)
  - Message bubbles (sent/received styling)
  - Text input + send button
  - Timestamps
  - Read receipts
  - Typing indicator
  - Header with profile photo
  - Back button
- **Navigation**:
  ```typescript
  const { matchId } = useParams<{ matchId: string }>();
  
  // Back
  navigate(-1);
  
  // View profile
  navigate(`/profile-view/${userId}`);
  
  // Video call
  navigate(`/video-call/${matchId}`);
  
  // Unmatch
  // Show confirmation → API call → navigate('/matches');
  ```
- **API Calls**:
  - `GET /api/messages/:matchId`
  - `POST /api/messages`
  - WebSocket for real-time

#### 12. VideoCallScreen.tsx ⏳
- **Route**: `/video-call/:matchId`
- **Design**: `13.Video Call with a Matched Profile.png`
- **Priority**: LOW (advanced feature)
- **Features Required**:
  - URL params: `const { matchId } = useParams();`
  - WebRTC video streams
  - Local/remote video
  - Control buttons (mute, video off, end call)
  - Call duration timer
  - User info overlay
- **Navigation**:
  ```typescript
  const { matchId } = useParams<{ matchId: string }>();
  
  // End call
  navigate(`/chat/${matchId}`);
  ```
- **Technology**: WebRTC, Agora, or Twilio SDK
- **Note**: Complex, defer to Phase 4

#### 13. RegisterScreen.tsx ⏳ (NEW - not in design)
- **Route**: `/register`
- **Priority**: MEDIUM
- **Features Required**:
  - Username input
  - Email input
  - Password input
  - Confirm password input
  - Terms checkbox
  - Register button
  - Back to login link
- **Navigation**:
  ```typescript
  // Success
  navigate('/create-profile');
  
  // Back to login
  navigate('/login');
  ```
- **API Calls**:
  - `POST /api/auth/register`

---

## Navigation Patterns with React Router

### Basic Navigation
```typescript
import { useNavigate } from 'react-router-native';

const navigate = useNavigate();

// Navigate forward
navigate('/swipe');

// Navigate with params
navigate(`/profile-view/${userId}`);

// Navigate back
navigate(-1);

// Replace (no history)
navigate('/login', { replace: true });

// Navigate with state
navigate('/chat', { state: { matchData } });
```

### Getting URL Params
```typescript
import { useParams } from 'react-router-native';

const { userId } = useParams<{ userId: string }>();
const { matchId } = useParams<{ matchId: string }>();
```

### Getting Location State
```typescript
import { useLocation } from 'react-router-native';

const location = useLocation();
const matchData = location.state?.matchData;
```

### Programmatic Redirect
```typescript
import { Navigate } from 'react-router-native';

// In component
if (condition) {
  return <Navigate to="/login" replace />;
}
```

---

## Implementation Order

### Phase 1: Core Authentication Flow ✅
1. ✅ LoginScreen
2. ✅ PhoneLoginScreen (NEW)
3. ✅ StartedScreen

### Phase 2: Profile & Onboarding (NEXT)
4. ⏳ CreateProfileScreen
5. ⏳ ProfileViewScreen
6. ⏳ FiltersScreen
7. ✅ SubscriptionScreen

### Phase 3: Core Matching Features
8. 🚧 SwipeScreen (fix navigation)
9. ⏳ MatchesScreen
10. ⏳ Match Modal (in SwipeScreen)

### Phase 4: Communication
11. ⏳ ChatScreen
12. ⏳ RegisterScreen

### Phase 5: Advanced Features (Optional)
13. ⏳ VideoCallScreen
14. ⏳ SwipeConfirmationScreen (if needed)

---

## File Structure

```
src/
├── router/
│   └── AppRouter.tsx              # Main router with all routes
├── screens/
│   ├── LoginScreen.tsx            # ✅ Screen 1
│   ├── PhoneLoginScreen.tsx       # ✅ NEW - Username/Password login
│   ├── StartedScreen.tsx          # ✅ Screen 2
│   ├── SubscriptionScreen.tsx     # ✅ Screen 3
│   ├── CreateProfileScreen.tsx    # ⏳ Screen 4 - TODO
│   ├── ProfileViewScreen.tsx      # ⏳ Screen 5 - TODO
│   ├── FiltersScreen.tsx          # ⏳ Screen 6 - TODO
│   ├── SwipeScreen.tsx            # 🚧 Screen 7 - IN PROGRESS
│   ├── SwipeConfirmationScreen.tsx # ⏳ Screen 8 - Optional
│   ├── MatchesScreen.tsx          # ⏳ Screen 11 - TODO
│   ├── ChatScreen.tsx             # ⏳ Screen 12 - TODO
│   ├── VideoCallScreen.tsx        # ⏳ Screen 13 - TODO
│   └── RegisterScreen.tsx         # ⏳ NEW - TODO
├── context/
│   └── AuthContext.tsx            # Auth state management
├── services/
│   ├── auth.service.ts            # ✅ Auth API
│   ├── user.service.ts            # User API
│   ├── match.service.ts           # Match API
│   └── message.service.ts         # Message API
└── constants/
    └── theme.ts                   # Design tokens
```

---

## Next Steps

### Immediate Tasks
1. **Test PhoneLoginScreen**
   - Verify username/password login works
   - Test navigation to CreateProfile/Swipe
   - Test test account buttons

2. **Update SwipeScreen Navigation**
   - Replace Stack navigation with `useNavigate`
   - Fix profile view navigation
   - Fix filters navigation
   - Fix matches navigation

3. **Implement CreateProfileScreen**
   - Multi-step wizard UI
   - Photo upload
   - Form validation
   - API integration

4. **Implement ProfileViewScreen**
   - Full profile display
   - Photo carousel
   - Action buttons
   - API integration

5. **Implement MatchesScreen**
   - Grid/List view
   - API integration
   - Navigation to ChatScreen

6. **Implement ChatScreen**
   - Message UI
   - Real-time updates
   - API integration

---

## Router Best Practices

### 1. Use Navigate Hook
```typescript
const navigate = useNavigate();
navigate('/path');
```

### 2. Use Params for Dynamic Routes
```typescript
// Route definition
<Route path="/profile/:userId" element={<ProfileView />} />

// In component
const { userId } = useParams();
```

### 3. Pass State via Navigation
```typescript
// Sender
navigate('/chat', { state: { matchData } });

// Receiver
const location = useLocation();
const matchData = location.state?.matchData;
```

### 4. Protected Routes Pattern
```typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

### 5. Avoid Stack Navigation Syntax
❌ Don't use: `navigation.navigate()`, `navigation.push()`, `navigation.goBack()`
✅ Use: `navigate('/path')`, `navigate(-1)`

---

## Summary

**Current Status:**
- ✅ 4 screens complete (Login, PhoneLogin, Started, Subscription)
- 🚧 1 screen in progress (SwipeScreen - needs navigation fix)
- ⏳ 8 screens to implement

**Priority Order:**
1. Test PhoneLoginScreen login flow
2. Fix SwipeScreen navigation
3. Implement CreateProfileScreen
4. Implement ProfileViewScreen
5. Implement MatchesScreen
6. Implement ChatScreen
7. Implement RegisterScreen
8. Implement FiltersScreen
9. Implement VideoCallScreen (optional)

**Estimated Time:**
- Phase 2 (Profile): 2-3 days
- Phase 3 (Matching): 2 days
- Phase 4 (Communication): 2-3 days
- **Total**: ~1 week for all core features
