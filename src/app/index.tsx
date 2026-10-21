import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";

import { Colors } from "@/constants/theme";
import { hasSeenOnboarding } from "@/lib/onboarding-seen";
import { useAppSelector } from "@/store/hooks";

export default function Index() {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const session = useAppSelector((state) => state.auth.session);
  const [onboardingSeen, setOnboardingSeen] = useState<boolean | null>(null);

  useEffect(() => {
    void hasSeenOnboarding().then(setOnboardingSeen);
  }, []);

  // Wait for both the auth-session read and the onboarding-seen read before deciding where to
  // go — deciding on partial state risks a real session flashing the login screen on cold start.
  if (!hydrated || onboardingSeen === null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Image
          source={require("@/assets/images/brand/logo-icon.png")}
          className="mb-6 h-16 w-16"
          resizeMode="contain"
        />
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (!onboardingSeen) return <Redirect href="/onboarding" />;
  if (session) return <Redirect href="/(app)/home" />;
  // Just to see how the home looks like
  // return <Redirect href="/(app)/home" />;
  return <Redirect href="/(auth)/login-step1" />;
}
