import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { USE_MOCK } from '@/lib/mock-config';
import { useChangePinMutation } from '@/store/identityApi';

const schema = z.object({
  currentPin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
  newPin: z.string().regex(/^\d{6}$/, 'PIN must be exactly 6 digits'),
});
type FormValues = z.infer<typeof schema>;

export default function PinChange() {
  const [changePin, { isLoading, error }] = useChangePinMutation();
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { currentPin: '', newPin: '' } });

  async function onSubmit(values: FormValues) {
    try {
      if (USE_MOCK) {
        setIsMockSubmitting(true);
        setIsMockSubmitting(false);
        router.back();
        return;
      }
      await changePin(values).unwrap();
      router.back();
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  const submitting = USE_MOCK ? isMockSubmitting : isLoading;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="x" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4">
        <Text className="mb-1 text-2xl font-bold text-foreground">Change PIN</Text>
        <Text className="mb-8 text-base text-muted-foreground">Enter your current PIN, then choose a new one.</Text>

        {error ? (
          <View className="mb-4 rounded-xl bg-destructive/10 p-3">
            <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
          </View>
        ) : null}

        <View className="gap-6">
          <Controller
            control={control}
            name="currentPin"
            render={({ field }) => (
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-foreground">Current PIN</Text>
                <PinInput value={field.value} onChange={field.onChange} error={errors.currentPin?.message} autoFocus />
              </View>
            )}
          />
          <Controller
            control={control}
            name="newPin"
            render={({ field }) => (
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-foreground">New PIN</Text>
                <PinInput value={field.value} onChange={field.onChange} error={errors.newPin?.message} />
              </View>
            )}
          />
        </View>

        <View className="mt-8">
          <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
            Update PIN
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
