// import { Feather } from '@expo/vector-icons';
// import { useMemo, useState } from 'react';
// import { FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { Card } from '@/components/ui/card';
// import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
// import { getApiErrorMessage } from '@/lib/api-error-message';
// import { Colors } from '@/constants/theme';
// import { USE_MOCK } from '@/lib/mock-config';
// import { MOCK_MSISDN, MOCK_STATEMENT_ENTRIES } from '@/lib/mock-data';
// import { useAppSelector } from '@/store/hooks';
// import { useGetStatementQuery, type StatementEntry } from '@/store/selfCareApi';

// // "Bundle history" (not "Usage" - no backend TransactionType is ever that) maps to KTRN_HISTORY
// // entries (HP00005/HPOP101's BUNDLE_HIST) - bundle activity from KTRN itself, including
// // purchases/cancellations that predate this app or came through another channel.
// const FILTERS = ['All', 'Recharge', 'Bundle', 'Bundle history'] as const;
// type Filter = (typeof FILTERS)[number];

// function statusTone(status: string): StatusTone {
//   switch (status) {
//     case 'SUCCESS':
//       return 'success';
//     case 'FAILED':
//       return 'overdue';
//     case 'OTP_PENDING':
//     case 'SUBMITTED':
//       return 'pending';
//     default:
//       return 'warning';
//   }
// }

// function matchesFilter(entry: StatementEntry, filter: Filter): boolean {
//   if (filter === 'All') return true;
//   if (filter === 'Recharge') return entry.transactionType.startsWith('RECHARGE');
//   if (filter === 'Bundle') return entry.transactionType === 'BUNDLE_PURCHASE';
//   return entry.source === 'KTRN_HISTORY';
// }

// function typeLabel(type: string): string {
//   return type.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
// }

// function entryKey(entry: StatementEntry, index: number): string {
//   return entry.id ?? `${entry.source}-${entry.requestedAt}-${index}`;
// }

// export default function History() {
//   const session = useAppSelector((state) => state.auth.session);
//   const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : '');
//   const [search, setSearch] = useState('');
//   const [filter, setFilter] = useState<Filter>('All');

//   const { data, isFetching, error, refetch } = useGetStatementQuery(msisdn, { skip: USE_MOCK || !msisdn });

//   const filtered = useMemo(() => {
//     const entries = USE_MOCK ? MOCK_STATEMENT_ENTRIES : (data?.entries ?? []);
//     return entries.filter(
//       (entry) => matchesFilter(entry, filter) && (!search.trim() || (entry.id ?? '').toLowerCase().includes(search.toLowerCase())),
//     );
//   }, [data, filter, search]);

//   return (
//     <SafeAreaView className="flex-1 bg-background" edges={['top']}>
//       <View className="px-5 pb-3 pt-4">
//         <Text className="mb-4 text-2xl font-bold text-foreground">History</Text>
//         <View className="mb-3 flex-row items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
//           <Feather name="search" size={18} color={Colors.gray3} />
//           <TextInput value={search} onChangeText={setSearch} placeholder="Search by transaction ID…" placeholderTextColor="#9CA3AF" className="flex-1 text-base text-foreground" />
//         </View>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
//           {FILTERS.map((item) => (
//             <Pressable
//               key={item}
//               onPress={() => setFilter(item)}
//               className="rounded-full border px-4 py-2"
//               style={{ borderColor: filter === item ? Colors.primary : Colors.border, backgroundColor: filter === item ? Colors.primary : 'transparent' }}>
//               <Text style={{ color: filter === item ? Colors.white : Colors.textPrimary }} className="font-medium">
//                 {item}
//               </Text>
//             </Pressable>
//           ))}
//         </ScrollView>
//       </View>

//       {error ? (
//         <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
//           <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
//         </View>
//       ) : null}

//       <FlatList
//         data={filtered}
//         keyExtractor={entryKey}
//         contentContainerClassName="gap-3 px-5 pb-8"
//         refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={Colors.primary} />}
//         ListEmptyComponent={
//           !isFetching ? (
//             <Card className="mt-10 items-center py-8">
//               <Feather name="clock" size={28} color={Colors.gray4} />
//               <Text className="mt-2 text-sm text-muted-foreground">No transactions yet.</Text>
//             </Card>
//           ) : null
//         }
//         renderItem={({ item }) => (
//           <Card className="flex-row items-center justify-between">
//             <View className="mr-3 flex-1">
//               <Text className="font-semibold text-foreground">{typeLabel(item.transactionType)}</Text>
//               <Text className="mt-1 text-xs text-muted-foreground">{item.requestedAt ? new Date(item.requestedAt).toLocaleString() : '—'}</Text>
//               {item.ktrnMessage ? <Text className="mt-1 text-xs text-muted-foreground">{item.ktrnMessage}</Text> : null}
//             </View>
//             <View className="items-end gap-2">
//               {item.amount ? (
//                 <Text className="font-bold text-foreground">
//                   {item.currency} {item.amount}
//                 </Text>
//               ) : null}
//               <StatusPill label={item.status.replace('_', ' ')} tone={statusTone(item.status)} />
//             </View>
//           </Card>
//         )}
//       />
//     </SafeAreaView>
//   );
// }

import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HistoryCard } from "@/components/ui/history-card";
import { type StatusTone } from "@/components/ui/status-pill";
import { Colors } from "@/constants/theme";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import { MOCK_MSISDN, MOCK_STATEMENT_ENTRIES } from "@/lib/mock-data";
import { useAppSelector } from "@/store/hooks";
import { useGetStatementQuery, type StatementEntry } from "@/store/selfCareApi";

// "Bundle history" maps to KTRN_HISTORY entries (bundle activity from KTRN itself, including
// purchases/cancellations that predate this app or came through another channel).
const FILTERS = ["All", "Recharge", "Bundle", "Bundle history"] as const;
type Filter = (typeof FILTERS)[number];

function statusTone(status: string): StatusTone {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "FAILED":
      return "overdue";
    case "OTP_PENDING":
    case "SUBMITTED":
      return "pending";
    default:
      return "warning";
  }
}

function matchesFilter(entry: StatementEntry, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Recharge")
    return entry.transactionType.startsWith("RECHARGE");
  if (filter === "Bundle") return entry.transactionType === "BUNDLE_PURCHASE";
  return entry.source === "KTRN_HISTORY";
}

function entryKey(entry: StatementEntry, index: number): string {
  return entry.id ?? `${entry.source}-${entry.requestedAt}-${index}`;
}

// function dayLabel(iso?: string): string {
function dayLabel(iso?: string | null): string {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Section = { title: string; data: StatementEntry[] };

function groupByDay(entries: StatementEntry[]): Section[] {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.requestedAt ?? 0).getTime() -
      new Date(a.requestedAt ?? 0).getTime(),
  );
  const map = new Map<string, StatementEntry[]>();
  for (const entry of sorted) {
    const key = dayLabel(entry.requestedAt);
    map.set(key, [...(map.get(key) ?? []), entry]);
  }
  return [...map.entries()].map(([title, data]) => ({ title, data }));
}

export default function History() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : "");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const { data, isFetching, error, refetch } = useGetStatementQuery(msisdn, {
    skip: USE_MOCK || !msisdn,
  });

  const sections = useMemo(() => {
    const entries = USE_MOCK ? MOCK_STATEMENT_ENTRIES : (data?.entries ?? []);
    const filtered = entries.filter(
      (entry) =>
        matchesFilter(entry, filter) &&
        (!search.trim() ||
          (entry.id ?? "").toLowerCase().includes(search.toLowerCase())),
    );
    return groupByDay(filtered);
  }, [data, filter, search]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-5 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">History</Text>
        <Text className="mb-4 mt-1 text-sm text-muted-foreground">
          Your recharges and purchases
        </Text>

        <View
          className="mb-3 flex-row items-center gap-2 rounded-full bg-white px-5 "
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Feather name="search" size={18} color={Colors.gray3} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by transaction ID…"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-foreground"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className="rounded-full border px-4 py-2"
                style={{
                  borderColor: active ? Colors.primary : Colors.gray5,
                  backgroundColor: active ? Colors.primary : "#fff",
                }}
              >
                <Text
                  style={{ color: active ? Colors.white : Colors.textPrimary }}
                  className="font-medium"
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {error ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </Text>
        </View>
      ) : null}

      <SectionList
        sections={sections}
        keyExtractor={entryKey}
        stickySectionHeadersEnabled={false}
        contentContainerClassName="px-5 pb-32"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <View className="mt-16 items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Feather name="clock" size={28} color={Colors.primary} />
              </View>
              <Text className="mt-3 text-base font-semibold text-foreground">
                No transactions yet
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                Your activity will show up here.
              </Text>
            </View>
          ) : null
        }
        renderSectionHeader={({ section }) => (
          <View className="mb-3 mt-5 flex-row items-center justify-between">
            <Text className="text-base font-bold text-foreground">
              {section.title}
            </Text>
            <View className="rounded-full bg-accent px-3 py-1">
              <Text className="text-xs font-semibold text-primary">
                {section.data.length}{" "}
                {section.data.length === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <HistoryCard
            type={item.transactionType}
            source={item.source}
            status={item.status}
            tone={statusTone(item.status)}
            requestedAt={item.requestedAt}
            amount={item.amount}
            currency={item.currency}
            message={item.ktrnMessage}
          />
        )}
      />
    </SafeAreaView>
  );
}
