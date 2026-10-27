import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BundleCard,
  bundleKind,
  type BundleKind,
} from "@/components/ui/bundle-card";
import { Card } from "@/components/ui/card";
import { Colors } from "@/constants/theme";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import {
  MOCK_BUNDLES,
  MOCK_MSISDN,
  mockTransactionResult,
} from "@/lib/mock-data";
import { useAppSelector } from "@/store/hooks";
import {
  useGetBundlesQuery,
  usePurchaseBundleMutation,
  type Bundle,
} from "@/store/selfCareApi";

const FILTERS: { key: "all" | BundleKind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "data", label: "Data" },
  { key: "voice", label: "Voice" },
  { key: "sms", label: "SMS" },
];

export default function Bundles() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : "");
  const [search, setSearch] = useState("");
  const [purchasingCode, setPurchasingCode] = useState<string | null>(null);

  const { data, isFetching, error, refetch } = useGetBundlesQuery(msisdn, {
    skip: USE_MOCK || !msisdn,
  });
  const [purchaseBundle, { error: purchaseError }] =
    usePurchaseBundleMutation();

  const [filter, setFilter] = useState<"all" | BundleKind>("all");
  // const filtered = useMemo(() => {
  //   const bundles = USE_MOCK ? MOCK_BUNDLES : (data?.bundles ?? []);
  //   if (!search.trim()) return bundles;
  //   return bundles.filter((bundle) =>
  //     bundle.productName.toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [data, search]);

  const filtered = useMemo(() => {
    const bundles = USE_MOCK ? MOCK_BUNDLES : (data?.bundles ?? []);
    return bundles.filter(
      (b) =>
        (filter === "all" || bundleKind(b.productName) === filter) &&
        (!search.trim() ||
          b.productName.toLowerCase().includes(search.toLowerCase())),
    );
  }, [data, search, filter]);

  async function handlePurchase(bundle: Bundle) {
    setPurchasingCode(bundle.productCode);
    try {
      const result = USE_MOCK
        ? mockTransactionResult("OTP_PENDING")
        : await purchaseBundle({
            msisdn,
            productCode: bundle.productCode,
            price: bundle.price,
          }).unwrap();
      if (result.status === "OTP_PENDING") {
        router.push({
          pathname: "/otp-verify",
          params: {
            transactionId: result.transactionId,
            msisdn,
            description: `Purchase ${bundle.productName}`,
          },
        });
      }
    } catch {
      // surfaced via purchaseError below
    } finally {
      setPurchasingCode(null);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* <View className="px-5 pb-3 pt-4">
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
      </View> */}
      <View className="px-5 pb-3 pt-4">
        <Text className="text-2xl font-bold text-foreground">Bundles</Text>
        <Text className="mb-4 mt-1 text-sm text-muted-foreground">
          Pick a plan that fits you
        </Text>

        <View
          className="mb-3 flex-row items-center gap-2 rounded-full bg-white px-5"
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
            placeholder="Search bundles…"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-base text-foreground"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setFilter(f.key)}
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
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {purchaseError ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">
            {getApiErrorMessage(purchaseError)}
          </Text>
        </View>
      ) : null}
      {error ? (
        <View className="mx-5 mb-2 rounded-xl bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">
            {getApiErrorMessage(error)}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.productCode}
        contentContainerClassName="gap-4 px-5 pb-32"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          !isFetching ? (
            <Card className="mt-10 items-center py-8">
              <Feather name="package" size={28} color={Colors.gray4} />
              <Text className="mt-2 text-sm text-muted-foreground">
                No bundles found.
              </Text>
            </Card>
          ) : null
        }
        renderItem={({ item, index }) => (
          <BundleCard
            name={item.productName}
            code={item.productCode}
            price={item.price}
            highlighted={index === 0 && filter === "all" && !search.trim()}
            processing={purchasingCode === item.productCode}
            onBuy={() => handlePurchase(item)}
          />
        )}
        // renderItem={({ item }) => (
        //   <Card className="flex-row items-center justify-between">
        //     <View className="mr-3 flex-1">
        //       <Text className="font-semibold text-foreground">
        //         {item.productName}
        //       </Text>
        //       <Text className="mt-1 text-sm text-muted-foreground">
        //         {item.productCode}
        //       </Text>
        //     </View>
        //     <View className="items-end gap-2">
        //       <Text className="font-bold text-primary">RWF {item.price}</Text>
        //       <Pressable
        //         onPress={() => handlePurchase(item)}
        //         disabled={purchasingCode === item.productCode}
        //         className="rounded-full bg-primary px-4 py-2"
        //         style={{
        //           opacity: purchasingCode === item.productCode ? 0.6 : 1,
        //         }}
        //       >
        //         <Text className="text-sm font-semibold text-secondary">
        //           {purchasingCode === item.productCode ? "Processing…" : "Buy"}
        //         </Text>
        //       </Pressable>
        //     </View>
        //   </Card>
        // )}
      />
    </SafeAreaView>
  );
}
