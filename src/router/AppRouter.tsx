import React from 'react';
import { NativeRouter, Route, Routes, Navigate } from 'react-router-native';
import { useAuthContext } from '../context/AuthContext';

// Import screens
import StartedScreen from '../screens/StartedScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateProfileScreen from '../screens/CreateProfileScreen';
import SwipeScreen from '../screens/SwipeScreen';
import SwipeConfirmationScreen from '../screens/SwipeConfirmationScreen';
import ProfileViewScreen from '../screens/ProfileViewScreen';
import MatchesScreen from '../screens/MatchesScreen';
import ChatScreen from '../screens/ChatScreen';
import VideoCallScreen from '../screens/VideoCallScreen';
import FiltersScreen from '../screens/FiltersScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

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

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return !isAuthenticated ? children : <Navigate to="/swipe" replace />;
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
          path="/home" 
          element={
            <ProtectedRoute>
              <HomeScreen />
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
          path="/profile-view" 
          element={
            <ProtectedRoute>
              <ProfileViewScreen />
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
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-call" 
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
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </NativeRouter>
  );
}
