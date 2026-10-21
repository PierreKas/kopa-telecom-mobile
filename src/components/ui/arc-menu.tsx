import { Feather } from "@expo/vector-icons";
// import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, HeroGradient } from "@/constants/theme";
import {
    setArcMenuOpen,
    toggleArcMenu,
    useArcMenuOpen,
} from "@/lib/arc-menu-store";

type BottomTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  home: "home",
  bundles: "package",
  history: "clock",
  profile: "user",
};

const MAIN = 60; // main button size
const ITEM = 52; // arc button size
const RADIUS = 105; // arc radius
const START_ANGLE = 155; // leftmost item (degrees, 180 = straight left)
const END_ANGLE = 25; // rightmost item (0 = straight right)

export function ArcMenu({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  //   const [open, setOpen] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  //   function toggle(next: boolean) {
  //     setOpen(next);
  //     Animated.spring(progress, {
  //       toValue: next ? 1 : 0,
  //       friction: 7,
  //       tension: 80,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  const open = useArcMenuOpen();
  useEffect(() => {
    Animated.spring(progress, {
      toValue: open ? 1 : 0,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const count = state.routes.length;
  const width = RADIUS * 2 + ITEM;
  const height = RADIUS + MAIN; // the arc area must be real layout space, or Android ignores touches

  return (
    // <View
    //   pointerEvents="box-none"
    //   style={{ alignItems: "center", paddingBottom: insets.bottom + 12 }}
    // >
    //   <View style={{ width, height: open ? height : MAIN }}>
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        paddingBottom: insets.bottom + 12,
        backgroundColor: "transparent",
      }}
    >
      <View
        pointerEvents="box-none"
        style={{
          width,
          height: open ? height : MAIN,
          backgroundColor: "transparent",
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const angle =
            count === 1
              ? 90
              : START_ANGLE - (index * (START_ANGLE - END_ANGLE)) / (count - 1);
          const rad = (angle * Math.PI) / 180;
          const x = RADIUS * Math.cos(rad);
          const y = RADIUS * Math.sin(rad);

          const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, x],
          });
          const translateY = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -y],
          });
          const scale = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          });

          function onPress() {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name, route.params);
            // toggle(false);
            setArcMenuOpen(false);
          }

          return (
            <Animated.View
              key={route.key}
              pointerEvents={open ? "auto" : "none"}
              style={{
                position: "absolute",
                left: width / 2 - ITEM / 2,
                bottom: MAIN / 2 - ITEM / 2,
                opacity: progress,
                transform: [{ translateX }, { translateY }, { scale }],
              }}
            >
              <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={
                  descriptors[route.key].options.title ?? route.name
                }
                style={{
                  width: ITEM,
                  height: ITEM,
                  borderRadius: ITEM / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? Colors.primary : "#FFFFFF",
                  elevation: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <Feather
                  name={ICONS[route.name] ?? "circle"}
                  size={22}
                  color={focused ? Colors.white : Colors.primary}
                />
              </Pressable>
            </Animated.View>
          );
        })}

        <Pressable
          //   onPress={() => toggle(!open)}
          onPress={toggleArcMenu}
          accessibilityRole="button"
          accessibilityLabel="Menu"
          style={{
            position: "absolute",
            bottom: 0,
            left: width / 2 - MAIN / 2,
          }}
        >
          <LinearGradient
            colors={HeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: MAIN,
              height: MAIN,
              borderRadius: MAIN / 2,
              alignItems: "center",
              justifyContent: "center",
              elevation: 8,
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "90deg"],
                    }),
                  },
                ],
              }}
            >
              <Feather
                name={open ? "x" : "menu"}
                size={26}
                color={Colors.white}
              />
            </Animated.View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
