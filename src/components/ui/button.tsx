import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text } from "react-native";

import { Colors, HeroGradient } from "@/constants/theme";
import { cssInterop } from "nativewind";

cssInterop(LinearGradient, { className: "style" });
export type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "default" | "sm" | "lg";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: "h-12 px-5",
  sm: "h-10 px-4",
  lg: "h-14 px-6",
};

const SIZE_TEXT_CLASSES: Record<ButtonSize, string> = {
  default: "text-base",
  sm: "text-sm",
  lg: "text-lg",
};

/** Pill-shaped action button. `variant="primary"` renders the magenta->plum gradient seen on
 *  every CTA in the kopa_finance reference screens ("Pay Now", "Get Loan"). */
export function Button({
  children,
  onPress,
  variant = "primary",
  size = "default",
  disabled,
  loading,
  className,
  icon,
  iconPosition = "left",
}: {
  children: string;
  /** Takes no args — every call site either fires a plain action or a react-hook-form
   *  `handleSubmit(onSubmit)`, neither of which cares about the underlying gesture event. */
  onPress?: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: keyof typeof Feather.glyphMap;
  iconPosition?: "left" | "right";
}) {
  const isDisabled = disabled || loading;
  const textColor =
    variant === "primary" || variant === "destructive"
      ? Colors.white
      : variant === "outline"
        ? Colors.primary
        : Colors.textPrimary;
  const textClass =
    variant === "primary" || variant === "destructive"
      ? "text-white"
      : variant === "outline"
        ? "text-primary"
        : "text-foreground";

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Feather name={icon} size={18} color={textColor} />
          )}
          <Text
            className={`font-semibold ${SIZE_TEXT_CLASSES[size]} ${textClass}`}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Feather name={icon} size={18} color={textColor} />
          )}
        </>
      )}
    </>
  );

  const wrapperClass = `flex-row items-center justify-center gap-2 rounded-full ${SIZE_CLASSES[size]} ${isDisabled ? "opacity-50" : ""} ${className ?? ""}`;

  if (variant === "primary") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) =>
          pressed && !isDisabled ? { opacity: 0.88 } : undefined
        }
      >
        <LinearGradient
          colors={HeroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={wrapperClass}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  const variantClass =
    variant === "destructive"
      ? "bg-destructive"
      : variant === "outline"
        ? "border border-primary bg-transparent"
        : "bg-transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      onPress={onPress}
      disabled={isDisabled}
      className={`${variantClass} ${wrapperClass}`}
      style={({ pressed }) =>
        pressed && !isDisabled ? { opacity: 0.85 } : undefined
      }
    >
      {content}
    </Pressable>
  );
}
