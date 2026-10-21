import { Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";

/**
 * 6-box PIN/OTP entry. A single hidden TextInput drives all 6 boxes — simpler and more reliable
 * than wiring 6 separate inputs with manual focus-advance, and it's what the OS autofill
 * suggestion bar (SMS OTP autofill) expects to type into on both platforms.
 */
export function PinInput({
  value,
  onChange,
  length = 6,
  secure = true,
  error,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  secure?: boolean;
  error?: string;
  autoFocus?: boolean;
}) {
  const digits = value.split("");

  return (
    <View className="gap-2">
      <View className="relative flex-row justify-between">
        {Array.from({ length }).map((_, index) => {
          const filled = index < digits.length;
          const isActive = index === digits.length;
          return (
            <View
              key={index}
              className="h-14 w-12 items-center justify-center rounded-xl border "
              style={{
                borderColor: error
                  ? Colors.error
                  : isActive
                    ? Colors.primary
                    : "#DDD6FE",
              }}
            >
              <Text className="text-xl font-semibold text-foreground">
                {filled ? (secure ? "•" : digits[index]) : ""}
              </Text>
            </View>
          );
        })}
        <TextInput
          value={value}
          onChangeText={(text) =>
            onChange(text.replace(/\D/g, "").slice(0, length))
          }
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus}
          textContentType="oneTimeCode"
          className="absolute inset-0 opacity-0"
        />
      </View>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
