// import { Feather } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { router } from 'expo-router';
// import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { KopaIcon } from '@/components/brand/kopa-logo';
// import { Card } from '@/components/ui/card';
// import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
// import { Colors, HeroGradient } from '@/constants/theme';
// import { useAppSelector } from '@/store/hooks';
// import { useGetBalanceQuery, useGetStatementQuery, useGetUsageQuery } from '@/store/selfCareApi';

// function statusTone(status: string): StatusTone {
//   if (status === 'SUCCESS') return 'success';
//   if (status === 'FAILED') return 'overdue';
//   if (status === 'OTP_PENDING' || status === 'SUBMITTED') return 'pending';
//   return 'warning';
// }

// export default function Home() {
//   const session = useAppSelector((state) => state.auth.session);
//   const msisdn = session?.msisdn ?? '';

//   const balanceQuery = useGetBalanceQuery(msisdn, { skip: !msisdn });
//   const usageQuery = useGetUsageQuery(msisdn, { skip: !msisdn });
//   const statementQuery = useGetStatementQuery(msisdn, { skip: !msisdn });

//   const refreshing = balanceQuery.isFetching || usageQuery.isFetching;
//   function refresh() {
//     void balanceQuery.refetch();
//     void usageQuery.refetch();
//     void statementQuery.refetch();
//   }

//   const recentEntries = statementQuery.data?.entries.slice(0, 3) ?? [];

//   const dataItem = usageQuery.data?.items.find((item) => item.productName?.toLowerCase().includes('data'));
//   const voiceItem = usageQuery.data?.items.find((item) => item.productName?.toLowerCase().includes('voice'));

//   return (
//     <SafeAreaView className="flex-1 bg-background" edges={['top']}>
//       <ScrollView
//         contentContainerClassName="px-5 pb-8"
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.primary} />}>
//         <View className="flex-row items-center justify-between py-4">
//           <View className="flex-row items-center gap-3">
//             <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
//               <KopaIcon size={28} />
//             </View>
//             <View>
//               <Text className="text-sm text-muted-foreground">Good to see you,</Text>
//               <Text className="text-lg font-bold text-foreground">{msisdn || 'Customer'}</Text>
//             </View>
//           </View>
//           <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-accent" hitSlop={8}>
//             <Feather name="bell" size={20} color={Colors.primary} />
//           </Pressable>
//         </View>

//         <LinearGradient colors={HeroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-2xl p-5" style={{ borderRadius: 24 }}>
//           <View className="flex-row items-center justify-between">
//             <Text className="text-sm text-white/80">Current balance</Text>
//             <View className="rounded-full bg-white/20 px-3 py-1">
//               <Text className="text-xs font-semibold text-white">{session?.msisdn}</Text>
//             </View>
//           </View>
//           <Text className="mt-2 text-4xl font-bold text-white">
//             {balanceQuery.data ? `${balanceQuery.data.currency} ${balanceQuery.data.remainingAmount}` : balanceQuery.isLoading ? '…' : '—'}
//           </Text>
//           {balanceQuery.error ? <Text className="mt-1 text-sm text-white/70">Could not load balance right now.</Text> : null}
//         </LinearGradient>

//         <View className="mt-4 flex-row gap-3">
//           <Card className="flex-1 items-start gap-1">
//             <Feather name="wifi" size={18} color={Colors.primary} />
//             <Text className="text-base font-bold text-foreground">{dataItem?.remaining ?? '—'}</Text>
//             <Text className="text-xs text-muted-foreground">Data left</Text>
//           </Card>
//           <Card className="flex-1 items-start gap-1">
//             <Feather name="phone" size={18} color={Colors.primary} />
//             <Text className="text-base font-bold text-foreground">{voiceItem?.remaining ?? '—'}</Text>
//             <Text className="text-xs text-muted-foreground">Voice left</Text>
//           </Card>
//         </View>

//         <View className="mt-5 flex-row gap-3">
//           <Pressable onPress={() => router.push('/recharge')} className="flex-1">
//             <LinearGradient colors={HeroGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-row items-center justify-center gap-2 rounded-full py-4">
//               <Feather name="plus" size={18} color={Colors.white} />
//               <Text className="font-semibold text-white">Recharge</Text>
//             </LinearGradient>
//           </Pressable>
//           <Pressable onPress={() => router.push('/(app)/bundles')} className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary py-4">
//             <Feather name="package" size={18} color={Colors.primary} />
//             <Text className="font-semibold text-primary">Buy bundle</Text>
//           </Pressable>
//         </View>

//         <View className="mt-7 flex-row items-center justify-between">
//           <Text className="text-lg font-bold text-foreground">Recent activity</Text>
//           <Pressable onPress={() => router.push('/(app)/history')}>
//             <Text className="text-sm font-medium text-primary">See all</Text>
//           </Pressable>
//         </View>

//         {recentEntries.length === 0 ? (
//           <Card className="mt-3 items-center py-8">
//             <Feather name="inbox" size={28} color={Colors.gray4} />
//             <Text className="mt-2 text-sm text-muted-foreground">Your recent recharges and purchases will show up here.</Text>
//           </Card>
//         ) : (
//           <View className="mt-3 gap-3">
//             {recentEntries.map((entry) => (
//               <Card key={entry.id} className="flex-row items-center justify-between">
//                 <View className="mr-3 flex-1">
//                   <Text className="font-semibold text-foreground">{entry.transactionType.replace(/_/g, ' ')}</Text>
//                   <Text className="mt-1 text-xs text-muted-foreground">{new Date(entry.requestedAt).toLocaleDateString()}</Text>
//                 </View>
//                 <View className="items-end gap-2">
//                   {entry.amount ? (
//                     <Text className="font-bold text-foreground">
//                       {entry.currency} {entry.amount}
//                     </Text>
//                   ) : null}
//                   <StatusPill label={entry.status.replace('_', ' ')} tone={statusTone(entry.status)} />
//                 </View>
//               </Card>
//             ))}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/card";
import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { Colors, HeroGradient } from "@/constants/theme";
import { toggleArcMenu, useArcMenuOpen } from "@/lib/arc-menu-store";
import { USE_MOCK } from "@/lib/mock-config";
import {
  MOCK_AVATAR_URL,
  MOCK_BALANCE,
  MOCK_MSISDN,
  MOCK_PROFILE,
  MOCK_STATEMENT_ENTRIES,
  MOCK_USAGE_ITEMS,
} from "@/lib/mock-data";
import { useAppSelector } from "@/store/hooks";
import { useGetProfileQuery } from "@/store/identityApi";
import {
  useGetBalanceQuery,
  useGetStatementQuery,
  useGetUsageQuery,
} from "@/store/selfCareApi";

function transactionIcon(type: string): keyof typeof Feather.glyphMap {
  if (type.startsWith("RECHARGE")) return "plus-circle";
  if (type === "BUNDLE_PURCHASE") return "package";
  if (type === "PURCHASE" || type === "CANCEL") return "package";
  return "repeat";
}

function statusTone(status: string): StatusTone {
  if (status === "SUCCESS") return "success";
  if (status === "FAILED") return "overdue";
  if (status === "OTP_PENDING" || status === "SUBMITTED") return "pending";
  return "warning";
}

export default function Home() {
  const menuOpen = useArcMenuOpen();
  const { data: profile } = useGetProfileQuery(undefined, { skip: USE_MOCK });
  const fullName = USE_MOCK
    ? MOCK_PROFILE.fullName
    : (profile?.fullName ?? "Customer");
  // ProfileResponse has no avatar field at all - this is a frontend-only placeholder either way,
  // mock or real, not something that will ever come from the API.
  const avatarUrl = MOCK_AVATAR_URL;

  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : "");

  const skip = USE_MOCK || !msisdn;
  const balanceQuery = useGetBalanceQuery(msisdn, { skip });
  const usageQuery = useGetUsageQuery(msisdn, { skip });
  const statementQuery = useGetStatementQuery(msisdn, { skip });

  const refreshing =
    !USE_MOCK && (balanceQuery.isFetching || usageQuery.isFetching);
  function refresh() {
    if (USE_MOCK) return;
    void balanceQuery.refetch();
    void usageQuery.refetch();
    void statementQuery.refetch();
  }

  const balance = USE_MOCK ? MOCK_BALANCE : balanceQuery.data;
  const usageItems = USE_MOCK
    ? MOCK_USAGE_ITEMS
    : (usageQuery.data?.items ?? []);
  const entries = USE_MOCK
    ? MOCK_STATEMENT_ENTRIES
    : (statementQuery.data?.entries ?? []);
  const recentEntries = entries.slice(0, 3);

  // Same derivation for mock and real data - both are the exact same UsageItem[] shape.
  const dataItem = usageItems.find((item) =>
    item.productName?.toLowerCase().includes("data"),
  );
  const voiceItem = usageItems.find((item) =>
    item.productName?.toLowerCase().includes("voice"),
  );

  const dataLeft = dataItem?.remaining ?? "—";
  const voiceLeft = voiceItem?.remaining ?? "—";

  const balanceText = balance
    ? `${balance.currency} ${balance.remainingAmount}`
    : !USE_MOCK && balanceQuery.isLoading
      ? "…"
      : "—";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-8"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
              <KopaIcon size={28} />
            </View>
            <View>
              <Text className="text-sm text-muted-foreground">
                Good to see you,
              </Text>
              <Text className="text-lg font-bold text-foreground">
                {msisdn || "Customer"}
              </Text>
            </View>
          </View>
          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full bg-accent"
            hitSlop={8}
          >
            <Feather name="bell" size={20} color={Colors.primary} />
          </Pressable>
        </View> */}
        <View className="flex-row items-center gap-10 py-4">
          <View
            className="flex-1 flex-row items-center gap-3 rounded-full bg-white p-1 pr-5"
            style={{
              elevation: 1,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {/* Profile picture with a thin ring */}
            <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <View className="h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Feather name="user" size={24} color={Colors.primary} />
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text
                className="text-base font-bold text-foreground"
                numberOfLines={1}
              >
                {fullName}
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                {msisdn}
              </Text>
            </View>
          </View>

          {/* Menu button, synchronized with the bottom one */}
          <Pressable
            onPress={toggleArcMenu}
            hitSlop={8}
            className="h-16 w-16 items-center justify-center rounded-full bg-white"
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Feather
              name={menuOpen ? "x" : "menu"}
              size={24}
              color={Colors.primary}
            />
          </Pressable>
        </View>

        <LinearGradient
          colors={HeroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5"
          style={{ borderRadius: 24 }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-white/80">Current balance</Text>
            <View className="rounded-full bg-white/20 px-3 py-1">
              <Text className="text-xs font-semibold text-white">{msisdn}</Text>
            </View>
          </View>
          <Text className="mt-2 text-4xl font-bold text-white">
            {balanceText}
          </Text>
          {!USE_MOCK && balanceQuery.error ? (
            <Text className="mt-1 text-sm text-white/70">
              Could not load balance right now.
            </Text>
          ) : null}
        </LinearGradient>

        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1 items-start gap-1">
            <Feather name="wifi" size={18} color={Colors.primary} />
            <Text className="text-base font-bold text-foreground">
              {dataLeft}
            </Text>
            <Text className="text-xs text-muted-foreground">Data left</Text>
          </Card>
          <Card className="flex-1 items-start gap-1">
            <Feather name="phone" size={18} color={Colors.primary} />
            <Text className="text-base font-bold text-foreground">
              {voiceLeft}
            </Text>
            <Text className="text-xs text-muted-foreground">Voice left</Text>
          </Card>
        </View>

        <View className="mt-5 flex-row gap-3">
          <Pressable
            onPress={() => router.push("/recharge")}
            className="flex-1"
          >
            <LinearGradient
              colors={HeroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-row items-center justify-center gap-2 rounded-full py-4"
            >
              <Feather name="plus" size={18} color={Colors.white} />
              <Text className="font-semibold text-white">Recharge</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            onPress={() => router.push("/(app)/bundles")}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-primary py-4"
          >
            <Feather name="package" size={18} color={Colors.primary} />
            <Text className="font-semibold text-primary">Buy bundle</Text>
          </Pressable>
        </View>

        <View className="mt-7 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">
            Recent activity
          </Text>
          <Pressable onPress={() => router.push("/(app)/history")}>
            <Text className="text-sm font-medium text-primary">See all</Text>
          </Pressable>
        </View>

        {recentEntries.length === 0 ? (
          <Card className="mt-3 items-center py-8">
            <Feather name="inbox" size={28} color={Colors.gray4} />
            <Text className="mt-2 text-sm text-muted-foreground">
              Your recent recharges and purchases will show up here.
            </Text>
          </Card>
        ) : (
          <View className="mt-3 gap-2">
            {recentEntries.map((entry, index) => (
              // <Card
              //   key={entry.id}
              //   className="flex-row items-center justify-between"
              // >
              //   <View className="mr-3 flex-1">
              //     <Text className="font-semibold text-foreground">
              //       {entry.transactionType.replace(/_/g, " ")}
              //     </Text>
              //     <Text className="mt-1 text-xs text-muted-foreground">
              //       {new Date(entry.requestedAt).toLocaleDateString()}
              //     </Text>
              //   </View>
              //   <View className="items-end gap-2">
              //     {entry.amount ? (
              //       <Text className="font-bold text-foreground">
              //         {entry.currency} {entry.amount}
              //       </Text>
              //     ) : null}
              //     <StatusPill
              //       label={entry.status.replace("_", " ")}
              //       tone={statusTone(entry.status)}
              //     />
              //   </View>
              // </Card>
              // KTRN_HISTORY entries have no local id (StatementEntry.id is nullable) - fall
              // back to source+date+index, which is still unique within this list.
              <Card
                key={entry.id ?? `${entry.source}-${entry.requestedAt}-${index}`}
                className="flex-row items-center gap-3"
              >
                {/* Icon */}
                <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
                  <Feather
                    name={transactionIcon(entry.transactionType)}
                    size={20}
                    color={Colors.primary}
                  />
                </View>

                {/* Type + date */}
                <View className="flex-1 ">
                  <Text className="font-xs text-foreground" numberOfLines={1}>
                    {entry.transactionType.replace(/_/g, " ")}
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">
                    {entry.requestedAt
                      ? new Date(entry.requestedAt).toLocaleDateString()
                      : "—"}
                  </Text>
                </View>

                {/* Amount + status */}
                <View className="items-end gap-2">
                  {entry.amount ? (
                    <Text className="font-bold text-foreground">
                      {entry.currency} {entry.amount}
                    </Text>
                  ) : null}
                  <StatusPill
                    label={entry.status.replace("_", " ")}
                    tone={statusTone(entry.status)}
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
