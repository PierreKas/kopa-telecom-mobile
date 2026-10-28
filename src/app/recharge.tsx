// import { Feather } from '@expo/vector-icons';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { router } from 'expo-router';
// import { useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { Pressable, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { z } from 'zod';

// import { Button } from '@/components/ui/button';
// import { TextField } from '@/components/ui/text-field';
// import { getApiErrorMessage } from '@/lib/api-error-message';
// import { Colors } from '@/constants/theme';
// import { USE_MOCK } from '@/lib/mock-config';
// import { MOCK_MSISDN, mockTransactionResult } from '@/lib/mock-data';
// import { useAppSelector } from '@/store/hooks';
// import { useRechargeByVoucherMutation, useRechargeMutation } from '@/store/selfCareApi';

// const amountSchema = z.object({
//   nationalId: z.string().min(1, 'Enter your national ID'),
//   approvalNo: z.string().min(1, 'Enter the mobile money approval number'),
//   amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
// });
// type AmountValues = z.infer<typeof amountSchema>;

// const voucherSchema = z.object({ voucherNumber: z.string().min(4, 'Enter a valid voucher number') });
// type VoucherValues = z.infer<typeof voucherSchema>;

// export default function Recharge() {
//   const session = useAppSelector((state) => state.auth.session);
//   const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : '');
//   const [tab, setTab] = useState<'amount' | 'voucher'>('amount');
//   const [isMockRecharging, setIsMockRecharging] = useState(false);
//   const [isMockVoucherLoading, setIsMockVoucherLoading] = useState(false);
//   const [mockVoucherResult, setMockVoucherResult] = useState<ReturnType<typeof mockTransactionResult> | null>(null);

//   const [recharge, { isLoading: isRecharging, error: rechargeError }] = useRechargeMutation();
//   const [rechargeByVoucher, { isLoading: isVoucherLoading, error: voucherError, data: voucherResult }] = useRechargeByVoucherMutation();

//   const amountForm = useForm<AmountValues>({ resolver: zodResolver(amountSchema), defaultValues: { nationalId: '', approvalNo: '', amount: '' } });
//   const voucherForm = useForm<VoucherValues>({ resolver: zodResolver(voucherSchema), defaultValues: { voucherNumber: '' } });

//   async function onSubmitAmount(values: AmountValues) {
//     try {
//       if (USE_MOCK) {
//         setIsMockRecharging(true);
//         const result = mockTransactionResult('OTP_PENDING');
//         setIsMockRecharging(false);
//         router.replace({ pathname: '/otp-verify', params: { transactionId: result.transactionId, msisdn, description: `Recharge RWF ${values.amount}` } });
//         return;
//       }
//       const result = await recharge({ msisdn, ...values }).unwrap();
//       if (result.status === 'OTP_PENDING') {
//         router.replace({ pathname: '/otp-verify', params: { transactionId: result.transactionId, msisdn, description: `Recharge RWF ${values.amount}` } });
//       }
//     } catch {
//       // surfaced via rechargeError below
//     }
//   }

//   async function onSubmitVoucher(values: VoucherValues) {
//     try {
//       if (USE_MOCK) {
//         setIsMockVoucherLoading(true);
//         setMockVoucherResult(mockTransactionResult('SUCCESS'));
//         setIsMockVoucherLoading(false);
//         return;
//       }
//       await rechargeByVoucher({ msisdn, ...values }).unwrap();
//     } catch {
//       // surfaced via voucherError below
//     }
//   }

//   const recharging = USE_MOCK ? isMockRecharging : isRecharging;
//   const voucherLoading = USE_MOCK ? isMockVoucherLoading : isVoucherLoading;
//   const voucherOutcome = USE_MOCK ? mockVoucherResult : voucherResult;

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <View className="flex-row items-center px-4 py-3">
//         <Pressable onPress={() => router.back()} hitSlop={8}>
//           <Feather name="x" size={24} color={Colors.textPrimary} />
//         </Pressable>
//       </View>

//       <View className="px-6">
//         <Text className="mb-1 text-2xl font-bold text-foreground">Recharge</Text>
//         <Text className="mb-6 text-base text-muted-foreground">Top up {msisdn}</Text>

//         <View className="mb-6 flex-row rounded-full bg-muted/50 p-1">
//           <Pressable onPress={() => setTab('amount')} className="flex-1 rounded-full py-2.5" style={{ backgroundColor: tab === 'amount' ? Colors.primary : 'transparent' }}>
//             <Text className="text-center font-medium" style={{ color: tab === 'amount' ? Colors.white : Colors.textSecondary }}>
//               By amount
//             </Text>
//           </Pressable>
//           <Pressable onPress={() => setTab('voucher')} className="flex-1 rounded-full py-2.5" style={{ backgroundColor: tab === 'voucher' ? Colors.primary : 'transparent' }}>
//             <Text className="text-center font-medium" style={{ color: tab === 'voucher' ? Colors.white : Colors.textSecondary }}>
//               By voucher
//             </Text>
//           </Pressable>
//         </View>

//         {tab === 'amount' ? (
//           <View className="gap-4">
//             {rechargeError ? (
//               <View className="rounded-xl bg-destructive/10 p-3">
//                 <Text className="text-sm text-destructive">{getApiErrorMessage(rechargeError)}</Text>
//               </View>
//             ) : null}
//             <Controller
//               control={amountForm.control}
//               name="amount"
//               render={({ field }) => (
//                 <TextField label="Amount (RWF)" placeholder="1000" keyboardType="number-pad" leftIcon="dollar-sign" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.amount?.message} />
//               )}
//             />
//             <Controller
//               control={amountForm.control}
//               name="nationalId"
//               render={({ field }) => (
//                 <TextField label="National ID" leftIcon="credit-card" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.nationalId?.message} />
//               )}
//             />
//             <Controller
//               control={amountForm.control}
//               name="approvalNo"
//               render={({ field }) => (
//                 <TextField label="Mobile money approval no." leftIcon="hash" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.approvalNo?.message} />
//               )}
//             />
//             <Button onPress={amountForm.handleSubmit(onSubmitAmount)} loading={recharging}>
//               Continue
//             </Button>
//           </View>
//         ) : (
//           <View className="gap-4">
//             {voucherError ? (
//               <View className="rounded-xl bg-destructive/10 p-3">
//                 <Text className="text-sm text-destructive">{getApiErrorMessage(voucherError)}</Text>
//               </View>
//             ) : null}
//             {voucherOutcome ? (
//               <View className="rounded-xl bg-success/10 p-3">
//                 <Text className="text-sm text-success">{voucherOutcome.ktrnMessage || 'Voucher recharge successful.'}</Text>
//               </View>
//             ) : null}
//             <Controller
//               control={voucherForm.control}
//               name="voucherNumber"
//               render={({ field }) => (
//                 <TextField label="Voucher number" leftIcon="tag" value={field.value} onChangeText={field.onChange} error={voucherForm.formState.errors.voucherNumber?.message} />
//               )}
//             />
//             <Button onPress={voucherForm.handleSubmit(onSubmitVoucher)} loading={voucherLoading}>
//               Recharge
//             </Button>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { AuthScreen } from "@/components/ui/auth-screen";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Colors, HeroGradient } from "@/constants/theme";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import { MOCK_MSISDN, mockTransactionResult } from "@/lib/mock-data";
import { useAppSelector } from "@/store/hooks";
import {
  useRechargeByVoucherMutation,
  useRechargeMutation,
} from "@/store/selfCareApi";

const amountSchema = z.object({
  nationalId: z.string().min(1, "Enter your national ID"),
  approvalNo: z.string().min(1, "Enter the mobile money approval number"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
});
type AmountValues = z.infer<typeof amountSchema>;

const voucherSchema = z.object({
  voucherNumber: z.string().min(4, "Enter a valid voucher number"),
});
type VoucherValues = z.infer<typeof voucherSchema>;

const QUICK_AMOUNTS = ["500", "1000", "2000", "5000", "10000"];

function Segment({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 44,
        borderRadius: 22,
        backgroundColor: active ? Colors.white : "transparent",
        elevation: active ? 2 : 0,
        shadowColor: "#000",
        shadowOpacity: active ? 0.08 : 0,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Feather
        name={icon}
        size={16}
        color={active ? Colors.primary : Colors.gray3}
      />
      <Text
        style={{ color: active ? Colors.primary : Colors.textSecondary }}
        className="font-semibold"
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Banner({ ok, text }: { ok: boolean; text: string }) {
  const tone = ok ? Colors.success : Colors.error;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 14,
        backgroundColor: tone + "14",
      }}
    >
      <Feather
        name={ok ? "check-circle" : "alert-circle"}
        size={18}
        color={tone}
      />
      <Text style={{ color: tone }} className="flex-1 text-sm font-medium">
        {text}
      </Text>
    </View>
  );
}

export default function Recharge() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? (USE_MOCK ? MOCK_MSISDN : "");
  const [tab, setTab] = useState<"amount" | "voucher">("amount");
  const [isMockRecharging, setIsMockRecharging] = useState(false);
  const [isMockVoucherLoading, setIsMockVoucherLoading] = useState(false);
  const [mockVoucherResult, setMockVoucherResult] = useState<ReturnType<
    typeof mockTransactionResult
  > | null>(null);

  const [recharge, { isLoading: isRecharging, error: rechargeError }] =
    useRechargeMutation();
  const [
    rechargeByVoucher,
    { isLoading: isVoucherLoading, error: voucherError, data: voucherResult },
  ] = useRechargeByVoucherMutation();

  const amountForm = useForm<AmountValues>({
    resolver: zodResolver(amountSchema),
    defaultValues: { nationalId: "", approvalNo: "", amount: "" },
  });
  const voucherForm = useForm<VoucherValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: { voucherNumber: "" },
  });
  const selectedAmount = amountForm.watch("amount");

  async function onSubmitAmount(values: AmountValues) {
    try {
      if (USE_MOCK) {
        setIsMockRecharging(true);
        const result = mockTransactionResult("OTP_PENDING");
        setIsMockRecharging(false);
        router.replace({
          pathname: "/otp-verify",
          params: {
            transactionId: result.transactionId,
            msisdn,
            description: `Recharge RWF ${values.amount}`,
          },
        });
        return;
      }
      const result = await recharge({ msisdn, ...values }).unwrap();
      if (result.status === "OTP_PENDING") {
        router.replace({
          pathname: "/otp-verify",
          params: {
            transactionId: result.transactionId,
            msisdn,
            description: `Recharge RWF ${values.amount}`,
          },
        });
      }
    } catch {
      // surfaced via rechargeError below
    }
  }

  async function onSubmitVoucher(values: VoucherValues) {
    try {
      if (USE_MOCK) {
        setIsMockVoucherLoading(true);
        setMockVoucherResult(mockTransactionResult("SUCCESS"));
        setIsMockVoucherLoading(false);
        return;
      }
      await rechargeByVoucher({ msisdn, ...values }).unwrap();
    } catch {
      // surfaced via voucherError below
    }
  }

  const recharging = USE_MOCK ? isMockRecharging : isRecharging;
  const voucherLoading = USE_MOCK ? isMockVoucherLoading : isVoucherLoading;
  const voucherOutcome = USE_MOCK ? mockVoucherResult : voucherResult;

  return (
    <AuthScreen
      title="Recharge"
      subtitle="Top up your airtime with mobile money or a voucher."
    >
      {/* Number card */}
      <LinearGradient
        colors={HeroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: "rgba(255,255,255,0.22)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="smartphone" size={22} color={Colors.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "rgba(255,255,255,0.8)" }} className="text-xs">
            Recharging
          </Text>
          <Text
            style={{ color: Colors.white }}
            className="text-lg font-bold"
            numberOfLines={1}
          >
            {msisdn || "—"}
          </Text>
        </View>
      </LinearGradient>

      {/* Segmented switch */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 22,
          padding: 4,
          borderRadius: 26,
          backgroundColor: "#F1F1F4",
        }}
      >
        <Segment
          active={tab === "amount"}
          icon="credit-card"
          label="By amount"
          onPress={() => setTab("amount")}
        />
        <Segment
          active={tab === "voucher"}
          icon="tag"
          label="By voucher"
          onPress={() => setTab("voucher")}
        />
      </View>

      {tab === "amount" ? (
        <View style={{ gap: 18, marginTop: 22 }}>
          {rechargeError ? (
            <Banner ok={false} text={getApiErrorMessage(rechargeError)} />
          ) : null}

          <View style={{ gap: 10 }}>
            <Text className="ml-1 text-sm font-medium text-foreground">
              Quick amount
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {QUICK_AMOUNTS.map((value) => {
                const selected = selectedAmount === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() =>
                      amountForm.setValue("amount", value, {
                        shouldValidate: true,
                      })
                    }
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 999,
                      borderWidth: 1.5,
                      borderColor: selected ? Colors.primary : Colors.gray5,
                      backgroundColor: selected
                        ? Colors.primary + "14"
                        : Colors.white,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? Colors.primary : Colors.textPrimary,
                      }}
                      className="font-semibold"
                    >
                      {Number(value).toLocaleString()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Controller
            control={amountForm.control}
            name="amount"
            render={({ field }) => (
              <Field
                label="Amount (RWF)"
                placeholder="1000"
                keyboardType="number-pad"
                icon="dollar-sign"
                value={field.value}
                onChangeText={field.onChange}
                error={amountForm.formState.errors.amount?.message}
              />
            )}
          />
          <Controller
            control={amountForm.control}
            name="nationalId"
            render={({ field }) => (
              <Field
                label="National ID"
                icon="credit-card"
                value={field.value}
                onChangeText={field.onChange}
                error={amountForm.formState.errors.nationalId?.message}
              />
            )}
          />
          <Controller
            control={amountForm.control}
            name="approvalNo"
            render={({ field }) => (
              <Field
                label="Mobile money approval no."
                icon="hash"
                hint="The approval number from your mobile money confirmation SMS."
                value={field.value}
                onChangeText={field.onChange}
                error={amountForm.formState.errors.approvalNo?.message}
              />
            )}
          />

          <View className="mt-2">
            <Button
              onPress={amountForm.handleSubmit(onSubmitAmount)}
              loading={recharging}
            >
              Continue
            </Button>
          </View>
        </View>
      ) : (
        <View style={{ gap: 18, marginTop: 22 }}>
          {voucherError ? (
            <Banner ok={false} text={getApiErrorMessage(voucherError)} />
          ) : null}
          {voucherOutcome ? (
            <Banner
              ok
              text={
                voucherOutcome.ktrnMessage || "Voucher recharge successful."
              }
            />
          ) : null}

          <Controller
            control={voucherForm.control}
            name="voucherNumber"
            render={({ field }) => (
              <Field
                label="Voucher number"
                placeholder="Enter the code on your voucher"
                keyboardType="number-pad"
                icon="tag"
                value={field.value}
                onChangeText={field.onChange}
                error={voucherForm.formState.errors.voucherNumber?.message}
              />
            )}
          />

          <View className="mt-2">
            <Button
              onPress={voucherForm.handleSubmit(onSubmitVoucher)}
              loading={voucherLoading}
            >
              Recharge
            </Button>
          </View>
        </View>
      )}
    </AuthScreen>
  );
}
