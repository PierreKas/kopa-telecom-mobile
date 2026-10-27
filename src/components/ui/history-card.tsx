import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { StatusPill, type StatusTone } from "@/components/ui/status-pill";
import { CardShadow, Colors } from "@/constants/theme";

function iconFor(type: string, source?: string): keyof typeof Feather.glyphMap {
  if (type.startsWith("RECHARGE")) return "plus-circle";
  if (type === "BUNDLE_PURCHASE") return "package";
  if (source === "KTRN_HISTORY") return "clock";
  return "repeat";
}

function typeLabel(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

const ACCENT: Record<StatusTone, string> = {
  success: "#16A34A",
  overdue: Colors.error,
  pending: "#F59E0B",
  warning: "#F59E0B",
  active: Colors.primary,
};

export function HistoryCard({
  type,
  source,
  status,
  tone,
  requestedAt,
  amount,
  currency,
  message,
}: {
  type: string;
  source?: string;
  status: string;
  tone: StatusTone;
  requestedAt?: string | null;
  amount?: string | number | null;
  currency?: string;
  message?: string | null;
}) {
  const accent = ACCENT[tone] ?? Colors.primary;
  const time = requestedAt
    ? new Date(requestedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderRadius: 22,
          padding: 14,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.gray5,
        },
        CardShadow,
      ]}
    >
      {/* Icon tinted by status */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: accent + "1A",
        }}
      >
        <Feather name={iconFor(type, source)} size={21} color={accent} />
      </View>

      {/* Type + time + message */}
      <View style={{ flex: 1 }}>
        <Text className="font-semibold text-foreground" numberOfLines={1}>
          {typeLabel(type)}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <Feather name="clock" size={11} color={Colors.gray3} />
          <Text className="text-xs text-muted-foreground">{time}</Text>
        </View>
        {message ? (
          <Text
            className="mt-1 text-xs text-muted-foreground"
            numberOfLines={1}
          >
            {message}
          </Text>
        ) : null}
      </View>

      {/* Amount + status */}
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        {amount ? (
          <Text className="font-bold text-foreground">
            {currency} {amount}
          </Text>
        ) : null}
        <StatusPill label={status.replace("_", " ")} tone={tone} />
      </View>
    </View>
  );
}
