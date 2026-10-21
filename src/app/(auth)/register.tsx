import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { getApiErrorMessage } from '@/lib/api-error-message';
import { Colors } from '@/constants/theme';
import { sessionEstablished } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { useActivateMutation, useGetMsisdnSuggestionsQuery, useLazyGetMsisdnStatusQuery } from '@/store/identityApi';

const CUST_TYPES = [
  { value: 'A', label: 'Individual' },
  { value: 'B', label: 'Self-employed' },
  { value: 'C', label: 'Foreigner' },
  { value: 'D', label: 'Corporate' },
  { value: 'E', label: 'Public sector' },
] as const;

const schema = z.object({
  msisdn: z.string().regex(/^\d{6,15}$/, 'Choose or enter a valid phone number'),
  custType: z.enum(['A', 'B', 'C', 'D', 'E']),
  fullName: z.string().min(2, 'Enter your full name'),
  birthDay: z.string().regex(/^\d{8}$/, 'Use YYYYMMDD, e.g. 19950414'),
  addressDetail: z.string().min(2, 'Enter your address'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  corpRegNo: z.string().optional(),
  bizRegNo: z.string().optional(),
  iccid: z.string().regex(/^\d{10,19}$/, 'ICCID must be 10-19 digits (printed on the SIM)'),
  productCode: z.string().min(1, 'Enter the price plan product code'),
});
type FormValues = z.infer<typeof schema>;

const STEPS = ['Number', 'Your details', 'SIM & plan', 'Review'] as const;

export default function Register() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const { data: suggestions } = useGetMsisdnSuggestionsQuery();
  const [checkStatus, { data: statusResult, isFetching: checkingStatus }] = useLazyGetMsisdnStatusQuery();
  const [activate, { isLoading, error }] = useActivateMutation();

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      msisdn: '',
      custType: 'A',
      fullName: '',
      birthDay: '',
      addressDetail: '',
      email: '',
      corpRegNo: '',
      bizRegNo: '',
      iccid: '',
      productCode: '',
    },
  });

  const custType = watch('custType');
  const needsBizRegNo = custType === 'B' || custType === 'D' || custType === 'E';

  async function goNext() {
    const fieldsByStep: (keyof FormValues)[][] = [
      ['msisdn'],
      ['custType', 'fullName', 'birthDay', 'addressDetail', 'email', 'corpRegNo', 'bizRegNo'],
      ['iccid', 'productCode'],
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
      dispatch(sessionEstablished({ customerId: response.customerId, msisdn: response.msisdn, token: response.token, expiresAt: response.expiresAt }));
      router.replace('/(auth)/set-pin');
    } catch {
      // error shown below via the mutation's `error`
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={goBack} hitSlop={8}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text className="text-sm font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </Text>
      </View>

      <View className="mb-2 flex-row gap-1.5 px-6">
        {STEPS.map((label, i) => (
          <View key={label} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: i <= step ? Colors.primary : Colors.gray5 }} />
        ))}
      </View>

      <ScrollView contentContainerClassName="px-6 py-6 gap-5" keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <>
            <Text className="mb-1 text-2xl font-bold text-foreground">Choose your number</Text>
            <Text className="mb-2 text-base text-muted-foreground">Pick one of the available numbers below, or enter your own.</Text>

            {suggestions?.msisdns.length ? (
              <View className="flex-row flex-wrap gap-2">
                {suggestions.msisdns.map((number) => (
                  <Controller
                    key={number}
                    control={control}
                    name="msisdn"
                    render={({ field }) => (
                      <Pressable
                        onPress={() => field.onChange(number)}
                        className="rounded-full border px-4 py-2"
                        style={{
                          borderColor: field.value === number ? Colors.primary : Colors.border,
                          backgroundColor: field.value === number ? Colors.primary : 'transparent',
                        }}>
                        <Text style={{ color: field.value === number ? Colors.white : Colors.textPrimary }} className="font-medium">
                          {number}
                        </Text>
                      </Pressable>
                    )}
                  />
                ))}
              </View>
            ) : null}

            <Controller
              control={control}
              name="msisdn"
              render={({ field }) => (
                <TextField
                  label="Or enter a number"
                  placeholder="0771234567"
                  keyboardType="phone-pad"
                  leftIcon="smartphone"
                  value={field.value}
                  onChangeText={(text) => field.onChange(text)}
                  onEndEditing={() => field.value.length >= 6 && checkStatus(field.value)}
                  error={errors.msisdn?.message}
                />
              )}
            />
            {checkingStatus ? <Text className="text-sm text-muted-foreground">Checking availability…</Text> : null}
            {statusResult && !checkingStatus ? (
              <Text className={`text-sm ${statusResult.available ? 'text-success' : 'text-destructive'}`}>
                {statusResult.available ? 'This number is available.' : 'This number is already taken.'}
              </Text>
            ) : null}
          </>
        )}

        {step === 1 && (
          <>
            <Text className="mb-1 text-2xl font-bold text-foreground">Your details</Text>
            <Text className="mb-2 text-base text-muted-foreground">This information is sent to KTRN to register your line.</Text>

            <Text className="text-sm font-medium text-foreground">Customer type</Text>
            <Controller
              control={control}
              name="custType"
              render={({ field }) => (
                <View className="flex-row flex-wrap gap-2">
                  {CUST_TYPES.map((type) => (
                    <Pressable
                      key={type.value}
                      onPress={() => field.onChange(type.value)}
                      className="rounded-full border px-4 py-2"
                      style={{
                        borderColor: field.value === type.value ? Colors.primary : Colors.border,
                        backgroundColor: field.value === type.value ? Colors.primary : 'transparent',
                      }}>
                      <Text style={{ color: field.value === type.value ? Colors.white : Colors.textPrimary }} className="font-medium">
                        {type.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />

            <Controller
              control={control}
              name="fullName"
              render={({ field }) => (
                <TextField label="Full name" placeholder="Jane Uwimana" leftIcon="user" value={field.value} onChangeText={field.onChange} error={errors.fullName?.message} />
              )}
            />
            <Controller
              control={control}
              name="birthDay"
              render={({ field }) => (
                <TextField
                  label="Date of birth (YYYYMMDD)"
                  placeholder="19950414"
                  keyboardType="number-pad"
                  leftIcon="calendar"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.birthDay?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="addressDetail"
              render={({ field }) => (
                <TextField label="Address" placeholder="KG 11 Ave, Kigali" leftIcon="map-pin" value={field.value} onChangeText={field.onChange} error={errors.addressDetail?.message} />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <TextField label="Email (optional)" placeholder="jane@example.com" keyboardType="email-address" autoCapitalize="none" leftIcon="mail" value={field.value} onChangeText={field.onChange} error={errors.email?.message} />
              )}
            />
            <Controller
              control={control}
              name="corpRegNo"
              render={({ field }) => (
                <TextField
                  label={custType === 'C' ? 'Passport number' : 'National ID'}
                  placeholder="1 1990 8 1234567 1 23"
                  leftIcon="credit-card"
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )}
            />
            {needsBizRegNo ? (
              <Controller
                control={control}
                name="bizRegNo"
                render={({ field }) => <TextField label="Business registration number" leftIcon="briefcase" value={field.value} onChangeText={field.onChange} />}
              />
            ) : null}
          </>
        )}

        {step === 2 && (
          <>
            <Text className="mb-1 text-2xl font-bold text-foreground">SIM & plan</Text>
            <Text className="mb-2 text-base text-muted-foreground">Enter the ICCID printed on your SIM card and the price plan you want.</Text>
            <Controller
              control={control}
              name="iccid"
              render={({ field }) => (
                <TextField
                  label="SIM ICCID"
                  placeholder="8925003..."
                  keyboardType="number-pad"
                  leftIcon="credit-card"
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
                <TextField label="Price plan code" placeholder="e.g. PD00000574" leftIcon="tag" value={field.value} onChangeText={field.onChange} error={errors.productCode?.message} />
              )}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text className="mb-1 text-2xl font-bold text-foreground">Review</Text>
            <Text className="mb-2 text-base text-muted-foreground">Check your details before submitting to KTRN.</Text>

            {error ? (
              <View className="rounded-xl bg-destructive/10 p-3">
                <Text className="text-sm text-destructive">{getApiErrorMessage(error)}</Text>
              </View>
            ) : null}

            <Card className="gap-3">
              <ReviewRow label="Number" value={watch('msisdn')} />
              <ReviewRow label="Customer type" value={CUST_TYPES.find((t) => t.value === custType)?.label ?? custType} />
              <ReviewRow label="Full name" value={watch('fullName')} />
              <ReviewRow label="Date of birth" value={watch('birthDay')} />
              <ReviewRow label="Address" value={watch('addressDetail')} />
              <ReviewRow label="ICCID" value={watch('iccid')} />
              <ReviewRow label="Price plan" value={watch('productCode')} />
            </Card>
          </>
        )}
      </ScrollView>

      <View className="px-6 pb-4 pt-2">
        {step === STEPS.length - 1 ? (
          <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
            Activate my line
          </Button>
        ) : (
          <Button onPress={goNext}>Continue</Button>
        )}
      </View>
    </SafeAreaView>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <View className="flex-row justify-between border-b border-border/60 pb-3">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className="font-medium text-foreground">{value || '—'}</Text>
    </View>
  );
}
