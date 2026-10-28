import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

export function AuthScreen({
  title,
  subtitle,
  showBack = true,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ height: 56, justifyContent: "center" }}>
            {showBack ? (
              <Pressable
                onPress={onBack ?? (() => router.back())}
                hitSlop={8}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors.gray5,
                  backgroundColor: Colors.white,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name="chevron-left"
                  size={22}
                  color={Colors.textPrimary}
                />
              </Pressable>
            ) : null}
          </View>

          <View style={{ alignItems: "center", marginTop: 16 }}>
            <Text className="text-center text-2xl font-bold text-foreground">
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-2 px-2 text-center text-sm leading-5 text-muted-foreground">
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={{ marginTop: 32 }}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
