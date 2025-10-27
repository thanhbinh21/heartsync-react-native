# HeartSync App - 13 Screens Redesign Plan

## Overview
Complete redesign of all 13 screens based on design mockups in `/dating_app_all_screens`

## Screen Status & Implementation Plan

### ✅ COMPLETED SCREENS

#### 1. LoginScreen.tsx (Screen 1: Login.png)
- **Status**: ✅ Core logic complete, needs UI polish
- **Features Implemented**:
  - Username/password login
  - Test login buttons (admin, ava, joshua)
  - Social login buttons (Apple, Facebook)
  - Navigation to CreateProfile or Swipe based on profile completion
- **TODO**:
  - [ ] Polish UI to match design exactly
  - [ ] Add better animations
  - [ ] Improve error handling UI

#### 2. StartedScreen.tsx (Screen 2: Getting Started.png)
- **Status**: ✅ Complete
- **Features**: Welcome screen with social login options

#### 3. SubscriptionScreen.tsx (Screen 3: Subscription Plans.png)
- **Status**: ✅ Complete with gradient cards
- **Features**: 
  - Three plans (Basic, Premium, VIP)
  - Feature comparison
  - Gradient cards with selection
  - Skip option

### 🚧 IN PROGRESS

#### 7. SwipeScreen.tsx (Screen 7: Swiping Right to Match.png)
- **Status**: 🚧 80% complete
- **Features Implemented**:
  - Card swiping with PanResponder
  - Like/Nope/Superlike animations
  - Real API integration
  - User info display with verified badge
  - Interests tags
  - Match modal (Screens 9-10)
- **Issues**:
  - ✅ Fixed: Login navigation blocking
  - ✅ Fixed: Auth service token parsing
- **TODO**:
  - [ ] Test match modal with real API
  - [ ] Polish animations
  - [ ] Add more user details

### 📋 TODO SCREENS

#### 4. CreateProfileScreen.tsx (Screen 4: Create My Profile.png)
- **Status**: ⏳ Needs implementation
- **Required Features**:
  - Multi-step profile creation wizard
  - Photo upload (multiple photos)
  - Basic info (name, age, gender, location)
  - Bio/About me
  - Interests selection
  - Preferences (age range, distance, etc.)
  - Preview before save
- **API Endpoints Needed**:
  - `PUT /api/users/profile` - Update profile
  - `POST /api/users/photos` - Upload photos
  - `GET /api/interests` - Get available interests

#### 5. ProfileViewScreen.tsx (Screen 5: View a Profile.png)
- **Status**: ⏳ Needs implementation
- **Required Features**:
  - Full screen profile view
  - Photo carousel/gallery
  - User details (age, location, bio, job, education)
  - Interests display
  - Verified badge
  - Action buttons (Like, Nope, Superlike)
  - Back button
  - Report/Block options
- **Used In**: 
  - SwipeScreen (info button)
  - MatchesScreen (tap on match)

#### 6. FiltersScreen.tsx (Screen 6: Filters for Profile.png)
- **Status**: ⏳ Needs implementation
- **Required Features**:
  - Distance slider
  - Age range slider
  - Gender preferences
  - Show me (gender selection)
  - Advanced filters (education, height, etc.)
  - Apply/Reset buttons
- **API Endpoints**:
  - `PUT /api/users/preferences` - Update preferences
  - `GET /api/users/preferences` - Get current preferences

#### 8. SwipeConfirmationScreen.tsx (Screen 8: Swipe-Right Confirmation.png)
- **Status**: ⏳ Needs implementation
- **Required Features**:
  - Confirmation animation
  - User photo/name
  - "It's a match!" or "Liked" message
  - Navigation options:
    - Keep swiping
    - Send message (if match)
    - View profile
- **Note**: May be replaced by Match Modal in SwipeScreen

#### 11. MatchesScreen.tsx (Screen 11: List of Matched Profiles.png)
- **Status**: ⏳ Needs complete redesign
- **Required Features**:
  - Grid/List of matched profiles
  - Profile photos
  - Name and age
  - Match date/time
  - Unread message indicator
  - Search/filter matches
  - Tap to open chat
- **API Endpoints**:
  - `GET /api/matches` - Get all matches
  - `GET /api/matches/:id` - Get match details

#### 12. ChatScreen.tsx (Screen 12: Inbox - Chat with a Matched Profile.png)
- **Status**: ⏳ Needs complete redesign
- **Required Features**:
  - Message list (reverse chronological)
  - Text input
  - Send button
  - Message timestamps
  - Read receipts
  - Typing indicator
  - Match profile header
  - Back button
  - Profile/Unmatch options
- **API Endpoints**:
  - `GET /api/messages/:matchId` - Get messages
  - `POST /api/messages` - Send message
  - `WebSocket` - Real-time messaging

#### 13. VideoCallScreen.tsx (Screen 13: Video Call with a Matched Profile.png)
- **Status**: ⏳ Needs implementation
- **Required Features**:
  - Video call UI
  - Local/remote video streams
  - Controls (mute, video off, end call)
  - User info overlay
  - Call duration timer
- **Technology**: 
  - WebRTC
  - Possibly Agora/Twilio SDK
- **Note**: Complex feature, may defer to later

---

## Implementation Priority

### Phase 1: Authentication & Core Flow ✅
1. ✅ LoginScreen - Working
2. ✅ Fix auth.service - Token parsing fixed
3. ✅ SwipeScreen - Basic functionality working

### Phase 2: Profile Management (CURRENT)
4. CreateProfileScreen - **NEXT**
5. ProfileViewScreen
6. FiltersScreen

### Phase 3: Matching & Social
7. Complete SwipeScreen polish
8. SwipeConfirmationScreen / Match Modal
9. MatchesScreen

### Phase 4: Communication
10. ChatScreen
11. VideoCallScreen (Optional/Advanced)

---

## Technical Debt & Issues

### Fixed Issues ✅
- ✅ Login navigation not working → Fixed with setTimeout wrapper
- ✅ Auth service token parsing → Fixed with proper type casting
- ✅ SwipeScreen user info display → Added verified badge, interests

### Current Issues 🐛
- [ ] Login still has force navigation to Swipe (remove after testing)
- [ ] Need to test match modal with real backend
- [ ] Missing proper error handling UI
- [ ] No loading states for async operations

### Architecture Improvements Needed
- [ ] Add global state management (Redux/Zustand)
- [ ] Implement proper offline support
- [ ] Add image caching
- [ ] Implement WebSocket for real-time features
- [ ] Add push notifications
- [ ] Add analytics tracking

---

## API Integration Status

### Completed ✅
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/discover` - Get swipe candidates
- `POST /api/swipe` - Record swipe action

### Pending ⏳
- `PUT /api/users/profile` - Update profile
- `POST /api/users/photos` - Upload photos
- `GET /api/matches` - Get matches
- `GET /api/messages/:matchId` - Get messages
- `POST /api/messages` - Send message
- `PUT /api/users/preferences` - Update preferences

---

## Next Steps

1. **Fix Current Login Issue**
   - Remove force navigation code
   - Test profile completion check
   - Ensure smooth navigation flow

2. **Implement CreateProfileScreen**
   - Multi-step wizard UI
   - Photo upload functionality
   - API integration
   - Form validation

3. **Implement ProfileViewScreen**
   - Full profile display
   - Photo carousel
   - Action buttons

4. **Polish SwipeScreen**
   - Test match modal
   - Improve animations
   - Add loading states

5. **Implement MatchesScreen**
   - Grid/List view
   - API integration
   - Navigation to ChatScreen

6. **Implement ChatScreen**
   - Message UI
   - Real-time updates
   - API integration

---

## Design Assets Location
All design mockups are in: `/dating_app_all_screens/`
- 1.Login.png
- 2.Getting Started.png
- 3.Subscription Plans.png
- 4.Create My Profile.png
- 5.View a Profile.png
- 6.Filters for Profile.png
- 7.Swiping Right to Match.png
- 8.Swipe-Right Confirmation.png
- 9.New Matched Profile Notification 1.png
- 10.New Matched Profile Notification 2.png
- 11.List of Matched Profiles.png
- 12.Inbox - Chat with a Matched Profile.png
- 13.Video Call with a Matched Profile.png
