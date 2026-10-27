import { View, type ViewProps } from "react-native";

import { CardShadow } from "@/constants/theme";

/** Rounded, elevated white panel — the base unit of every kopa_finance screen (stat cards,
 *  list rows, bottom-sheet bodies). `shadow` is a RN style prop, not a className, since RN
 *  shadow props are iOS-only and need `elevation` for Android parity (included in CardShadow). */
export function Card({
  className,
  style,
  ...rest
}: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-xl border border-border/40 bg-card p-4 ${className ?? ""}`}
      style={[CardShadow, style]}
      {...rest}
    />
  );
}
