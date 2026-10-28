import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { Colors } from "@/constants/theme";

export function Field({
  label,
  icon,
  error,
  hint,
  onFocus,
  onBlur,
  ...props
}: TextInputProps & {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  error?: string;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  const border = error ? Colors.error : focused ? Colors.primary : Colors.gray5;

  return (
    <View style={{ gap: 6 }}>
      <Text className="ml-1 text-sm font-medium text-foreground">{label}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          height: 56,
          paddingHorizontal: 16,
          borderRadius: 18,
          borderWidth: 1.5,
          borderColor: border,
          backgroundColor: Colors.white,
        }}
      >
        {icon ? (
          <Feather
            name={icon}
            size={18}
            color={focused ? Colors.primary : Colors.gray3}
          />
        ) : null}
        <TextInput
          {...props}
          placeholderTextColor="#9CA3AF"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontSize: 16,
            color: Colors.textPrimary,
            paddingVertical: 0,
          }}
        />
      </View>
      {error ? (
        <Text className="ml-1 text-xs text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="ml-1 text-xs text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
}
