import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { useGetStatementQuery, type StatementEntry } from '@/store/selfCareApi';

const FILTERS = ['All', 'Recharge', 'Bundle', 'Usage'] as const;
type Filter = (typeof FILTERS)[number];

function statusTone(status: string): StatusTone {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
      return 'overdue';
    case 'OTP_PENDING':
    case 'SUBMITTED':
      return 'pending';
    default:
      return 'warning';
  }
}

function matchesFilter(entry: StatementEntry, filter: Filter): boolean {
  if (filter === 'All') return true;
  if (filter === 'Recharge') return entry.transactionType.startsWith('RECHARGE');
  if (filter === 'Bundle') return entry.transactionType === 'BUNDLE_PURCHASE';
  return entry.transactionType === 'USAGE';
}

function typeLabel(type: string): string {
  return type.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export default function History() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? '';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const { data, isFetching, error, refetch } = useGetStatementQuery(msisdn, { skip: !msisdn });

  const filtered = useMemo(() => {
    const entries = data?.entries ?? [];
    return entries.filter((entry) => matchesFilter(entry, filter) && (!search.trim() || entry.id.toLowerCase().includes(search.toLowerCase())));
  }, [data, filter, search]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pb-3 pt-4">
        <Text className="mb-4 text-2xl font-bold text-foreground">History</Text>
        <View className="mb-3 flex-row items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <Feather name="search" size={18} color={Colors.gray3} />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search by transaction ID…" placeholderTextColor="#9CA3AF" className="flex-1 text-base text-foreground" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {FILTERS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              className="rounded-full border px-4 py-2"
              style={{ borderColor: filter === item ? Colors.primary : Colors.border, backgroundColor: filter === item ? Colors.primary : 'transparent' }}>
              <Text style={{ color: filter === item ? Colors.white : Colors.textPrimary }} className="font-medium">
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {error ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-3 px-5 pb-8"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={Colors.primary} />}
        ListEmptyComponent={
          !isFetching ? (
            <Card className="mt-10 items-center py-8">
              <Feather name="clock" size={28} color={Colors.gray4} />
              <Text className="mt-2 text-sm text-muted-foreground">No transactions yet.</Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Card className="flex-row items-center justify-between">
            <View className="mr-3 flex-1">
              <Text className="font-semibold text-foreground">{typeLabel(item.transactionType)}</Text>
              <Text className="mt-1 text-xs text-muted-foreground">{new Date(item.requestedAt).toLocaleString()}</Text>
              {item.ktrnMessage ? <Text className="mt-1 text-xs text-muted-foreground">{item.ktrnMessage}</Text> : null}
            </View>
            <View className="items-end gap-2">
              {item.amount ? (
                <Text className="font-bold text-foreground">
                  {item.currency} {item.amount}
                </Text>
              ) : null}
              <StatusPill label={item.status.replace('_', ' ')} tone={statusTone(item.status)} />
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
