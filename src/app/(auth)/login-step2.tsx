import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { KopaWordmark } from "@/components/brand/kopa-logo";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/ui/pin-input";
import { getApiErrorMessage } from "@/lib/api-error-message";
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
      /////I comment this just to test as the backen is not yet ready.
      // const response = await login({ msisdn, pin: values.pin }).unwrap();
      // dispatch(sessionEstablished(response));
      router.replace("/(app)/home");
    } catch {
      // error state already reflected via the `error` returned from the mutation hook
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-3 items-start">
            <KopaWordmark width={150} />
          </View>

          {/* <Text className="mb-8 text-2xl font-bold text-foreground">
            Enter your 6-digit PIN
          </Text> */}
          <Text className="mb-8 text-xl text-muted-foreground">
            Enter your 6-digit PIN
          </Text>

          {error ? (
            <View className="mb-4 rounded-xl bg-destructive/10 p-3">
              <Text className="text-sm text-destructive">
                {getApiErrorMessage(error)}
              </Text>
            </View>
          ) : null}

          <View className="gap-5">
            {/* <Controller
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
            /> */}

            <Controller
              control={control}
              name="pin"
              render={({ field }) => (
                <View className="gap-1.5">
                  {/* <Text className="text-sm font-medium text-foreground">
                    6-digit PIN
                  </Text> */}
                  <PinInput
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.pin?.message}
                  />
                </View>
              )}
            />

            <Link
              href="/(auth)/forgot-pin"
              className="self-end text-sm font-medium text-primary"
            >
              Forgot PIN?
            </Link>

            <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
              Login
            </Button>
          </View>

          {/* <View className="mt-8 flex-row justify-center gap-1">
            <Text className="text-muted-foreground">New to Kopa?</Text>
            <Link
              href="/(auth)/register"
              className="font-semibold text-primary"
            >
              Create an account
            </Link>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
