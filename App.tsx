import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import StartedScreen from "./src/screens/StartedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CreateProfileScreen from "./src/screens/CreateProfileScreen";
import SwipeScreen from "./src/screens/SwipeScreen";
import SwipeConfirmationScreen from "./src/screens/SwipeConfirmationScreen";
import ProfileViewScreen from "./src/screens/ProfileViewScreen";
import MatchesScreen from "./src/screens/MatchesScreen";
import ChatScreen from "./src/screens/ChatScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import FiltersScreen from "./src/screens/FiltersScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";

export type RootStackParamList = {
  Started: undefined;
  Login: undefined;
  Home: undefined;
  CreateProfile: undefined;
  Swipe: undefined;
  SwipeConfirmation: { matchedUser: any };
  ProfileView: { user: any };
  Matches: undefined;
  Chat: { user: any };
  VideoCall: { user: any };
  Filters: undefined;
  Subscription: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Started"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.FadeFromBottomAndroid, // hiệu ứng chuyển mượt
        }}
      >
        <Stack.Screen name="Started" component={StartedScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen name="Swipe" component={SwipeScreen} />
        <Stack.Screen name="SwipeConfirmation" component={SwipeConfirmationScreen} />
        <Stack.Screen name="ProfileView" component={ProfileViewScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} />
        <Stack.Screen name="Filters" component={FiltersScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
