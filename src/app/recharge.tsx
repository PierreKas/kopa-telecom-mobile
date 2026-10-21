import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { useRechargeByVoucherMutation, useRechargeMutation } from '@/store/selfCareApi';

const amountSchema = z.object({
  nationalId: z.string().min(1, 'Enter your national ID'),
  approvalNo: z.string().min(1, 'Enter the mobile money approval number'),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
});
type AmountValues = z.infer<typeof amountSchema>;

const voucherSchema = z.object({ voucherNumber: z.string().min(4, 'Enter a valid voucher number') });
type VoucherValues = z.infer<typeof voucherSchema>;

export default function Recharge() {
  const session = useAppSelector((state) => state.auth.session);
  const msisdn = session?.msisdn ?? '';
  const [tab, setTab] = useState<'amount' | 'voucher'>('amount');

  const [recharge, { isLoading: isRecharging, error: rechargeError }] = useRechargeMutation();
  const [rechargeByVoucher, { isLoading: isVoucherLoading, error: voucherError, data: voucherResult }] = useRechargeByVoucherMutation();

  const amountForm = useForm<AmountValues>({ resolver: zodResolver(amountSchema), defaultValues: { nationalId: '', approvalNo: '', amount: '' } });
  const voucherForm = useForm<VoucherValues>({ resolver: zodResolver(voucherSchema), defaultValues: { voucherNumber: '' } });

  async function onSubmitAmount(values: AmountValues) {
    try {
      const result = await recharge({ msisdn, ...values }).unwrap();
      if (result.status === 'OTP_PENDING') {
        router.replace({ pathname: '/otp-verify', params: { transactionId: result.transactionId, msisdn, description: `Recharge RWF ${values.amount}` } });
      }
    } catch {
      // surfaced via rechargeError below
    }
  }

  async function onSubmitVoucher(values: VoucherValues) {
    try {
      await rechargeByVoucher({ msisdn, ...values }).unwrap();
    } catch {
      // surfaced via voucherError below
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="x" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View className="px-6">
        <Text className="mb-1 text-2xl font-bold text-foreground">Recharge</Text>
        <Text className="mb-6 text-base text-muted-foreground">Top up {msisdn}</Text>

        <View className="mb-6 flex-row rounded-full bg-muted/50 p-1">
          <Pressable onPress={() => setTab('amount')} className="flex-1 rounded-full py-2.5" style={{ backgroundColor: tab === 'amount' ? Colors.primary : 'transparent' }}>
            <Text className="text-center font-medium" style={{ color: tab === 'amount' ? Colors.white : Colors.textSecondary }}>
              By amount
            </Text>
          </Pressable>
          <Pressable onPress={() => setTab('voucher')} className="flex-1 rounded-full py-2.5" style={{ backgroundColor: tab === 'voucher' ? Colors.primary : 'transparent' }}>
            <Text className="text-center font-medium" style={{ color: tab === 'voucher' ? Colors.white : Colors.textSecondary }}>
              By voucher
            </Text>
          </Pressable>
        </View>

        {tab === 'amount' ? (
          <View className="gap-4">
            {rechargeError ? (
              <View className="rounded-xl bg-destructive/10 p-3">
                <Text className="text-sm text-destructive">{getApiErrorMessage(rechargeError)}</Text>
              </View>
            ) : null}
            <Controller
              control={amountForm.control}
              name="amount"
              render={({ field }) => (
                <TextField label="Amount (RWF)" placeholder="1000" keyboardType="number-pad" leftIcon="dollar-sign" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.amount?.message} />
              )}
            />
            <Controller
              control={amountForm.control}
              name="nationalId"
              render={({ field }) => (
                <TextField label="National ID" leftIcon="credit-card" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.nationalId?.message} />
              )}
            />
            <Controller
              control={amountForm.control}
              name="approvalNo"
              render={({ field }) => (
                <TextField label="Mobile money approval no." leftIcon="hash" value={field.value} onChangeText={field.onChange} error={amountForm.formState.errors.approvalNo?.message} />
              )}
            />
            <Button onPress={amountForm.handleSubmit(onSubmitAmount)} loading={isRecharging}>
              Continue
            </Button>
          </View>
        ) : (
          <View className="gap-4">
            {voucherError ? (
              <View className="rounded-xl bg-destructive/10 p-3">
                <Text className="text-sm text-destructive">{getApiErrorMessage(voucherError)}</Text>
              </View>
            ) : null}
            {voucherResult ? (
              <View className="rounded-xl bg-success/10 p-3">
                <Text className="text-sm text-success">{voucherResult.ktrnMessage || 'Voucher recharge successful.'}</Text>
              </View>
            ) : null}
            <Controller
              control={voucherForm.control}
              name="voucherNumber"
              render={({ field }) => (
                <TextField label="Voucher number" leftIcon="tag" value={field.value} onChangeText={field.onChange} error={voucherForm.formState.errors.voucherNumber?.message} />
              )}
            />
            <Button onPress={voucherForm.handleSubmit(onSubmitVoucher)} loading={isVoucherLoading}>
              Recharge
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
