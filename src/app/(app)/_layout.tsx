import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";

import { ArcMenu } from "@/components/ui/arc-menu";
import { Colors } from "@/constants/theme";
import { useAppSelector } from "@/store/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// react-native's tabBarIcon color prop type is a ColorValue that can resolve to `null` at
// runtime (native color processing); Feather's `color` prop only accepts a definite string.
// One coercion point instead of repeating it per tab.
function TabIcon({
  name,
  color,
  size,
}: {
  name: keyof typeof Feather.glyphMap;
  color: ColorValue;
  size: number;
}) {
  return (
    <Feather
      name={name}
      color={typeof color === "string" ? color : Colors.gray3}
      size={size}
    />
  );
}

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const session = useAppSelector((state) => state.auth.session);

  // Mirrors index.tsx's own hydrated check — a direct deep link into (app)/* before the
  // secure-storage read resolves must not flash the login screen on top of a real session.
  if (!hydrated) return null;
  // JUST FOR DEMO I UNCOMMENT OUT THE FOLLOWING LINE
  //if (!session) return <Redirect href="/(auth)/login-step1" />;

  return (
    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarActiveTintColor: Colors.primary,
    //     tabBarInactiveTintColor: Colors.gray3,
    //     tabBarStyle: {
    //       borderTopColor: Colors.gray5,
    //       height: 64,
    //       paddingBottom: 10,
    //       paddingTop: 8,
    //     },
    //     tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
    //   }}
    // >
    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarActiveTintColor: Colors.primary,
    //     tabBarInactiveTintColor: Colors.gray3,
    //     tabBarStyle: {
    //       borderTopColor: Colors.gray5,
    //       height: 56 + insets.bottom,
    //       paddingBottom: insets.bottom + 6,
    //       paddingTop: 8,
    //     },
    //     tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
    //   }}
    // >
    <Tabs
      tabBar={(props) => <ArcMenu {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bundles"
        options={{
          title: "Bundles",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="package" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="clock" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
