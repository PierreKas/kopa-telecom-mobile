import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { AuthScreen } from "@/components/ui/auth-screen";
import { Button } from "@/components/ui/button";
import { KopaLoader } from "@/components/ui/kopa-loader";
import { OtpInput } from "@/components/ui/otp-input";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import { MOCK_LOGIN_RESPONSE } from "@/lib/mock-data";
import { sessionEstablished } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useLoginMutation } from "@/store/identityApi";

const schema = z.object({
  // msisdn: z.string().regex(/^\d{6,15}$/, "Enter a valid phone number"),
  pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [isMockLoggingIn, setIsMockLoggingIn] = useState(false);
  const { msisdn } = useLocalSearchParams<{ msisdn: string }>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { pin: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      // if (USE_MOCK) {
      //   setIsMockLoggingIn(true);
      //   dispatch(
      //     sessionEstablished({
      //       ...MOCK_LOGIN_RESPONSE,
      //       msisdn: msisdn ?? MOCK_LOGIN_RESPONSE.msisdn,
      //     }),
      //   );
      //   setIsMockLoggingIn(false);
      //   router.replace("/(app)/home");
      //   return;
      // }
      if (USE_MOCK) {
        setIsMockLoggingIn(true);
        await new Promise((resolve) => setTimeout(resolve, 2500)); // simulates the API call
        dispatch(
          sessionEstablished({
            ...MOCK_LOGIN_RESPONSE,
            msisdn: msisdn ?? MOCK_LOGIN_RESPONSE.msisdn,
          }),
        );
        setIsMockLoggingIn(false);
        router.replace("/(app)/home");
        return;
      }
      const response = await login({ msisdn, pin: values.pin }).unwrap();
      dispatch(sessionEstablished(response));
      router.replace("/(app)/home");
    } catch {
      // error state already reflected via the `error` returned from the mutation hook
    }
  }

  const loggingIn = USE_MOCK ? isMockLoggingIn : isLoading;
  return (
    <AuthScreen
      title="Enter your PIN"
      subtitle={`Welcome back, ${msisdn ?? ""}`}
    >
      {error ? (
        <View className="mb-5 rounded-xl bg-destructive/10 p-3">
          <Text className="text-center text-sm text-destructive">
            {getApiErrorMessage(error)}
          </Text>
        </View>
      ) : null}

      <Controller
        control={control}
        name="pin"
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            error={errors.pin?.message}
            autoFocus
          />
        )}
      />

      <Pressable
        onPress={() => router.push("/(auth)/forgot-pin")}
        hitSlop={8}
        style={{ alignSelf: "center", marginTop: 24 }}
      >
        <Text
          className="text-sm font-semibold text-primary"
          style={{ textDecorationLine: "underline" }}
        >
          Forgot PIN?
        </Text>
      </Pressable>

      <View className="mt-8">
        <Button onPress={handleSubmit(onSubmit)} loading={loggingIn}>
          Login
        </Button>
      </View>

      <KopaLoader visible={loggingIn} />
    </AuthScreen>
  );

  // return (
  //   <SafeAreaView className="flex-1 bg-background">
  //     <KeyboardAvoidingView
  //       behavior={Platform.OS === "ios" ? "padding" : undefined}
  //       className="flex-1"
  //     >
  //       <ScrollView
  //         contentContainerClassName="flex-1 justify-center px-6 py-10"
  //         keyboardShouldPersistTaps="handled"
  //       >
  //         <View className="mb-3 items-start">
  //           <KopaWordmark width={150} />
  //         </View>

  //         {/* <Text className="mb-8 text-2xl font-bold text-foreground">
  //           Enter your 6-digit PIN
  //         </Text> */}
  //         <Text className="mb-8 text-xl text-muted-foreground">
  //           Enter your 6-digit PIN
  //         </Text>

  //         {error ? (
  //           <View className="mb-4 rounded-xl bg-destructive/10 p-3">
  //             <Text className="text-sm text-destructive">
  //               {getApiErrorMessage(error)}
  //             </Text>
  //           </View>
  //         ) : null}

  //         <View className="gap-5">
  //           {/* <Controller
  //             control={control}
  //             name="msisdn"
  //             render={({ field }) => (
  //               <TextField
  //                 label="Phone number"
  //                 placeholder="0771234567"
  //                 keyboardType="phone-pad"
  //                 leftIcon="smartphone"
  //                 value={field.value}
  //                 onChangeText={field.onChange}
  //                 error={errors.msisdn?.message}
  //               />
  //             )}
  //           /> */}

  //           <Controller
  //             control={control}
  //             name="pin"
  //             render={({ field }) => (
  //               <View className="gap-1.5">
  //                 {/* <Text className="text-sm font-medium text-foreground">
  //                   6-digit PIN
  //                 </Text> */}
  //                 <PinInput
  //                   value={field.value}
  //                   onChange={field.onChange}
  //                   error={errors.pin?.message}
  //                 />
  //               </View>
  //             )}
  //           />

  //           <Link
  //             href="/(auth)/forgot-pin"
  //             className="self-end text-sm font-medium text-primary"
  //           >
  //             Forgot PIN?
  //           </Link>

  //           <Button onPress={handleSubmit(onSubmit)} loading={loggingIn}>
  //             Login
  //           </Button>
  //         </View>

  //         {/* <View className="mt-8 flex-row justify-center gap-1">
  //           <Text className="text-muted-foreground">New to Kopa?</Text>
  //           <Link
  //             href="/(auth)/register"
  //             className="font-semibold text-primary"
  //           >
  //             Create an account
  //           </Link>
  //         </View> */}
  //       </ScrollView>
  //     </KeyboardAvoidingView>
  //   </SafeAreaView>
  // );
}
