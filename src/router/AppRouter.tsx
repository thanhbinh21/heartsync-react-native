import React from 'react';
import { NativeRouter, Route, Routes, Navigate } from 'react-router-native';
import { useAuthContext } from '../context/AuthContext';

// Import screens
import StartedScreen from '../screens/StartedScreen';
import LoginScreen from '../screens/LoginScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import SwipeScreen from '../screens/SwipeScreen';
import SwipeConfirmationScreen from '../screens/SwipeConfirmationScreen';
import MatchFoundScreen from '../screens/MatchFoundScreen';
import ProfileViewScreen from '../screens/ProfileViewScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ChatScreen from '../screens/ChatScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import FiltersScreen from '../screens/FiltersScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import BookmarkScreen from '../screens/BookmarkScreen';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Auth Route wrapper (redirect to swipe if already authenticated)
const AuthRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  console.log('🔍 AuthRoute - Auth state:', { isAuthenticated, isLoading });

  if (isLoading) {
    console.log('🔍 AuthRoute - Still loading, showing null');
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    console.log('🔍 AuthRoute - Not authenticated, showing children');
    return children;
  } else {
    console.log('🔍 AuthRoute - Already authenticated, redirecting to /swipe');
    return <Navigate to="/swipe" replace />;
  }
};

export default function AppRouter() {
  return (
    <NativeRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/started" element={<StartedScreen />} />
        
        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginScreen />
            </AuthRoute>
          } 
        />
        <Route 
          path="/phone-login" 
          element={
            <AuthRoute>
              <PhoneLoginScreen />
            </AuthRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/swipe" 
          element={
            <ProtectedRoute>
              <SwipeScreen />
            </ProtectedRoute>
          } 
        />
     
        <Route 
          path="/create-profile" 
          element={
            <ProtectedRoute>
              <CreateProfileScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/swipe-confirmation" 
          element={
            <ProtectedRoute>
              <SwipeConfirmationScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/match-found" 
          element={
            <ProtectedRoute>
              <MatchFoundScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile-view/:userId" 
          element={
            <ProtectedRoute>
              <ProfileViewScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-detail/:userId" 
          element={
            <ProtectedRoute>
              <UserDetailScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-detail" 
          element={
            <ProtectedRoute>
              <UserDetailScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/matches" 
          element={
            <ProtectedRoute>
              <MatchesScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:matchId" 
          element={
            <ProtectedRoute>
              <ChatScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-call/:matchId" 
          element={
            <ProtectedRoute>
              <VideoCallScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/filters" 
          element={
            <ProtectedRoute>
              <FiltersScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscription" 
          element={
            <ProtectedRoute>
              <SubscriptionScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookmark" 
          element={
            <ProtectedRoute>
              <BookmarkScreen />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/started" replace />} />
        <Route path="*" element={<Navigate to="/started" replace />} />
      </Routes>
    </NativeRouter>
  );
}
