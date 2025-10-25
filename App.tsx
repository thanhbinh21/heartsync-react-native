import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppRouter from "./src/router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppRouter />
    </AuthProvider>
  );
}