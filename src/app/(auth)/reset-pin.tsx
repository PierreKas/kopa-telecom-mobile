import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

import { AuthScreen } from "@/components/ui/auth-screen";
import { Button } from "@/components/ui/button";
import { OtpInput, ResendCode } from "@/components/ui/otp-input";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import { useConfirmPinResetMutation } from "@/store/identityApi";

const schema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
});
type FormValues = z.infer<typeof schema>;

export default function ResetPin() {
  const { msisdn } = useLocalSearchParams<{ msisdn: string }>();
  const [confirmReset, { isLoading, error }] = useConfirmPinResetMutation();
  const [isMockSubmitting, setIsMockSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", newPin: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      if (USE_MOCK) {
        setIsMockSubmitting(true);
        setIsMockSubmitting(false);
        router.replace("/(auth)/login-step1");
        return;
      }
      await confirmReset({ msisdn: msisdn ?? "", ...values }).unwrap();
      router.replace("/(auth)/login-step1");
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  const submitting = USE_MOCK ? isMockSubmitting : isLoading;
  return (
    <AuthScreen
      title="Verify code"
      subtitle={`We sent a 6-digit code to ${msisdn}. It expires in 5 minutes.`}
    >
      {error ? (
        <View className="mb-5 rounded-xl bg-destructive/10 p-3">
          <Text className="text-center text-sm text-destructive">
            {getApiErrorMessage(error)}
          </Text>
        </View>
      ) : null}

      <View style={{ gap: 12 }}>
        <Text className="text-center text-sm font-medium text-foreground">
          Verification code
        </Text>
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              secure={false}
              error={errors.code?.message}
              autoFocus
            />
          )}
        />
        <ResendCode
          onResend={() => {
            /* TODO: call the "request reset" mutation again */
          }}
        />
      </View>

      <View style={{ gap: 12, marginTop: 28 }}>
        <Text className="text-center text-sm font-medium text-foreground">
          New 6-digit PIN
        </Text>
        <Controller
          control={control}
          name="newPin"
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              error={errors.newPin?.message}
            />
          )}
        />
      </View>

      <View className="mt-8">
        <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
          Reset PIN
        </Button>
      </View>
    </AuthScreen>
  );

  // return (
  //   <SafeAreaView className="flex-1 bg-background">
  //     <View className="flex-row items-center px-4 py-3">
  //       <Pressable onPress={() => router.back()} hitSlop={8}>
  //         <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
  //       </Pressable>
  //     </View>

  //     <View className="flex-1 px-6 pt-4">
  //       <Text className="mb-1 text-2xl font-bold text-foreground">Enter verification code</Text>
  //       <Text className="mb-8 text-base text-muted-foreground">We sent a 6-digit code to {msisdn}. It expires in 5 minutes.</Text>

  //       {error ? (
  //         <View className="mb-4 rounded-xl bg-destructive/10 p-3">
  //           <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
  //         </View>
  //       ) : null}

  //       <View className="gap-6">
  //         <Controller
  //           control={control}
  //           name="code"
  //           render={({ field }) => (
  //             <View className="gap-1.5">
  //               <Text className="text-sm font-medium text-foreground">Verification code</Text>
  //               <PinInput value={field.value} onChange={field.onChange} secure={false} error={errors.code?.message} autoFocus />
  //             </View>
  //           )}
  //         />

  //         <Controller
  //           control={control}
  //           name="newPin"
  //           render={({ field }) => (
  //             <View className="gap-1.5">
  //               <Text className="text-sm font-medium text-foreground">New 6-digit PIN</Text>
  //               <PinInput value={field.value} onChange={field.onChange} error={errors.newPin?.message} />
  //             </View>
  //           )}
  //         />
  //       </View>

  //       <View className="mt-8">
  //         <Button onPress={handleSubmit(onSubmit)} loading={submitting}>
  //           Reset PIN
  //         </Button>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );
}
