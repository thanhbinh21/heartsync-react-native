# HeartSync 💖

**Where Hearts Connect, Love Finds Its Sync**

A modern React Native dating app with smooth animations, real-time matching, and premium features. Built with TypeScript and Expo for both iOS and Android platforms.

## 🌟 Features

### Core Functionality
- **Smart Swiping System** - Swipe right to like, left to pass, up to super like
- **Real-time Matching** - Instant notifications when you match with someone
- **In-app Messaging** - Chat with your matches in real-time
- **Video Calling** - Connect face-to-face with your matches
- **Advanced Filters** - Filter by age, distance, interests, lifestyle, and more
- **Profile Creation** - Rich profiles with photos, interests, and lifestyle info

### Premium Features
- **See Who Likes You** - Know who's interested before you swipe
- **Unlimited Likes** - No daily limits on likes
- **Super Likes** - Stand out with super likes for 3x more matches
- **Boosts** - Be the top profile in your area
- **Advanced Filters** - Filter by education, lifestyle preferences
- **Read Receipts** - See when your messages are read

### User Experience
- **Smooth Animations** - Powered by [`AnimationUtils`](src/utils/animations.ts) class
- **Responsive Design** - Optimized for all screen sizes
- **Intuitive Navigation** - Easy-to-use interface with stack navigation
- **Offline Support** - Core features work offline

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd heartsync-app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📱 App Structure

```
src/
├── screens/           # App screens
│   ├── StartedScreen.tsx      # Onboarding screen
│   ├── LoginScreen.tsx        # Authentication
│   ├── CreateProfileScreen.tsx # Profile setup
│   ├── SwipeScreen.tsx        # Main swiping interface
│   ├── MatchesScreen.tsx      # Matches and messages
│   ├── ChatScreen.tsx         # Individual chat
│   ├── VideoCallScreen.tsx    # Video calling
│   ├── FiltersScreen.tsx      # Search filters
│   └── SubscriptionScreen.tsx # Premium plans
├── services/          # API and business logic
│   ├── userService.ts         # User management
│   ├── matchService.ts        # Matching logic
│   ├── messageService.ts      # Messaging
│   ├── likeService.ts         # Likes and super likes
│   └── types.ts              # TypeScript interfaces
├── utils/
│   └── animations.ts          # Animation utilities
└── components/        # Reusable components
```

## 🎨 Key Technologies

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **Expo** - Development platform and build tools
- **React Navigation** - Navigation between screens
- **Animated API** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling (via [tailwind.config.js](tailwind.config.js))

## 🔧 Configuration

### Environment Setup
Create a [`.env`](.env) file in the root directory:
```
API_BASE_URL=http://your-backend-url:3001
```

### Build Configuration
The app uses [Expo configuration](app.json) for build settings and [TypeScript configuration](tsconfig.json) for type checking.

## 📋 Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint
```

## 🏗️ Architecture

### Services Layer
The app uses a service-oriented architecture with dedicated services:

- **[`UserService`](src/services/userService.ts)** - User profile management and potential matches
- **[`LikeService`](src/services/likeService.ts)** - Handling likes, super likes, and passes
- **[`MatchService`](src/services/matchService.ts)** - Match creation and management
- **[`MessageService`](src/services/messageService.ts)** - Real-time messaging functionality

### Animation System
Custom animation utilities in [`AnimationUtils`](src/utils/animations.ts):
- Card swiping animations
- Match celebration effects
- Smooth transitions
- Typing indicators
- Pulse and heart beat effects

### Navigation Flow
```
StartedScreen → LoginScreen → CreateProfileScreen → SwipeScreen
                                                       ↓
MatchesScreen ← ChatScreen ← SwipeConfirmationScreen
     ↓
VideoCallScreen
```

## 🎯 Key Features Implementation

### Swiping Mechanism
The [`SwipeScreen`](src/screens/SwipeScreen.tsx) implements:
- Pan gesture recognition
- Animated card movements
- Like/pass logic with visual feedback
- Integration with [`LikeService`](src/services/likeService.ts)

### Real-time Matching
When users like each other:
1. [`LikeService.sendLike()`](src/services/likeService.ts) processes the action
2. [`MatchService.createMatch()`](src/services/matchService.ts) creates a match if mutual
3. [`SwipeConfirmationScreen`](src/screens/SwipeConfirmationScreen.tsx) shows celebration
4. Users can immediately start chatting

### Premium Features
[`SubscriptionScreen`](src/screens/SubscriptionScreen.tsx) offers three tiers:
- **HeartSync Plus** - Basic premium features
- **HeartSync Gold** - Advanced matching tools  
- **HeartSync Platinum** - Full premium experience

## 🔒 Privacy & Security

- Secure user authentication
- Private messaging encryption
- Location data protection
- Photo verification system
- User reporting and blocking

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment
1. Configure [app.json](app.json) with store metadata
2. Build production bundle
3. Submit to App Store / Google Play

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Video calling requires additional WebRTC setup for production
- Push notifications need Firebase configuration
- Real-time messaging requires WebSocket server

## 📞 Support

For support and questions:
- Create an issue in this repository
- Email: support@heartsync.app

---

**Made with ❤️ for connecting hearts worldwide**