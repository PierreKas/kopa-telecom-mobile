import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";

import { CardShadow, Colors, HeroGradient } from "@/constants/theme";

export type BundleKind = "data" | "voice" | "sms" | "other";

export function bundleKind(name: string): BundleKind {
  const n = name.toLowerCase();
  if (n.includes("data") || n.includes("gb") || n.includes("mb")) return "data";
  if (n.includes("voice") || n.includes("min") || n.includes("call"))
    return "voice";
  if (n.includes("sms")) return "sms";
  return "other";
}

const KINDS: Record<
  BundleKind,
  { icon: keyof typeof Feather.glyphMap; label: string }
> = {
  data: { icon: "wifi", label: "Data" },
  voice: { icon: "phone", label: "Voice" },
  sms: { icon: "message-square", label: "SMS" },
  other: { icon: "package", label: "Bundle" },
};

export function BundleCard({
  name,
  code,
  price,
  highlighted,
  processing,
  onBuy,
}: {
  name: string;
  code: string;
  price: string | number;
  highlighted?: boolean;
  processing?: boolean;
  onBuy: () => void;
}) {
  const kind = KINDS[bundleKind(name)];
  const fg = highlighted ? Colors.white : Colors.textPrimary;
  const sub = highlighted ? "rgba(255,255,255,0.75)" : Colors.gray3;

  const body = (
    <>
      {/* Tag + code */}
      <View className="flex-row items-center justify-between">
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1"
          style={{
            backgroundColor: highlighted
              ? "rgba(255,255,255,0.22)"
              : Colors.primary + "1A",
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: highlighted ? Colors.white : Colors.primary,
            }}
          />
          <Text
            style={{ color: highlighted ? Colors.white : Colors.primary }}
            className="text-xs font-semibold"
          >
            {highlighted ? "Popular" : kind.label}
          </Text>
        </View>
        <Text style={{ color: sub }} className="text-xs">
          {code}
        </Text>
      </View>

      {/* Icon + name */}
      <View className="mt-4 flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: highlighted
              ? "rgba(255,255,255,0.22)"
              : Colors.primary + "14",
          }}
        >
          <Feather
            name={kind.icon}
            size={22}
            color={highlighted ? Colors.white : Colors.primary}
          />
        </View>
        <Text
          style={{ color: fg }}
          className="flex-1 text-lg font-bold"
          numberOfLines={2}
        >
          {name}
        </Text>
      </View>

      {/* Divider */}
      <View
        className="my-4 h-px"
        style={{
          backgroundColor: highlighted
            ? "rgba(255,255,255,0.25)"
            : Colors.gray5,
        }}
      />

      {/* Price + Buy */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text style={{ color: sub }} className="text-xs">
            Price
          </Text>
          <Text style={{ color: fg }} className="text-xl font-bold">
            RWF {price}
          </Text>
        </View>

        <Pressable
          onPress={onBuy}
          disabled={processing}
          style={{ opacity: processing ? 0.6 : 1 }}
        >
          {highlighted ? (
            <View className="flex-row items-center gap-2 rounded-full bg-secondary px-5 py-3">
              <Text style={{ color: Colors.primary }} className="font-semibold">
                {processing ? "Processing…" : "Buy now"}
              </Text>
              <Feather name="arrow-right" size={16} color={Colors.primary} />
            </View>
          ) : (
            <LinearGradient
              colors={HeroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 999,
                paddingHorizontal: 20,
                paddingVertical: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text style={{ color: Colors.white }} className="font-semibold">
                {processing ? "Processing…" : "Buy"}
              </Text>
              <Feather name="arrow-right" size={16} color={Colors.white} />
            </LinearGradient>
          )}
        </Pressable>
      </View>
    </>
  );

  if (highlighted) {
    return (
      <LinearGradient
        colors={HeroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: 24, padding: 18 }, CardShadow]}
      >
        {body}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius: 24,
          padding: 18,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.gray5,
        },
        CardShadow,
      ]}
    >
      {body}
    </View>
  );
}
