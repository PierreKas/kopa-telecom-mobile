import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { useGetBundlesQuery, usePurchaseBundleMutation, type Bundle } from '@/store/selfCareApi';

export default function Bundles() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? '';
  const [search, setSearch] = useState('');
  const [purchasingCode, setPurchasingCode] = useState<string | null>(null);

  const { data, isFetching, error, refetch } = useGetBundlesQuery(msisdn, { skip: !msisdn });
  const [purchaseBundle, { error: purchaseError }] = usePurchaseBundleMutation();

  const filtered = useMemo(() => {
    const bundles = data?.bundles ?? [];
    if (!search.trim()) return bundles;
    return bundles.filter((bundle) => bundle.productName.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  async function handlePurchase(bundle: Bundle) {
    setPurchasingCode(bundle.productCode);
    try {
      const result = await purchaseBundle({ msisdn, productCode: bundle.productCode, price: bundle.price }).unwrap();
      if (result.status === 'OTP_PENDING') {
        router.push({
          pathname: '/otp-verify',
          params: { transactionId: result.transactionId, msisdn, description: `Purchase ${bundle.productName}` },
        });
      }
    } catch {
      // surfaced via purchaseError below
    } finally {
      setPurchasingCode(null);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pb-3 pt-4">
        <Text className="mb-4 text-2xl font-bold text-foreground">Bundles</Text>
        <View className="flex-row items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
          <Feather name="search" size={18} color={Colors.gray3} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search bundles…"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-foreground"
          />
        </View>
      </View>

      {purchaseError ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">{getApiErrorMessage(purchaseError)}</Text>
        </View>
      ) : null}
      {error ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.productCode}
        contentContainerClassName="gap-3 px-5 pb-8"
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={Colors.primary} />}
        ListEmptyComponent={
          !isFetching ? (
            <Card className="mt-10 items-center py-8">
              <Feather name="package" size={28} color={Colors.gray4} />
              <Text className="mt-2 text-sm text-muted-foreground">No bundles found.</Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <Card className="flex-row items-center justify-between">
            <View className="mr-3 flex-1">
              <Text className="font-semibold text-foreground">{item.productName}</Text>
              <Text className="mt-1 text-sm text-muted-foreground">{item.productCode}</Text>
            </View>
            <View className="items-end gap-2">
              <Text className="font-bold text-primary">RWF {item.price}</Text>
              <Pressable
                onPress={() => handlePurchase(item)}
                disabled={purchasingCode === item.productCode}
                className="rounded-full bg-primary px-4 py-2"
                style={{ opacity: purchasingCode === item.productCode ? 0.6 : 1 }}>
                <Text className="text-sm font-semibold text-white">{purchasingCode === item.productCode ? 'Processing…' : 'Buy'}</Text>
              </Pressable>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
