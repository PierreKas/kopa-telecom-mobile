import { Feather } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

const MIN_DATE = new Date(1900, 0, 1);
const DEFAULT_DATE = new Date(2000, 0, 1);

/** "19950414" -> Date (local time), or null when empty/invalid. */
function parseYmd(value?: string): Date | null {
  if (!value || !/^\d{8}$/.test(value)) return null;
  const y = Number(value.slice(0, 4));
  const m = Number(value.slice(4, 6)) - 1;
  const d = Number(value.slice(6, 8));
  const date = new Date(y, m, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Date -> "19950414". Built from local parts, so timezones can't shift the day. */
function formatYmd(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function DateField({
  label,
  value,
  onChange,
  error,
  placeholder = "Select your date of birth",
  maximumDate = new Date(),
}: {
  label: string;
  value?: string;
  onChange: (ymd: string) => void;
  error?: string;
  placeholder?: string;
  maximumDate?: Date;
}) {
  const selected = parseYmd(value);
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(selected ?? DEFAULT_DATE);

  function open() {
    const current = selected ?? DEFAULT_DATE;
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: current,
        mode: "date",
        maximumDate,
        minimumDate: MIN_DATE,
        onChange: (event, date) => {
          if (event.type === "set" && date) onChange(formatYmd(date));
        },
      });
    } else {
      setDraft(current);
      setIosOpen(true);
    }
  }

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-foreground">{label}</Text>

      <Pressable
        onPress={open}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          height: 52,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: error ? Colors.error : Colors.border,
          backgroundColor: Colors.white,
        }}
      >
        <Feather name="calendar" size={18} color={Colors.gray3} />
        <Text
          style={{ flex: 1, color: selected ? Colors.textPrimary : "#9CA3AF" }}
          className="text-base"
        >
          {selected
            ? selected.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={Colors.gray4} />
      </Pressable>

      {error ? <Text className="text-xs text-destructive">{error}</Text> : null}

      {/* iOS: spinner in a bottom sheet. Android uses the native dialog above. */}
      {Platform.OS === "ios" ? (
        <Modal
          visible={iosOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIosOpen(false)}
        >
          <Pressable
            onPress={() => setIosOpen(false)}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(17,17,26,0.45)",
            }}
          >
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingBottom: 28,
              }}
            >
              <View className="flex-row items-center justify-between px-6 pt-5">
                <Pressable onPress={() => setIosOpen(false)} hitSlop={8}>
                  <Text className="text-base text-muted-foreground">
                    Cancel
                  </Text>
                </Pressable>
                <Text className="text-base font-bold text-foreground">
                  {label}
                </Text>
                <Pressable
                  onPress={() => {
                    onChange(formatYmd(draft));
                    setIosOpen(false);
                  }}
                  hitSlop={8}
                >
                  <Text className="text-base font-semibold text-primary">
                    Done
                  </Text>
                </Pressable>
              </View>

              <DateTimePicker
                value={draft}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={MIN_DATE}
                onChange={(_, date) => date && setDraft(date)}
                style={{ alignSelf: "center" }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}
