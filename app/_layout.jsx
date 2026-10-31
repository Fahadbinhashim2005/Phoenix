import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";
    const isRoot = segments.length === 0;

    if (!session) {
      // If not authenticated and trying to access protected screens, redirect to root
      if (!inAuthGroup && !isRoot) {
        router.replace("/");
      }
    } else {
      // If authenticated and on auth screens or landing page, redirect to tabs
      if (inAuthGroup || isRoot) {
        router.replace("/(tabs)/home");
      }
    }
  }, [session, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootLayoutNav />
    </AuthProvider>
  );
}
