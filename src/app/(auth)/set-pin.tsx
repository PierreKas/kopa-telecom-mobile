import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { KopaIcon } from '@/components/brand/kopa-logo';
import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { USE_MOCK } from '@/lib/mock-config';
import { useSetPinMutation } from '@/store/identityApi';

const schema = z
  .object({
    pin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
    confirmPin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
  })
  .refine((data) => data.pin === data.confirmPin, { message: 'PINs do not match', path: ['confirmPin'] });
type FormValues = z.infer<typeof schema>;

/** Reached right after /registration/activate, which already issues a session token — this is
 *  an authenticated call even though no PIN has ever been set yet (AuthService.setPin javadoc). */
export default function SetPin() {
  const [setPin, { isLoading, error }] = useSetPinMutation();
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { pin: '', confirmPin: '' } });

  async function onSubmit(values: FormValues) {
    try {
      if (USE_MOCK) {
        setIsMockSubmitting(true);
        setIsMockSubmitting(false);
        router.replace('/(app)/home');
        return;
      }
      await setPin({ pin: values.pin }).unwrap();
      router.replace('/(app)/home');
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  const submitting = USE_MOCK ? isMockSubmitting : isLoading;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-accent">
            <KopaIcon size={44} />
          </View>
          <Text className="mb-1 text-2xl font-bold text-foreground">Set up your PIN</Text>
          <Text className="text-center text-base text-muted-foreground">
            Your 6-digit PIN protects your account and confirms recharges and purchases.
          </Text>
        </View>

        {error ? (
          <View className="mb-4 rounded-xl bg-destructive/10 p-3">
            <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
          </View>
        ) : null}

        <View className="gap-6">
          <Controller
            control={control}
            name="pin"
            render={({ field }) => (
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-foreground">Choose a 6-digit PIN</Text>
                <PinInput value={field.value} onChange={field.onChange} error={errors.pin?.message} autoFocus />
              </View>
            )}
          />
          <Controller
            control={control}
            name="confirmPin"
            render={({ field }) => (
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-foreground">Confirm PIN</Text>
                <PinInput value={field.value} onChange={field.onChange} error={errors.confirmPin?.message} />
              </View>
            )}
          />
        </View>

        <View className="mt-8">
          <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
            Continue
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
