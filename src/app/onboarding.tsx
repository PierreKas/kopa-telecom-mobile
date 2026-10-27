// import { Feather } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useRef, useState, type ComponentRef } from "react";
// import {
//   Dimensions,
//   Pressable,
//   ScrollView,
//   Text,
//   View,
//   type NativeScrollEvent,
//   type NativeSyntheticEvent,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { Button } from "@/components/ui/button";
// import { Colors } from "@/constants/theme";
// import { markOnboardingSeen } from "@/lib/onboarding-seen";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // Copy carried over from the Flutter kopa_finance app's onboarding slides (already written for
// // the telecom product, not the loan one it ended up shipping with).
// const SLIDES = [
//   {
//     icon: "wifi" as const,
//     title: "Manage Your Data",
//     body: "Purchase and manage 4G data packages instantly. Choose from flexible plans that suit your needs.",
//   },
//   {
//     icon: "bar-chart-2" as const,
//     title: "Track Your Usage",
//     body: "Monitor your data consumption in real-time with detailed allowances and remaining balances.",
//   },
//   {
//     icon: "headphones" as const,
//     title: "24/7 Support, Anytime, Anywhere",
//     body: "Get instant help from our dedicated support team. We are always here for you.",
//   },
// ];

// export default function Onboarding() {
//   const [index, setIndex] = useState(0);
//   const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
//   const isLast = index === SLIDES.length - 1;

//   function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
//     const next = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
//     if (next !== index) setIndex(next);
//   }

//   function goTo(nextIndex: number) {
//     scrollRef.current?.scrollTo({
//       x: nextIndex * SCREEN_WIDTH,
//       animated: true,
//     });
//     setIndex(nextIndex);
//   }

//   async function finish() {
//     await markOnboardingSeen();
//     router.replace("/(auth)/login-step1");
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={handleScroll}
//         className="flex-1"
//       >
//         {SLIDES.map((slide) => (
//           <View
//             key={slide.title}
//             style={{ width: SCREEN_WIDTH }}
//             className="flex-1 items-center justify-center px-10"
//           >
//             <View className="mb-10 h-44 w-44 items-center justify-center rounded-full bg-accent">
//               <Feather name={slide.icon} size={64} color={Colors.primary} />
//             </View>
//             <Text className="mb-4 text-center text-2xl font-bold text-foreground">
//               {slide.title}
//             </Text>
//             <Text className="text-center text-base text-muted-foreground">
//               {slide.body}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>

//       <View className="px-6 pb-4 pt-6">
//         {isLast ? (
//           <Button onPress={finish}>Get started</Button>
//         ) : (
//           <View className="flex-row items-center justify-between">
//             <Pressable onPress={finish} hitSlop={8}>
//               <Text className="text-base text-muted-foreground">Skip</Text>
//             </Pressable>
//             <View className="flex-row gap-2">
//               {SLIDES.map((slide, dotIndex) => (
//                 <View
//                   key={slide.title}
//                   className="h-2 rounded-full"
//                   style={{
//                     width: dotIndex === index ? 20 : 8,
//                     backgroundColor:
//                       dotIndex === index ? Colors.primary : Colors.gray5,
//                   }}
//                 />
//               ))}
//             </View>
//             <Pressable onPress={() => goTo(index + 1)} hitSlop={8}>
//               <Text className="text-base font-semibold text-primary">
//                 Continue
//               </Text>
//             </Pressable>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState, type ComponentRef } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DataIllustration,
  SupportIllustration,
  UsageIllustration,
} from "@/components/brand/onboarding-illustrations";
import { Colors, HeroGradient } from "@/constants/theme";
import { markOnboardingSeen } from "@/lib/onboarding-seen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    Illustration: DataIllustration,
    title: "Manage Your Data",
    body: "Purchase and manage 4G data packages instantly. Choose from flexible plans that suit your needs.",
  },
  {
    Illustration: UsageIllustration,
    title: "Track Your Usage",
    body: "Monitor your data consumption in real-time with detailed allowances and remaining balances.",
  },
  {
    Illustration: SupportIllustration,
    title: "24/7 Support, Anytime, Anywhere",
    body: "Get instant help from our dedicated support team. We are always here for you.",
  },
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const isLast = index === SLIDES.length - 1;

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (next !== index) setIndex(next);
  }

  function goTo(nextIndex: number) {
    scrollRef.current?.scrollTo({
      x: nextIndex * SCREEN_WIDTH,
      animated: true,
    });
    setIndex(nextIndex);
  }

  async function finish() {
    await markOnboardingSeen();
    router.replace("/(auth)/login-step1");
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="h-10 items-end justify-center px-6">
        {!isLast ? (
          <Pressable onPress={finish} hitSlop={8}>
            <Text className="text-base text-muted-foreground">Skip</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        className="flex-1"
      >
        {SLIDES.map(({ Illustration, title, body }) => (
          <View
            key={title}
            style={{ width: SCREEN_WIDTH }}
            className="flex-1 justify-center px-8"
          >
            <Illustration />
            <Text className="mb-3 mt-8 text-center text-2xl font-bold text-foreground">
              {title}
            </Text>
            <Text className="text-center text-sm leading-5 text-muted-foreground">
              {body}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots + Next track */}
      <View className="flex-row items-center px-6 pb-4 pt-6">
        <View className="flex-row items-center gap-1.5">
          {SLIDES.map(({ title }, dotIndex) => (
            <View
              key={title}
              style={{
                height: 8,
                width: dotIndex === index ? 22 : 8,
                borderRadius: 4,
                backgroundColor:
                  dotIndex === index ? Colors.primary : Colors.gray5,
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={isLast ? finish : () => goTo(index + 1)}
          style={{
            flex: 1,
            marginLeft: 84,
            height: 52,
            borderRadius: 26,
            borderWidth: 1,
            borderColor: Colors.gray5,
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <LinearGradient
            colors={HeroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 50,
              borderRadius: 25,
              paddingHorizontal: 26,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="font-semibold text-white">
              {isLast ? "Get started" : "Next"}
            </Text>
          </LinearGradient>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Feather
              name="chevrons-right"
              size={22}
              color={Colors.primary}
              style={{ opacity: 0.5 }}
            />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
