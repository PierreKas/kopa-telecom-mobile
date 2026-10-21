import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
}

/** Labeled TextInput + inline error — pair with react-hook-form's `Controller` (RN's TextInput
 *  isn't a plain `<input>`, so `register()` doesn't apply here). A `secureTextEntry` caller gets
 *  a visibility eye-toggle for free. */
export function TextField({
  label,
  error,
  className,
  secureTextEntry,
  leftIcon,
  ...inputProps
}: TextFieldProps & { className?: string }) {
  const [visible, setVisible] = useState(false);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center rounded-lg border  px-4 ${error ? "border-destructive" : "border-border"}`}
      >
        {leftIcon ? (
          <Feather
            name={leftIcon}
            size={18}
            color="#636E72"
            style={{ marginRight: 10 }}
          />
        ) : null}
        <TextInput
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !visible}
          className={`flex-1 py-3.5 text-base text-foreground ${className ?? ""}`}
          {...inputProps}
        />
        {isPassword && (
          <Pressable
            onPress={() => setVisible((current) => !current)}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Feather
              name={visible ? "eye-off" : "eye"}
              size={18}
              color="#636E72"
            />
          </Pressable>
        )}
      </View>
      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
    </View>
  );
}
