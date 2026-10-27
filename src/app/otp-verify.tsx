import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { USE_MOCK } from '@/lib/mock-config';
import { mockTransactionResult } from '@/lib/mock-data';
import { useVerifyTransactionOtpMutation } from '@/store/selfCareApi';

/** Shared confirm step for every OTP-gated transaction (recharge-by-amount, bundle purchase) -
 *  FR-04. The initiating screen already created the pending transaction and triggered the SMS;
 *  this just verifies the code and shows the outcome. */
export default function OtpVerify() {
  const { transactionId, msisdn, description } = useLocalSearchParams<{ transactionId: string; msisdn: string; description?: string }>();
  const [code, setCode] = useState('');
  const [verify, { isLoading, error, data }] = useVerifyTransactionOtpMutation();
  const [mockResult, setMockResult] = useState<ReturnType<typeof mockTransactionResult> | null>(null);
  const [isMockVerifying, setIsMockVerifying] = useState(false);

  async function handleVerify() {
    if (code.length !== 6) return;
    if (USE_MOCK) {
      setIsMockVerifying(true);
      setMockResult(mockTransactionResult('SUCCESS'));
      setIsMockVerifying(false);
      return;
    }
    try {
      await verify({ transactionId, msisdn, code }).unwrap();
    } catch {
      // surfaced via `error` below
    }
  }

  const outcome = USE_MOCK ? mockResult : data;
  const verifying = USE_MOCK ? isMockVerifying : isLoading;

  if (outcome) {
    const success = outcome.status === 'SUCCESS';
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-8">
        <View className={`mb-5 h-20 w-20 items-center justify-center rounded-full ${success ? 'bg-success/15' : 'bg-destructive/15'}`}>
          <Feather name={success ? 'check' : 'x'} size={40} color={success ? Colors.success : Colors.error} />
        </View>
        <Text className="mb-2 text-center text-2xl font-bold text-foreground">{success ? 'All set!' : 'Transaction failed'}</Text>
        <Text className="mb-8 text-center text-base text-muted-foreground">{outcome.ktrnMessage || outcome.message || outcome.result || (success ? 'Your transaction was completed successfully.' : 'Please try again.')}</Text>
        <Button onPress={() => router.replace('/(app)/home')}>Back to home</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="x" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4">
        <Text className="mb-1 text-2xl font-bold text-foreground">Confirm with your PIN</Text>
        <Text className="mb-8 text-base text-muted-foreground">
          {description ? `${description}. ` : ''}Enter the 6-digit code we texted to {msisdn}.
        </Text>

        {error ? (
          <View className="mb-4 rounded-xl bg-destructive/10 p-3">
            <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
          </View>
        ) : null}

        <PinInput value={code} onChange={setCode} secure={false} autoFocus />

        <View className="mt-8">
          <Button onPress={handleVerify} loading={verifying} disabled={code.length !== 6}>
            Confirm
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
