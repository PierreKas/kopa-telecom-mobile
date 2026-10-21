import { Text, View } from 'react-native';

import { StatusPillColors } from '@/constants/theme';

export type StatusTone = keyof typeof StatusPillColors;

/** Small rounded status badge ("Active" / "Paid" / "Overdue" / "Upcoming" in the reference
 *  screens) — here used for transaction/bundle-purchase/activation statuses. */
export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  const colors = StatusPillColors[tone];
  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: colors.bg }}>
      <Text className="text-xs font-semibold" style={{ color: colors.fg }}>
        {label}
      </Text>
    </View>
  );
}
