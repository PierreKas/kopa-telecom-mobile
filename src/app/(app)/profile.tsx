// import { Feather } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { Fragment } from "react";
// import { Alert, Pressable, ScrollView, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { KopaIcon } from "@/components/brand/kopa-logo";
// import { Card } from "@/components/ui/card";
// import { Colors } from "@/constants/theme";
// import { USE_MOCK } from "@/lib/mock-config";
// import { MOCK_PROFILE } from "@/lib/mock-data";
// import { loggedOut } from "@/store/authSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { useGetProfileQuery, useLogoutMutation } from "@/store/identityApi";

// type Row = {
//   icon: keyof typeof Feather.glyphMap;
//   label: string;
//   onPress?: () => void;
//   destructive?: boolean;
// };

// export default function Profile() {
//   const dispatch = useAppDispatch();
//   const session = useAppSelector((state) => state.auth.session);
//   const { data: profileData } = useGetProfileQuery(undefined, { skip: USE_MOCK });
//   const profile = USE_MOCK ? MOCK_PROFILE : profileData;
//   const [logout] = useLogoutMutation();

//   async function handleLogout() {
//     if (!USE_MOCK) {
//       try {
//         await logout().unwrap();
//       } catch {
//         // Even if the server call fails (e.g. offline), still clear the local session below.
//       }
//     }
//     dispatch(loggedOut());
//     router.replace("/(auth)/login-step1");
//   }

//   function confirmLogout() {
//     Alert.alert("Log out", "Are you sure you want to log out?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Log out", style: "destructive", onPress: handleLogout },
//     ]);
//   }

//   const groups: Row[][] = [
//     [{ icon: "user", label: "Personal info" }],
//     [
//       {
//         icon: "lock",
//         label: "Change PIN",
//         onPress: () => router.push("/pin-change"),
//       },
//       {
//         icon: "key",
//         label: "Forgot PIN",
//         onPress: () => router.push("/(auth)/forgot-pin"),
//       },
//     ],
//     [
//       { icon: "bell", label: "Notifications" },
//       { icon: "help-circle", label: "Help" },
//       { icon: "info", label: "About" },
//     ],
//     [
//       {
//         icon: "log-out",
//         label: "Log out",
//         onPress: confirmLogout,
//         destructive: true,
//       },
//     ],
//   ];

//   return (
//     <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
//       <ScrollView contentContainerClassName="px-5 pb-10">
//         <Text className="py-4 text-2xl font-bold text-foreground">Profile</Text>

//         <View className="items-center py-4">
//           <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-accent">
//             <KopaIcon size={44} />
//           </View>
//           <Text className="text-lg font-bold text-foreground">
//             {profile?.fullName ?? session?.msisdn ?? "Customer"}
//           </Text>
//           <Text className="text-sm text-muted-foreground">
//             {session?.msisdn}
//           </Text>
//           {profile?.email ? (
//             <Text className="text-sm text-muted-foreground">
//               {profile.email}
//             </Text>
//           ) : null}
//         </View>

//         {groups.map((rows, groupIndex) => (
//           <Card key={groupIndex} className="mb-4 gap-0 p-0">
//             {rows.map((row, rowIndex) => (
//               <Fragment key={row.label}>
//                 <Pressable
//                   onPress={row.onPress}
//                   className="flex-row items-center gap-3 px-4 py-4"
//                 >
//                   <Feather
//                     name={row.icon}
//                     size={18}
//                     color={row.destructive ? Colors.error : Colors.primary}
//                   />
//                   <Text
//                     className={`flex-1 font-medium ${row.destructive ? "text-destructive" : "text-foreground"}`}
//                   >
//                     {row.label}
//                   </Text>
//                   {!row.destructive ? (
//                     <Feather
//                       name="chevron-right"
//                       size={18}
//                       color={Colors.gray4}
//                     />
//                   ) : null}
//                 </Pressable>
//                 {rowIndex < rows.length - 1 ? (
//                   <View className="h-px bg-border/60" />
//                 ) : null}
//               </Fragment>
//             ))}
//           </Card>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Fragment } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CardShadow, Colors, HeroGradient } from "@/constants/theme";
import { USE_MOCK } from "@/lib/mock-config";
import { MOCK_AVATAR_URL, MOCK_MSISDN, MOCK_PROFILE } from "@/lib/mock-data";
import { loggedOut } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useGetProfileQuery, useLogoutMutation } from "@/store/identityApi";
import { useState } from "react";

type Row = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
};

type Group = { title: string; rows: Row[] };

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={[
        {
          borderRadius: 24,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.gray5,
          overflow: "hidden",
        },
        CardShadow,
      ]}
    >
      {children}
    </View>
  );
}

function IconTile({
  icon,
  color,
  tint,
}: {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  tint: string;
}) {
  return (
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: tint,
      }}
    >
      <Feather name={icon} size={18} color={color} />
    </View>
  );
}

export default function Profile() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: USE_MOCK,
  });
  const profile = USE_MOCK ? MOCK_PROFILE : profileData;
  const [logout] = useLogoutMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : "");
  const fullName = profile?.fullName ?? msisdn ?? "Customer";
  // Frontend-only placeholder, same as on Home (the API has no avatar field).
  const avatarUrl = MOCK_AVATAR_URL;

  // async function handleLogout() {
  //   if (!USE_MOCK) {
  //     try {
  //       await logout().unwrap();
  //     } catch {
  //       // Even if the server call fails (e.g. offline), still clear the local session below.
  //     }
  //   }
  //   dispatch(loggedOut());
  //   router.replace("/(auth)/login-step1");
  // }
  async function handleLogout() {
    setLoggingOut(true);
    if (!USE_MOCK) {
      try {
        await logout().unwrap();
      } catch {
        // Even if the server call fails (e.g. offline), still clear the local session below.
      }
    }
    setConfirmOpen(false);
    setLoggingOut(false);
    dispatch(loggedOut());
    router.replace("/(auth)/login-step1");
  }

  function confirmLogout() {
    setConfirmOpen(true);
  }

  // function confirmLogout() {
  //   Alert.alert("Log out", "Are you sure you want to log out?", [
  //     { text: "Cancel", style: "cancel" },
  //     { text: "Log out", style: "destructive", onPress: handleLogout },
  //   ]);
  // }

  const groups: Group[] = [
    {
      title: "Account",
      rows: [
        { icon: "user", label: "Personal info" },
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
    },
    {
      title: "General",
      rows: [
        { icon: "bell", label: "Notifications" },
        { icon: "help-circle", label: "Help" },
        { icon: "info", label: "About" },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <Text className="py-4 text-2xl font-bold text-foreground">Profile</Text>

        {/* Avatar + name */}
        <View className="items-center pb-5 pt-2">
          <View>
            <View
              style={{
                width: 108,
                height: 108,
                borderRadius: 54,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 98, height: 98, borderRadius: 49 }}
                />
              ) : (
                <View
                  style={{
                    width: 98,
                    height: 98,
                    borderRadius: 49,
                    backgroundColor: Colors.white,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="user" size={44} color={Colors.primary} />
                </View>
              )}
            </View>

            {/* Edit badge (not wired yet) */}
            <Pressable
              hitSlop={8}
              style={{
                position: "absolute",
                right: 0,
                bottom: 2,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: Colors.textPrimary,
                borderWidth: 3,
                borderColor: Colors.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="edit-2" size={13} color={Colors.white} />
            </Pressable>
          </View>

          <Text className="mt-4 text-xl font-bold text-foreground">
            {fullName}
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground">{msisdn}</Text>
          {profile?.email ? (
            <Text className="text-sm text-muted-foreground">
              {profile.email}
            </Text>
          ) : null}
        </View>

        {/* Highlight card */}
        <Pressable onPress={() => router.push("/pin-change")}>
          <LinearGradient
            colors={HeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 22,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.22)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="shield" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.white }} className="font-bold">
                Keep your account safe
              </Text>
              <Text
                style={{ color: "rgba(255,255,255,0.75)" }}
                className="mt-0.5 text-xs"
              >
                Change your PIN regularly
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.white} />
          </LinearGradient>
        </Pressable>

        {/* Groups */}
        {groups.map((group) => (
          <View key={group.title} className="mt-6">
            <Text className="mb-2 ml-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </Text>
            <Panel>
              {group.rows.map((row, rowIndex) => (
                <Fragment key={row.label}>
                  <Pressable
                    onPress={row.onPress}
                    className="flex-row items-center gap-3 px-4 py-3.5"
                  >
                    <IconTile
                      icon={row.icon}
                      color={Colors.primary}
                      tint={Colors.primary + "14"}
                    />
                    <Text className="flex-1 font-medium text-foreground">
                      {row.label}
                    </Text>
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={Colors.gray4}
                    />
                  </Pressable>
                  {rowIndex < group.rows.length - 1 ? (
                    <View
                      style={{
                        height: 1,
                        marginLeft: 66,
                        backgroundColor: Colors.gray5,
                      }}
                    />
                  ) : null}
                </Fragment>
              ))}
            </Panel>
          </View>
        ))}

        {/* Logout */}
        <View className="mt-6">
          <Panel>
            <Pressable
              onPress={confirmLogout}
              className="flex-row items-center gap-3 px-4 py-3.5"
            >
              <IconTile
                icon="log-out"
                color={Colors.error}
                tint={Colors.error + "1A"}
              />
              <Text
                style={{ color: Colors.error }}
                className="flex-1 font-semibold"
              >
                Log out
              </Text>
            </Pressable>
          </Panel>
        </View>
      </ScrollView>
      <ConfirmDialog
        visible={confirmOpen}
        icon="log-out"
        title="Log out?"
        message="You'll need your phone number and PIN to sign in again."
        confirmLabel="Log out"
        destructive
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </SafeAreaView>
  );
}
