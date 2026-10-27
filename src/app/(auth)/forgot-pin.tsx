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
import { USE_MOCK } from '@/lib/mock-config';
import { useRequestPinResetMutation } from '@/store/identityApi';

const schema = z.object({ msisdn: z.string().regex(/^\d{6,15}$/, 'Enter a valid phone number') });
type FormValues = z.infer<typeof schema>;

export default function ForgotPin() {
  const [requestReset, { isLoading, error }] = useRequestPinResetMutation();
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { msisdn: '' } });

  async function onSubmit(values: FormValues) {
    try {
      if (USE_MOCK) {
        setIsMockSubmitting(true);
        setIsMockSubmitting(false);
        router.push({ pathname: '/(auth)/reset-pin', params: { msisdn: values.msisdn } });
        return;
      }
      await requestReset(values).unwrap();
      router.push({ pathname: '/(auth)/reset-pin', params: { msisdn: values.msisdn } });
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  const submitting = USE_MOCK ? isMockSubmitting : isLoading;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View className="flex-1 px-6 pt-4">
        <Text className="mb-1 text-2xl font-bold text-foreground">Forgot your PIN?</Text>
        <Text className="mb-8 text-base text-muted-foreground">
          Enter the phone number on your account and we&apos;ll text you a verification code.
        </Text>

        {error ? (
          <View className="mb-4 rounded-xl bg-destructive/10 p-3">
            <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
          </View>
        ) : null}

        <Controller
          control={control}
          name="msisdn"
          render={({ field }) => (
            <TextField
              label="Phone number"
              placeholder="0771234567"
              keyboardType="phone-pad"
              leftIcon="smartphone"
              value={field.value}
              onChangeText={field.onChange}
              error={errors.msisdn?.message}
            />
          )}
        />

        <View className="mt-8">
          <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
            Send code
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
