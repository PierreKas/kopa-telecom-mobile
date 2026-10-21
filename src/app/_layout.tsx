import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Provider } from "react-redux";

import "@/global.css";
import { useAuthPersistence } from "@/hooks/use-auth-persistence";
import { store } from "@/store";
import { Link } from "expo-router";
import { cssInterop } from "nativewind";

cssInterop(Link, { className: "style" });

SplashScreen.preventAutoHideAsync();

function AppContent() {
  useAuthPersistence();

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="recharge" options={{ presentation: "modal" }} />
        <Stack.Screen name="otp-verify" options={{ presentation: "modal" }} />
        <Stack.Screen name="pin-change" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
