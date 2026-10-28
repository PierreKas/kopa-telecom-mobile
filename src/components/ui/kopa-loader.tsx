import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Text, View } from "react-native";

import { KopaIcon } from "@/components/brand/kopa-logo";
import { Colors, HeroGradient } from "@/constants/theme";

const RING = 132; // spinner ring size
const CORE = 92; // white circle behind the logo

function PulseRing({ delay }: { delay: number }) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [v, delay]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: CORE,
        height: CORE,
        borderRadius: CORE / 2,
        borderWidth: 2,
        borderColor: Colors.primary,
        opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
        transform: [
          { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) },
        ],
      }}
    />
  );
}

export function KopaLoader({
  visible,
  title = "Signing you in",
  messages = ["Securing your connection", "Checking your PIN", "Almost there"],
}: {
  visible: boolean;
  title?: string;
  messages?: string[];
}) {
  const spin = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const [msgIndex, setMsgIndex] = useState(0);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setMsgIndex(0);

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    spinLoop.start();
    breatheLoop.start();

    const dotsTimer = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    const msgTimer = setInterval(
      () => setMsgIndex((i) => Math.min(i + 1, messages.length - 1)),
      1800,
    );

    return () => {
      spinLoop.stop();
      breatheLoop.stop();
      spin.setValue(0);
      breathe.setValue(0);
      clearInterval(dotsTimer);
      clearInterval(msgTimer);
    };
  }, [visible, spin, breathe, messages.length]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(255,255,255,0.96)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
        }}
      >
        {/* Logo + rings */}
        <View
          style={{
            width: RING,
            height: RING,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <PulseRing delay={0} />
          <PulseRing delay={800} />
          <PulseRing delay={1600} />

          {/* Spinning arc */}
          <Animated.View
            style={{
              position: "absolute",
              width: RING,
              height: RING,
              borderRadius: RING / 2,
              borderWidth: 4,
              borderColor: Colors.primary + "22",
              borderTopColor: Colors.primary,
              transform: [
                {
                  rotate: spin.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />

          {/* Breathing logo core */}
          <Animated.View
            style={{
              transform: [
                {
                  scale: breathe.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.07],
                  }),
                },
              ],
            }}
          >
            <LinearGradient
              colors={HeroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: CORE + 8,
                height: CORE + 8,
                borderRadius: (CORE + 8) / 2,
                alignItems: "center",
                justifyContent: "center",
                elevation: 8,
                shadowColor: Colors.primary,
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
              }}
            >
              <View
                style={{
                  width: CORE,
                  height: CORE,
                  borderRadius: CORE / 2,
                  backgroundColor: Colors.white,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <KopaIcon size={52} />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Texts */}
        <Text className="mt-12 text-xl font-bold text-foreground">
          {title}
          <Text style={{ color: Colors.primary }}>{".".repeat(dots)}</Text>
        </Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          {messages[msgIndex]}
        </Text>

        {/* Brand footer */}
        <Text
          style={{
            position: "absolute",
            bottom: 48,
            letterSpacing: 6,
            color: Colors.gray4,
          }}
          className="text-[11px] font-semibold"
        >
          KOPA TELECOM
        </Text>
      </View>
    </Modal>
  );
}
