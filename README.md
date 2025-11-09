# 💕 HeartSync - Dating App

## 📋 THÔNG TIN DỰ ÁN

### MÔN HỌC: LẬP TRÌNH THIẾT BỊ DI ĐỘNG

**Đề tài**: DATING APP 

**Lớp học phần**: DHKTPM18B  
**Nhóm**: 21  
**GVHD**: Nguyễn Minh Hải

### 👥 THÀNH VIÊN NHÓM

| STT | HỌ VÀ TÊN | MSSV | NHIỆM VỤ |
|-----|-----------|------|----------|
| 1 | Dương Nhật Anh | 22728821 | Frontend Developer |
| 2 | Nguyễn Thanh Bình (NT) | 22660171 | Backend Developer |

---

## 🎯 GIỚI THIỆU DỰ ÁN

**HeartSync** là ứng dụng hẹn hò (dating app) hiện đại được phát triển trên nền tảng di động, cho phép người dùng kết nối và tìm kiếm mối quan hệ thông qua hệ thống swipe thông minh. Ứng dụng cung cấp trải nghiệm người dùng mượt mà với giao diện thân thiện và các tính năng tương tác phong phú.

### ✨ Tính Năng Chính

#### 1. **Authentication & User Management**
- 🔐 Đăng nhập/Đăng ký với Email/Password
- 📱 Đăng nhập bằng số điện thoại
- 👤 Tạo và quản lý hồ sơ cá nhân
- 📸 Upload và quản lý ảnh đại diện

#### 2. **Discover & Matching**
- 🃏 Swipe-based discovery (vuốt trái/phải để lựa chọn)
- 💚 Like, Pass, Super Like
- 🎉 Thông báo match với animation đẹp mắt
- 🔄 Tải thêm profiles tự động

#### 3. **Messaging & Communication**
- 💬 Chat real-time với người match
- 📋 Danh sách tất cả conversations
- 🟢 Hiển thị trạng thái online/offline
- 🔔 Thông báo tin nhắn chưa đọc

#### 4. **Video Calling**
- 📹 Giao diện video call đầy đủ
- 🎤 Tắt/bật micro và camera
- 🔄 Chuyển đổi camera trước/sau
- ⏱️ Hiển thị thời gian cuộc gọi

#### 5. **Advanced Features**
- 🎛️ Bộ lọc tìm kiếm nâng cao (tuổi, khoảng cách, sở thích)
- 👁️ Xem profile chi tiết
- 📊 Quản lý preferences
- 🔔 Push notifications

### 🛠️ Công Nghệ Sử Dụng

#### **Frontend**
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Router Native
- **UI Components**: React Native Elements, Expo Vector Icons
- **Animations**: React Native Animated API
- **State Management**: React Context API
- **API Client**: Axios
- **Storage**: AsyncStorage

#### **Backend**
- **Framework**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Real-time**: Socket.io (planned)
- **Image Storage**: Cloudinary (planned)

### 📱 Platforms Supported
- ✅ iOS
- ✅ Android
- ✅ Web (React Native Web)

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js**: Version 18.x hoặc cao hơn ([Download](https://nodejs.org/))
- **npm** hoặc **yarn**: Package manager
- **Expo CLI**: `npm install -g expo-cli`
- **Git**: Version control

#### Cho iOS Development (chỉ trên macOS):
- **Xcode**: Latest version
- **iOS Simulator**: Đi kèm với Xcode

#### Cho Android Development:
- **Android Studio**: Latest version
- **Android SDK**: API Level 31 hoặc cao hơn
- **Android Emulator**: Hoặc thiết bị Android thật

---

### 📦 Bước 1: Clone Repository

```bash
# Clone project từ GitHub
git clone https://github.com/thanhbinh21/heartsync-react-native.git

# Di chuyển vào thư mục frontend
cd heartsync-react-native/frontend
```

---

### 🔧 Bước 2: Cài Đặt Dependencies

```bash
# Cài đặt tất cả packages cần thiết
npm install

# Hoặc nếu dùng yarn
yarn install
```

**Lưu ý**: Quá trình cài đặt có thể mất 5-10 phút tùy vào tốc độ mạng.

---

### ⚙️ Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục frontend:

```bash
# Copy file .env.example
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin backend:

```env
# API Configuration
API_BASE_URL=http://192.168.1.31:5000/api

# For iOS Simulator (on Mac)
# API_BASE_URL=http://localhost:5000/api

# For Android Emulator
# API_BASE_URL=http://10.0.2.2:5000/api
```

**Lưu ý về địa chỉ IP**:
- **Physical Device**: Dùng địa chỉ IP của máy (ví dụ: `192.168.1.31`)
- **iOS Simulator**: Dùng `localhost` hoặc `127.0.0.1`
- **Android Emulator**: Dùng `10.0.2.2` (địa chỉ đặc biệt cho localhost)
- **Web**: Dùng `localhost`

Để biết địa chỉ IP của máy:
- **Windows**: `ipconfig` trong Command Prompt
- **Mac/Linux**: `ifconfig` hoặc `ip addr` trong Terminal

---

### 🎬 Bước 4: Khởi Động Backend Server

Trước khi chạy frontend, cần khởi động backend server:

```bash
# Di chuyển đến thư mục backend (nếu có)
cd ../backend

# Cài đặt dependencies
npm install

# Khởi động server
npm start

# Server sẽ chạy tại http://localhost:5000
```

Xem thêm hướng dẫn chi tiết trong file `BACKEND.md`

---

### 📱 Bước 5: Chạy Ứng Dụng

Quay lại thư mục frontend và khởi động app:

```bash
# Di chuyển về thư mục frontend
cd ../frontend

# Khởi động Expo development server
npm start

# Hoặc
expo start
```

Expo DevTools sẽ mở trong browser với các options:

#### **Option 1: Chạy trên Physical Device (Khuyến nghị)**

1. Cài đặt **Expo Go** từ App Store (iOS) hoặc Google Play (Android)
2. Mở Expo Go app
3. Scan QR code từ terminal hoặc Expo DevTools
4. App sẽ load trên thiết bị của bạn

**Lưu ý**: Đảm bảo điện thoại và máy tính cùng mạng WiFi!

#### **Option 2: Chạy trên iOS Simulator (chỉ macOS)**

```bash
# Khởi động iOS Simulator
npm run ios

# Hoặc chỉ định device cụ thể
expo run:ios --device "iPhone 15"
```

#### **Option 3: Chạy trên Android Emulator**

```bash
# Khởi động Android Emulator (mở Android Studio → AVD Manager trước)
npm run android

# Hoặc
expo run:android
```

#### **Option 4: Chạy trên Web Browser**

```bash
# Khởi động web version
npm run web

# App sẽ mở tại http://localhost:19006
```

---

### 🔥 Bước 6: Hot Reload & Development

Sau khi app chạy thành công:

- ✅ **Hot Reload**: Tự động reload khi save file
- ✅ **Dev Menu**: Shake thiết bị hoặc press `Cmd + D` (iOS) / `Cmd + M` (Android)
- ✅ **Debug**: Mở Chrome DevTools để debug JavaScript
- ✅ **Logs**: Xem logs trong terminal

---

## 🗂️ CẤU TRÚC DỰ ÁN

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BottomNavigation.tsx
│   │   ├── NotificationComponent.tsx
│   │   └── NotificationProvider.tsx
│   │
│   ├── screens/            # Các màn hình chính
│   │   ├── StartedScreen.tsx        # Màn hình welcome
│   │   ├── LoginScreen.tsx          # Đăng nhập
│   │   ├── PhoneLoginScreen.tsx     # Đăng nhập SĐT
│   │   ├── CreateProfileScreen.tsx  # Tạo profile
│   │   ├── SwipeScreen.tsx          # Màn hình swipe chính
│   │   ├── MatchFoundScreen.tsx     # Thông báo match
│   │   ├── MatchesScreen.tsx        # Danh sách matches
│   │   ├── ChatScreen.tsx           # Chat 1-1
│   │   ├── VideoCallScreen.tsx      # Video call
│   │   ├── ProfileViewScreen.tsx    # Xem profile
│   │   ├── FiltersScreen.tsx        # Filters
│   │   └── SubscriptionScreen.tsx   # Premium
│   │
│   ├── services/           # API Services
│   │   ├── api-client.ts           # Axios config
│   │   ├── auth.service.ts         # Authentication
│   │   ├── user.service.ts         # User API
│   │   ├── match.service.ts        # Match/Like/Pass
│   │   └── message.service.ts      # Messaging
│   │
│   ├── context/            # React Context
│   │   └── AuthContext.tsx         # Auth state
│   │
│   ├── router/             # Navigation
│   │   └── AppRouter.tsx           # Routes config
│   │
│   ├── types/              # TypeScript types
│   │   └── api.ts
│   │
│   ├── utils/              # Utilities
│   │   ├── animations.ts
│   │   └── error-handler.ts
│   │
│   └── constants/          # Constants
│       └── theme.ts
│
├── assets/                 # Images, fonts, etc.
├── dating_app_all_screens/ # UI Mockups (13 screens)
├── App.tsx                 # Root component
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎨 SCREENSHOTS

### Các Màn Hình Chính

1. **Started Screen**: Màn hình welcome với giới thiệu app
2. **Login Screen**: Đăng nhập với email/password
3. **Phone Login**: Đăng nhập với số điện thoại
4. **Create Profile**: Tạo và chỉnh sửa profile
5. **Swipe Screen**: Khám phá và swipe profiles
6. **Match Found**: Thông báo khi match thành công
7. **Matches List**: Danh sách tất cả matches
8. **Chat Screen**: Nhắn tin 1-1
9. **Video Call**: Gọi video với người match
10. **Profile View**: Xem chi tiết profile
11. **Filters**: Bộ lọc tìm kiếm
12. **Subscription**: Gói premium
13. **Settings**: Cài đặt app

Xem mockups đầy đủ trong thư mục `/dating_app_all_screens/`

---

## 🐛 TROUBLESHOOTING

### Vấn Đề Thường Gặp

#### 1. **Cannot connect to backend**
```
Error: Network Error / Failed to fetch
```
**Giải pháp**:
- Kiểm tra backend server đã chạy chưa
- Verify địa chỉ IP trong `.env`
- Kiểm tra firewall settings
- Đảm bảo thiết bị và máy tính cùng mạng

#### 2. **Module not found errors**
```
Error: Unable to resolve module...
```
**Giải pháp**:
```bash
# Xóa cache và node_modules
rm -rf node_modules
rm -rf .expo
npm cache clean --force

# Cài đặt lại
npm install

# Khởi động lại với clear cache
expo start -c
```

#### 3. **Images not loading**
```
Images từ Unsplash không hiển thị
```
**Giải pháp**:
- App đã chuyển sang dùng RandomUser.me API
- Nếu vẫn lỗi, check network connection
- Verify CORS settings

#### 4. **Build errors với Expo**
```
Build failed with unknown error
```
**Giải pháp**:
```bash
# Upgrade Expo CLI
npm install -g expo-cli@latest

# Clear watchman (macOS)
watchman watch-del-all

# Reset Metro bundler
expo start -c
```

#### 5. **Android Emulator không kết nối**
```
Cannot connect to Metro bundler
```
**Giải pháp**:
- Reverse port: `adb reverse tcp:19000 tcp:19000`
- Restart adb: `adb kill-server && adb start-server`
- Sử dụng địa chỉ IP thay vì localhost

---

## 📖 TÀI LIỆU THAM KHẢO

### Documentation Chi Tiết
- 📄 [FRONTEND.md](./FRONTEND.md) - Chi tiết về frontend architecture
- 📄 [BACKEND.md](../backend/BACKEND.md) - Chi tiết về backend API
- 📄 [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints documentation

### External Resources
- 📚 [React Native Docs](https://reactnative.dev/docs/getting-started)
- 📚 [Expo Documentation](https://docs.expo.dev/)
- 📚 [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- 📚 [React Router Native](https://reactrouter.com/native)

---

## 🧪 TESTING

### Chạy Tests (Planned)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🚢 DEPLOYMENT

### Build Production

#### Android APK
```bash
# Build APK cho testing
expo build:android -t apk

# Build AAB cho Google Play
expo build:android -t app-bundle
```

#### iOS IPA
```bash
# Build cho TestFlight
expo build:ios

# Simulator build
expo build:ios -t simulator
```

#### Web
```bash
# Build web version
expo build:web

# Output: web-build/
```

---

## 📝 CHANGELOG

### Version 1.0.0 (Current - November 2025)
- ✅ Hoàn thành UI cho 13 màn hình
- ✅ Authentication flow đầy đủ
- ✅ Swipe & Match functionality
- ✅ Chat interface
- ✅ Video call UI (mock)
- ✅ Profile management
- ✅ API integration với backend

### Upcoming Features (v1.1.0)
- 🔄 Real-time messaging với WebSocket
- 🔄 Real video calling với WebRTC
- 🔄 Push notifications
- 🔄 Advanced filters
- 🔄 Premium subscription features

---

## 🤝 CONTRIBUTING

Để contribute vào project:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 LICENSE

This project is licensed under the MIT License.

---

## 📞 CONTACT

### Team Members

**Dương Nhật Anh** - Frontend Developer  
MSSV: 22728821  
Email: [email]

**Nguyễn Thanh Bình (NT)** - Backend Developer  
MSSV: 22660171  
Email: [email]

### Project Links
- **GitHub Repository**: https://github.com/thanhbinh21/heartsync-react-native
- **Issues**: https://github.com/thanhbinh21/heartsync-react-native/issues

---

## 🙏 ACKNOWLEDGMENTS

- **GVHD**: ThS. Nguyễn Minh Hải
- **Trường**: Đại học FPT TP.HCM
- **Lớp**: DHKTPM18B
- **Môn học**: Lập Trình Thiết Bị Di Động

---

**Ngày cập nhật**: November 9, 2025  
**Version**: 1.0.0  
**Status**: ✅ Development Complete - Ready for Testing
