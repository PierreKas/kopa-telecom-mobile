import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Fragment } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { KopaIcon } from "@/components/brand/kopa-logo";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/theme";
import { loggedOut } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProfileQuery, useLogoutMutation } from "@/store/identityApi";

type Row = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const { data: profile } = useGetProfileQuery();
  const [logout] = useLogoutMutation();

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // Even if the server call fails (e.g. offline), still clear the local session below.
    }
    dispatch(loggedOut());
    router.replace("/(auth)/login-step1");
  }

  function confirmLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: handleLogout },
    ]);
  }

  const groups: Row[][] = [
    [{ icon: "user", label: "Personal info" }],
    [
      {
        icon: "lock",
        label: "Change PIN",
        onPress: () => router.push("/pin-change"),
      },
      {
        icon: "key",
        label: "Forgot PIN",
        onPress: () => router.push("/(auth)/forgot-pin"),
      },
    ],
    [
      { icon: "bell", label: "Notifications" },
      { icon: "help-circle", label: "Help" },
      { icon: "info", label: "About" },
    ],
    [
      {
        icon: "log-out",
        label: "Log out",
        onPress: confirmLogout,
        destructive: true,
      },
    ],
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView contentContainerClassName="px-5 pb-10">
        <Text className="py-4 text-2xl font-bold text-foreground">Profile</Text>

        <View className="items-center py-4">
          <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-accent">
            <KopaIcon size={44} />
          </View>
          <Text className="text-lg font-bold text-foreground">
            {profile?.fullName ?? session?.msisdn ?? "Customer"}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {session?.msisdn}
          </Text>
          {profile?.email ? (
            <Text className="text-sm text-muted-foreground">
              {profile.email}
            </Text>
          ) : null}
        </View>

        {groups.map((rows, groupIndex) => (
          <Card key={groupIndex} className="mb-4 gap-0 p-0">
            {rows.map((row, rowIndex) => (
              <Fragment key={row.label}>
                <Pressable
                  onPress={row.onPress}
                  className="flex-row items-center gap-3 px-4 py-4"
                >
                  <Feather
                    name={row.icon}
                    size={18}
                    color={row.destructive ? Colors.error : Colors.primary}
                  />
                  <Text
                    className={`flex-1 font-medium ${row.destructive ? "text-destructive" : "text-foreground"}`}
                  >
                    {row.label}
                  </Text>
                  {!row.destructive ? (
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={Colors.gray4}
                    />
                  ) : null}
                </Pressable>
                {rowIndex < rows.length - 1 ? (
                  <View className="h-px bg-border/60" />
                ) : null}
              </Fragment>
            ))}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
