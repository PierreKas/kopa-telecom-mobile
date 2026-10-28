// import { Feather } from "@expo/vector-icons";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { router } from "expo-router";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, ScrollView, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { DateField } from "@/components/ui/date-field";
// import { TextField } from "@/components/ui/text-field";
// import { Colors } from "@/constants/theme";
// import { getApiErrorMessage } from "@/lib/api-error-message";
// import { USE_MOCK } from "@/lib/mock-config";
// import {
//   MOCK_ACTIVATE_RESPONSE,
//   MOCK_MSISDN_STATUS,
//   MOCK_MSISDN_SUGGESTIONS,
// } from "@/lib/mock-data";
// import { sessionEstablished } from "@/store/authSlice";
// import { useAppDispatch } from "@/store/hooks";
// import {
//   useActivateMutation,
//   useGetMsisdnSuggestionsQuery,
//   useLazyGetMsisdnStatusQuery,
// } from "@/store/identityApi";

// const CUST_TYPES = [
//   { value: "A", label: "Individual" },
//   { value: "B", label: "Self-employed" },
//   { value: "C", label: "Foreigner" },
//   { value: "D", label: "Corporate" },
//   { value: "E", label: "Public sector" },
// ] as const;

// const schema = z.object({
//   msisdn: z
//     .string()
//     .regex(/^\d{6,15}$/, "Choose or enter a valid phone number"),
//   custType: z.enum(["A", "B", "C", "D", "E"]),
//   fullName: z.string().min(2, "Enter your full name"),
//   birthDay: z.string().regex(/^\d{8}$/, "Use YYYYMMDD, e.g. 19950414"),
//   addressDetail: z.string().min(2, "Enter your address"),
//   email: z.string().email("Enter a valid email").optional().or(z.literal("")),
//   corpRegNo: z.string().optional(),
//   bizRegNo: z.string().optional(),
//   iccid: z
//     .string()
//     .regex(/^\d{10,19}$/, "ICCID must be 10-19 digits (printed on the SIM)"),
//   productCode: z.string().min(1, "Enter the price plan product code"),
// });
// type FormValues = z.infer<typeof schema>;

// const STEPS = ["Number", "Your details", "SIM & plan", "Review"] as const;

// export default function Register() {
//   const dispatch = useAppDispatch();
//   const [step, setStep] = useState(0);
//   const { data: suggestionsData } = useGetMsisdnSuggestionsQuery(undefined, {
//     skip: USE_MOCK,
//   });
//   const [checkStatus, { data: statusResultData, isFetching: checkingStatus }] =
//     useLazyGetMsisdnStatusQuery();
//   const [activate, { isLoading, error }] = useActivateMutation();
//   const [mockCheckedMsisdn, setMockCheckedMsisdn] = useState<string | null>(
//     null,
//   );
//   const [isMockActivating, setIsMockActivating] = useState(false);

//   const suggestions = USE_MOCK ? MOCK_MSISDN_SUGGESTIONS : suggestionsData;
//   const statusResult = USE_MOCK
//     ? mockCheckedMsisdn
//       ? MOCK_MSISDN_STATUS
//       : undefined
//     : statusResultData;
//   const activating = USE_MOCK ? isMockActivating : isLoading;

//   const {
//     control,
//     handleSubmit,
//     watch,
//     trigger,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       msisdn: "",
//       custType: "A",
//       fullName: "",
//       birthDay: "",
//       addressDetail: "",
//       email: "",
//       corpRegNo: "",
//       bizRegNo: "",
//       iccid: "",
//       productCode: "",
//     },
//   });

//   const custType = watch("custType");
//   const needsBizRegNo =
//     custType === "B" || custType === "D" || custType === "E";

//   async function goNext() {
//     const fieldsByStep: (keyof FormValues)[][] = [
//       ["msisdn"],
//       [
//         "custType",
//         "fullName",
//         "birthDay",
//         "addressDetail",
//         "email",
//         "corpRegNo",
//         "bizRegNo",
//       ],
//       ["iccid", "productCode"],
//       [],
//     ];
//     const valid = await trigger(fieldsByStep[step]);
//     if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1));
//   }

//   function goBack() {
//     if (step === 0) router.back();
//     else setStep((current) => current - 1);
//   }

//   async function onSubmit(values: FormValues) {
//     try {
//       if (USE_MOCK) {
//         setIsMockActivating(true);
//         const response = { ...MOCK_ACTIVATE_RESPONSE, msisdn: values.msisdn };
//         setIsMockActivating(false);
//         dispatch(
//           sessionEstablished({
//             customerId: response.customerId,
//             msisdn: response.msisdn,
//             token: response.token,
//             expiresAt: response.expiresAt,
//           }),
//         );
//         router.replace("/(auth)/set-pin");
//         return;
//       }
//       const response = await activate({
//         msisdn: values.msisdn,
//         iccid: values.iccid,
//         productCode: values.productCode,
//         custType: values.custType,
//         fullName: values.fullName,
//         birthDay: values.birthDay,
//         addressDetail: values.addressDetail,
//         email: values.email || undefined,
//         corpRegNo: values.corpRegNo || undefined,
//         bizRegNo: values.bizRegNo || undefined,
//       }).unwrap();
//       dispatch(
//         sessionEstablished({
//           customerId: response.customerId,
//           msisdn: response.msisdn,
//           token: response.token,
//           expiresAt: response.expiresAt,
//         }),
//       );
//       router.replace("/(auth)/set-pin");
//     } catch {
//       // error shown below via the mutation's `error`
//     }
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-background">
//       <View className="flex-row items-center justify-between px-4 py-3">
//         <Pressable onPress={goBack} hitSlop={8}>
//           <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
//         </Pressable>
//         <Text className="text-sm font-medium text-muted-foreground">
//           Step {step + 1} of {STEPS.length}
//         </Text>
//       </View>

//       <View className="mb-2 flex-row gap-1.5 px-6">
//         {STEPS.map((label, i) => (
//           <View
//             key={label}
//             className="h-1.5 flex-1 rounded-full"
//             style={{
//               backgroundColor: i <= step ? Colors.primary : Colors.gray5,
//             }}
//           />
//         ))}
//       </View>

//       <ScrollView
//         contentContainerClassName="px-6 py-6 gap-5"
//         keyboardShouldPersistTaps="handled"
//       >
//         {step === 0 && (
//           <>
//             <Text className="mb-1 text-2xl font-bold text-foreground">
//               Choose your number
//             </Text>
//             <Text className="mb-2 text-base text-muted-foreground">
//               Pick one of the available numbers below, or enter your own.
//             </Text>

//             {suggestions?.msisdns.length ? (
//               <View className="flex-row flex-wrap gap-2">
//                 {suggestions.msisdns.map((number) => (
//                   <Controller
//                     key={number}
//                     control={control}
//                     name="msisdn"
//                     render={({ field }) => (
//                       <Pressable
//                         onPress={() => field.onChange(number)}
//                         className="rounded-full border px-4 py-2"
//                         style={{
//                           borderColor:
//                             field.value === number
//                               ? Colors.primary
//                               : Colors.border,
//                           backgroundColor:
//                             field.value === number
//                               ? Colors.primary
//                               : "transparent",
//                         }}
//                       >
//                         <Text
//                           style={{
//                             color:
//                               field.value === number
//                                 ? Colors.white
//                                 : Colors.textPrimary,
//                           }}
//                           className="font-medium"
//                         >
//                           {number}
//                         </Text>
//                       </Pressable>
//                     )}
//                   />
//                 ))}
//               </View>
//             ) : null}

//             <Controller
//               control={control}
//               name="msisdn"
//               render={({ field }) => (
//                 <TextField
//                   label="Or enter a number"
//                   placeholder="0771234567"
//                   keyboardType="phone-pad"
//                   leftIcon="smartphone"
//                   value={field.value}
//                   onChangeText={(text) => field.onChange(text)}
//                   onEndEditing={() => {
//                     if (field.value.length < 6) return;
//                     if (USE_MOCK) setMockCheckedMsisdn(field.value);
//                     else checkStatus(field.value);
//                   }}
//                   error={errors.msisdn?.message}
//                 />
//               )}
//             />
//             {checkingStatus ? (
//               <Text className="text-sm text-muted-foreground">
//                 Checking availability…
//               </Text>
//             ) : null}
//             {statusResult && !checkingStatus ? (
//               <Text
//                 className={`text-sm ${statusResult.available ? "text-success" : "text-destructive"}`}
//               >
//                 {statusResult.available
//                   ? "This number is available."
//                   : "This number is already taken."}
//               </Text>
//             ) : null}
//           </>
//         )}

//         {step === 1 && (
//           <>
//             <Text className="mb-1 text-2xl font-bold text-foreground">
//               Your details
//             </Text>
//             <Text className="mb-2 text-base text-muted-foreground">
//               This information will be used to register your line.
//             </Text>

//             <Text className="text-sm font-medium text-foreground">
//               Customer type
//             </Text>
//             <Controller
//               control={control}
//               name="custType"
//               render={({ field }) => (
//                 <View className="flex-row flex-wrap gap-2">
//                   {CUST_TYPES.map((type) => (
//                     <Pressable
//                       key={type.value}
//                       onPress={() => field.onChange(type.value)}
//                       className="rounded-full border px-4 py-2"
//                       style={{
//                         borderColor:
//                           field.value === type.value
//                             ? Colors.primary
//                             : Colors.border,
//                         backgroundColor:
//                           field.value === type.value
//                             ? Colors.primary
//                             : "transparent",
//                       }}
//                     >
//                       <Text
//                         style={{
//                           color:
//                             field.value === type.value
//                               ? Colors.white
//                               : Colors.textPrimary,
//                         }}
//                         className="font-medium"
//                       >
//                         {type.label}
//                       </Text>
//                     </Pressable>
//                   ))}
//                 </View>
//               )}
//             />

//             <Controller
//               control={control}
//               name="fullName"
//               render={({ field }) => (
//                 <TextField
//                   label="Full name"
//                   placeholder="Jane Uwimana"
//                   leftIcon="user"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.fullName?.message}
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name="birthDay"
//               render={({ field }) => (
//                 <DateField
//                   label="Date of birth"
//                   value={field.value}
//                   onChange={field.onChange}
//                   error={errors.birthDay?.message}
//                 />
//               )}
//             />
//             {/* <Controller
//               control={control}
//               name="birthDay"
//               render={({ field }) => (
//                 <TextField
//                   label="Date of birth (YYYYMMDD)"
//                   placeholder="19950414"
//                   keyboardType="number-pad"
//                   leftIcon="calendar"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.birthDay?.message}
//                 />
//               )}
//             /> */}
//             <Controller
//               control={control}
//               name="addressDetail"
//               render={({ field }) => (
//                 <TextField
//                   label="Address"
//                   placeholder="KG 11 Ave, Kigali"
//                   leftIcon="map-pin"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.addressDetail?.message}
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name="email"
//               render={({ field }) => (
//                 <TextField
//                   label="Email (optional)"
//                   placeholder="jane@example.com"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   leftIcon="mail"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.email?.message}
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name="corpRegNo"
//               render={({ field }) => (
//                 <TextField
//                   label={custType === "C" ? "Passport number" : "National ID"}
//                   placeholder="1 1990 8 1234567 1 23"
//                   leftIcon="credit-card"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                 />
//               )}
//             />
//             {needsBizRegNo ? (
//               <Controller
//                 control={control}
//                 name="bizRegNo"
//                 render={({ field }) => (
//                   <TextField
//                     label="Business registration number"
//                     leftIcon="briefcase"
//                     value={field.value}
//                     onChangeText={field.onChange}
//                   />
//                 )}
//               />
//             ) : null}
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <Text className="mb-1 text-2xl font-bold text-foreground">
//               SIM & plan
//             </Text>
//             <Text className="mb-2 text-base text-muted-foreground">
//               Enter the ICCID printed on your SIM card and the price plan you
//               want.
//             </Text>
//             <Controller
//               control={control}
//               name="iccid"
//               render={({ field }) => (
//                 <TextField
//                   label="SIM ICCID"
//                   placeholder="8925003..."
//                   keyboardType="number-pad"
//                   leftIcon="credit-card"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.iccid?.message}
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name="productCode"
//               render={({ field }) => (
//                 <TextField
//                   label="Price plan code"
//                   placeholder="e.g. PD00000574"
//                   leftIcon="tag"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.productCode?.message}
//                 />
//               )}
//             />
//           </>
//         )}

//         {step === 3 && (
//           <>
//             <Text className="mb-1 text-2xl font-bold text-foreground">
//               Review
//             </Text>
//             <Text className="mb-2 text-base text-muted-foreground">
//               Check your details before submitting them.
//             </Text>

//             {error ? (
//               <View className="rounded-xl bg-destructive/10 p-3">
//                 <Text className="text-sm text-destructive">
//                   {getApiErrorMessage(error)}
//                 </Text>
//               </View>
//             ) : null}

//             <Card className="gap-3">
//               <ReviewRow label="Number" value={watch("msisdn")} />
//               <ReviewRow
//                 label="Customer type"
//                 value={
//                   CUST_TYPES.find((t) => t.value === custType)?.label ??
//                   custType
//                 }
//               />
//               <ReviewRow label="Full name" value={watch("fullName")} />
//               <ReviewRow label="Date of birth" value={watch("birthDay")} />
//               <ReviewRow label="Address" value={watch("addressDetail")} />
//               <ReviewRow label="ICCID" value={watch("iccid")} />
//               <ReviewRow label="Price plan" value={watch("productCode")} />
//             </Card>
//           </>
//         )}
//       </ScrollView>

//       <View className="px-6 pb-4 pt-2">
//         {step === STEPS.length - 1 ? (
//           <Button onPress={handleSubmit(onSubmit)} loading={activating}>
//             Activate my line
//           </Button>
//         ) : (
//           <Button onPress={goNext}>Continue</Button>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// function ReviewRow({ label, value }: { label: string; value?: string }) {
//   return (
//     <View className="flex-row justify-between border-b border-border/60 pb-3">
//       <Text className="text-muted-foreground">{label}</Text>
//       <Text className="font-medium text-foreground">{value || "—"}</Text>
//     </View>
//   );
// }

import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";
import { Field } from "@/components/ui/field";
import { CardShadow, Colors, HeroGradient } from "@/constants/theme";
import { getApiErrorMessage } from "@/lib/api-error-message";
import { USE_MOCK } from "@/lib/mock-config";
import {
  MOCK_ACTIVATE_RESPONSE,
  MOCK_MSISDN_STATUS,
  MOCK_MSISDN_SUGGESTIONS,
} from "@/lib/mock-data";
import { sessionEstablished } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  useActivateMutation,
  useGetMsisdnSuggestionsQuery,
  useLazyGetMsisdnStatusQuery,
} from "@/store/identityApi";

type IconName = keyof typeof Feather.glyphMap;

const CUST_TYPES: {
  value: "A" | "B" | "C" | "D" | "E";
  label: string;
  icon: IconName;
}[] = [
  { value: "A", label: "Individual", icon: "user" },
  { value: "B", label: "Self-employed", icon: "tool" },
  { value: "C", label: "Foreigner", icon: "globe" },
  { value: "D", label: "Corporate", icon: "briefcase" },
  { value: "E", label: "Public sector", icon: "flag" },
];

const schema = z.object({
  msisdn: z
    .string()
    .regex(/^\d{6,15}$/, "Choose or enter a valid phone number"),
  custType: z.enum(["A", "B", "C", "D", "E"]),
  fullName: z.string().min(2, "Enter your full name"),
  birthDay: z.string().regex(/^\d{8}$/, "Select your date of birth"),
  addressDetail: z.string().min(2, "Enter your address"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  corpRegNo: z.string().optional(),
  bizRegNo: z.string().optional(),
  iccid: z
    .string()
    .regex(/^\d{10,19}$/, "ICCID must be 10-19 digits (printed on the SIM)"),
  productCode: z.string().min(1, "Enter the price plan product code"),
});
type FormValues = z.infer<typeof schema>;

const STEPS: {
  label: string;
  icon: IconName;
  title: string;
  subtitle: string;
}[] = [
  {
    label: "Number",
    icon: "smartphone",
    title: "Choose your number",
    subtitle: "Pick one of the available numbers, or enter your own.",
  },
  {
    label: "Details",
    icon: "user",
    title: "Tell us about you",
    subtitle: "We use this to register your line.",
  },
  {
    label: "SIM & plan",
    icon: "credit-card",
    title: "Your SIM and plan",
    subtitle: "Enter the ICCID printed on your SIM and the plan you want.",
  },
  {
    label: "Review",
    icon: "check-circle",
    title: "Almost done",
    subtitle: "Check everything before you activate your line.",
  },
];

function formatYmd(ymd?: string) {
  if (!ymd || ymd.length !== 8) return "";
  return new Date(
    Number(ymd.slice(0, 4)),
    Number(ymd.slice(4, 6)) - 1,
    Number(ymd.slice(6, 8)),
  ).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Stepper({ step }: { step: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {STEPS.map((s, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <View key={s.label} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor:
                    i === 0
                      ? "transparent"
                      : i <= step
                        ? Colors.primary
                        : Colors.gray5,
                }}
              />
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? Colors.primary : Colors.white,
                  borderWidth: 2,
                  borderColor: done || current ? Colors.primary : Colors.gray5,
                }}
              >
                {done ? (
                  <Feather name="check" size={14} color={Colors.secondary} />
                ) : (
                  <Text
                    style={{ color: current ? Colors.primary : Colors.gray3 }}
                    className="text-xs font-bold"
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor:
                    i === STEPS.length - 1
                      ? "transparent"
                      : i < step
                        ? Colors.primary
                        : Colors.gray5,
                }}
              />
            </View>
            <Text
              style={{ color: current ? Colors.primary : Colors.gray3 }}
              className="mt-1.5 text-[11px] font-semibold"
            >
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function Chip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 11,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: selected ? Colors.primary : Colors.gray5,
          backgroundColor: selected ? Colors.primary + "14" : Colors.white,
        },
      ]}
    >
      {icon ? (
        <Feather
          name={icon}
          size={16}
          color={selected ? Colors.primary : Colors.gray3}
        />
      ) : null}
      <Text
        style={{ color: selected ? Colors.primary : Colors.textPrimary }}
        className="font-semibold"
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Note({ ok, text }: { ok: boolean; text: string }) {
  const tone = ok ? Colors.success : Colors.error;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: 14,
        backgroundColor: tone + "14",
      }}
    >
      <Feather name={ok ? "check-circle" : "x-circle"} size={18} color={tone} />
      <Text style={{ color: tone }} className="flex-1 text-sm font-medium">
        {text}
      </Text>
    </View>
  );
}

function Section({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        {
          borderRadius: 22,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.gray5,
          padding: 16,
          gap: 14,
        },
        CardShadow,
      ]}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </Text>
        <Pressable onPress={onEdit} hitSlop={8}>
          <Text className="text-sm font-semibold text-primary">Edit</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function ReviewRow({
  icon,
  label,
  value,
}: {
  icon: IconName;
  label: string;
  value?: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: Colors.primary + "14",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={16} color={Colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-muted-foreground">{label}</Text>
        <Text className="font-semibold text-foreground">{value || "—"}</Text>
      </View>
    </View>
  );
}

export default function Register() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const { data: suggestionsData } = useGetMsisdnSuggestionsQuery(undefined, {
    skip: USE_MOCK,
  });
  const [checkStatus, { data: statusResultData, isFetching: checkingStatus }] =
    useLazyGetMsisdnStatusQuery();
  const [activate, { isLoading, error }] = useActivateMutation();
  const [mockCheckedMsisdn, setMockCheckedMsisdn] = useState<string | null>(
    null,
  );
  const [isMockActivating, setIsMockActivating] = useState(false);

  const suggestions = USE_MOCK ? MOCK_MSISDN_SUGGESTIONS : suggestionsData;
  const statusResult = USE_MOCK
    ? mockCheckedMsisdn
      ? MOCK_MSISDN_STATUS
      : undefined
    : statusResultData;
  const activating = USE_MOCK ? isMockActivating : isLoading;

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      msisdn: "",
      custType: "A",
      fullName: "",
      birthDay: "",
      addressDetail: "",
      email: "",
      corpRegNo: "",
      bizRegNo: "",
      iccid: "",
      productCode: "",
    },
  });

  const custType = watch("custType");
  const needsBizRegNo =
    custType === "B" || custType === "D" || custType === "E";
  const meta = STEPS[step];

  async function goNext() {
    const fieldsByStep: (keyof FormValues)[][] = [
      ["msisdn"],
      [
        "custType",
        "fullName",
        "birthDay",
        "addressDetail",
        "email",
        "corpRegNo",
        "bizRegNo",
      ],
      ["iccid", "productCode"],
      [],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    if (step === 0) router.back();
    else setStep((current) => current - 1);
  }

  async function onSubmit(values: FormValues) {
    try {
      if (USE_MOCK) {
        setIsMockActivating(true);
        const response = { ...MOCK_ACTIVATE_RESPONSE, msisdn: values.msisdn };
        setIsMockActivating(false);
        dispatch(
          sessionEstablished({
            customerId: response.customerId,
            msisdn: response.msisdn,
            token: response.token,
            expiresAt: response.expiresAt,
          }),
        );
        router.replace("/(auth)/set-pin");
        return;
      }
      const response = await activate({
        msisdn: values.msisdn,
        iccid: values.iccid,
        productCode: values.productCode,
        custType: values.custType,
        fullName: values.fullName,
        birthDay: values.birthDay,
        addressDetail: values.addressDetail,
        email: values.email || undefined,
        corpRegNo: values.corpRegNo || undefined,
        bizRegNo: values.bizRegNo || undefined,
      }).unwrap();
      dispatch(
        sessionEstablished({
          customerId: response.customerId,
          msisdn: response.msisdn,
          token: response.token,
          expiresAt: response.expiresAt,
        }),
      );
      router.replace("/(auth)/set-pin");
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-6 py-3">
          <Pressable
            onPress={goBack}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: Colors.gray5,
              backgroundColor: Colors.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="chevron-left" size={22} color={Colors.textPrimary} />
          </Pressable>
          <View className="rounded-full bg-accent px-3 py-1">
            <Text className="text-xs font-semibold text-primary">
              Step {step + 1} of {STEPS.length}
            </Text>
          </View>
        </View>

        <View className="px-4 pb-2">
          <Stepper step={step} />
        </View>

        {/* <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 20,
            gap: 18,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        > */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 20,
            paddingBottom: 40,
            gap: 18,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          {/* Step header */}
          <View className="flex-row items-center gap-4">
            <LinearGradient
              colors={HeroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name={meta.icon} size={26} color={Colors.secondary} />
            </LinearGradient>
            <Text className="flex-1 text-2xl font-bold text-foreground">
              {meta.title}
            </Text>
          </View>
          <Text className="-mt-2 text-base text-muted-foreground">
            {meta.subtitle}
          </Text>

          {/* STEP 0 */}
          {step === 0 && (
            <Controller
              control={control}
              name="msisdn"
              render={({ field }) => (
                <View style={{ gap: 18 }}>
                  {suggestions?.msisdns.length ? (
                    <View style={{ gap: 10 }}>
                      <Text className="ml-1 text-sm font-medium text-foreground">
                        Available numbers
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {suggestions.msisdns.map((number) => (
                          <Chip
                            key={number}
                            label={number}
                            selected={field.value === number}
                            onPress={() => field.onChange(number)}
                          />
                        ))}
                      </View>
                    </View>
                  ) : null}

                  <Field
                    label="Or enter a number"
                    placeholder="0771234567"
                    keyboardType="phone-pad"
                    icon="smartphone"
                    value={field.value}
                    onChangeText={field.onChange}
                    onEndEditing={() => {
                      if (field.value.length < 6) return;
                      if (USE_MOCK) setMockCheckedMsisdn(field.value);
                      else checkStatus(field.value);
                    }}
                    error={errors.msisdn?.message}
                  />

                  {checkingStatus ? (
                    <Text className="ml-1 text-sm text-muted-foreground">
                      Checking availability…
                    </Text>
                  ) : statusResult ? (
                    <Note
                      ok={!!statusResult.available}
                      text={
                        statusResult.available
                          ? "This number is available."
                          : "This number is already taken."
                      }
                    />
                  ) : null}
                </View>
              )}
            />
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <View style={{ gap: 10 }}>
                <Text className="ml-1 text-sm font-medium text-foreground">
                  Customer type
                </Text>
                <Controller
                  control={control}
                  name="custType"
                  render={({ field }) => (
                    <View className="flex-row flex-wrap gap-2">
                      {CUST_TYPES.map((type) => (
                        <Chip
                          key={type.value}
                          label={type.label}
                          icon={type.icon}
                          selected={field.value === type.value}
                          onPress={() => field.onChange(type.value)}
                        />
                      ))}
                    </View>
                  )}
                />
              </View>

              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <Field
                    label="Full name"
                    placeholder="Jane Uwimana"
                    icon="user"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="birthDay"
                render={({ field }) => (
                  <DateField
                    label="Date of birth"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.birthDay?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="addressDetail"
                render={({ field }) => (
                  <Field
                    label="Address"
                    placeholder="KG 11 Ave, Kigali"
                    icon="map-pin"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.addressDetail?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Field
                    label="Email (optional)"
                    placeholder="jane@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="mail"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="corpRegNo"
                render={({ field }) => (
                  <Field
                    label={custType === "C" ? "Passport number" : "National ID"}
                    placeholder="1 1990 8 1234567 1 23"
                    icon="credit-card"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                )}
              />
              {needsBizRegNo ? (
                <Controller
                  control={control}
                  name="bizRegNo"
                  render={({ field }) => (
                    <Field
                      label="Business registration number"
                      icon="briefcase"
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  )}
                />
              ) : null}
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Controller
                control={control}
                name="iccid"
                render={({ field }) => (
                  <Field
                    label="SIM ICCID"
                    placeholder="8925003..."
                    keyboardType="number-pad"
                    icon="hash"
                    hint="The long number printed on the back of your SIM card."
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.iccid?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="productCode"
                render={({ field }) => (
                  <Field
                    label="Price plan code"
                    placeholder="e.g. PD00000574"
                    icon="tag"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.productCode?.message}
                  />
                )}
              />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              {error ? (
                <View className="rounded-xl bg-destructive/10 p-3">
                  <Text className="text-sm text-destructive">
                    {getApiErrorMessage(error)}
                  </Text>
                </View>
              ) : null}

              <LinearGradient
                colors={HeroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 24,
                  padding: 18,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: "rgba(255,255,255,0.22)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: Colors.white }}
                    className="text-xl font-bold"
                  >
                    {(watch("fullName")?.[0] ?? "?").toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    style={{ color: Colors.white }}
                    className="text-lg font-bold"
                    numberOfLines={1}
                  >
                    {watch("fullName") || "—"}
                  </Text>
                  <Text
                    style={{ color: "rgba(255,255,255,0.8)" }}
                    className="text-sm"
                  >
                    {watch("msisdn")}
                  </Text>
                </View>
              </LinearGradient>

              <Section title="Number" onEdit={() => setStep(0)}>
                <ReviewRow
                  icon="smartphone"
                  label="Phone number"
                  value={watch("msisdn")}
                />
              </Section>

              <Section title="Details" onEdit={() => setStep(1)}>
                <ReviewRow
                  icon="users"
                  label="Customer type"
                  value={CUST_TYPES.find((t) => t.value === custType)?.label}
                />
                <ReviewRow
                  icon="calendar"
                  label="Date of birth"
                  value={formatYmd(watch("birthDay"))}
                />
                <ReviewRow
                  icon="map-pin"
                  label="Address"
                  value={watch("addressDetail")}
                />
                {watch("email") ? (
                  <ReviewRow icon="mail" label="Email" value={watch("email")} />
                ) : null}
              </Section>

              <Section title="SIM & plan" onEdit={() => setStep(2)}>
                <ReviewRow icon="hash" label="ICCID" value={watch("iccid")} />
                <ReviewRow
                  icon="tag"
                  label="Price plan"
                  value={watch("productCode")}
                />
              </Section>
            </>
          )}
        </ScrollView>

        <View className="px-6 pb-4 pt-2">
          {step === STEPS.length - 1 ? (
            <Button onPress={handleSubmit(onSubmit)} loading={activating}>
              Activate my line
            </Button>
          ) : (
            <Button onPress={goNext}>Continue</Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
