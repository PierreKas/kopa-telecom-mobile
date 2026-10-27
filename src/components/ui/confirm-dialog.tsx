import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

export function ConfirmDialog({
  visible,
  icon = "log-out",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  loading,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const accent = destructive ? Colors.error : Colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Backdrop: tapping outside cancels */}
      <Pressable
        onPress={loading ? undefined : onCancel}
        style={{
          flex: 1,
          backgroundColor: "rgba(17,17,26,0.55)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
        }}
      >
        {/* Card: swallows taps so they don't reach the backdrop */}
        <Pressable
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 28,
            backgroundColor: Colors.white,
            paddingHorizontal: 22,
            paddingTop: 28,
            paddingBottom: 22,
            alignItems: "center",
            elevation: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
          }}
        >
          {/* Icon with soft halo */}
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: accent + "14",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: accent + "26",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={icon} size={24} color={accent} />
            </View>
          </View>

          <Text className="mt-5 text-center text-xl font-bold text-foreground">
            {title}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">
            {message}
          </Text>

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: Colors.gray5,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <Text
                style={{ color: Colors.textPrimary }}
                className="font-semibold"
              >
                {cancelLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                backgroundColor: accent,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={{ color: Colors.white }} className="font-semibold">
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
