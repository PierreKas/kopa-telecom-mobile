import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Colors } from "@/constants/theme";

export function OtpInput({
  value,
  onChange,
  length = 6,
  secure = true,
  autoFocus,
  error,
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  /** true shows dots (PINs), false shows the digits (SMS codes). */
  secure?: boolean;
  autoFocus?: boolean;
  error?: string;
}) {
  const ref = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <Pressable
        onPress={() => ref.current?.focus()}
        style={{ flexDirection: "row", gap: 8, justifyContent: "center" }}
      >
        {Array.from({ length }).map((_, i) => {
          const char = value[i];
          const active = focused && i === activeIndex;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                maxWidth: 56,
                aspectRatio: 1,
                borderRadius: 999,
                backgroundColor: "#F4F4F6",
                borderWidth: 1.5,
                borderColor: error
                  ? Colors.error
                  : active
                    ? Colors.primary
                    : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: char ? Colors.textPrimary : Colors.gray4,
                }}
              >
                {char ? (secure ? "•" : char) : "-"}
              </Text>
            </View>
          );
        })}
      </Pressable>

      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
        textContentType="oneTimeCode"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
      />

      {error ? (
        <Text className="mt-3 text-center text-xs text-destructive">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function ResendCode({
  onResend,
  seconds = 30,
}: {
  onResend: () => void;
  seconds?: number;
}) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return (
    <View style={{ alignItems: "center", marginTop: 24 }}>
      <Text className="text-sm text-muted-foreground">
        {"Didn't receive the code?"}
      </Text>
      {left > 0 ? (
        <Text className="mt-1 text-sm text-muted-foreground">
          Resend in {left}s
        </Text>
      ) : (
        <Pressable
          hitSlop={8}
          onPress={() => {
            onResend();
            setLeft(seconds);
          }}
        >
          <Text
            style={{ color: Colors.primary, textDecorationLine: "underline" }}
            className="mt-1 text-sm font-semibold"
          >
            Resend code
          </Text>
        </Pressable>
      )}
    </View>
  );
}
