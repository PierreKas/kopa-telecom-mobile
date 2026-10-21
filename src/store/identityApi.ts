import { createApi } from '@reduxjs/toolkit/query/react';

import { createApiBaseQuery } from './createApiBaseQuery';
import type { ApiResponse } from './apiTypes';

// iOS simulator can reach the host machine via localhost; Android emulator needs 10.0.2.2; a
// physical device needs the dev machine's real LAN IP — set EXPO_PUBLIC_IDENTITY_API_BASE_URL in
// .env for those cases (see .env.example).
const BASE_URL = process.env.EXPO_PUBLIC_IDENTITY_API_BASE_URL?.trim() || 'http://localhost:8083/kopa-customer-identity';

export interface LoginResponse {
  customerId: string;
  msisdn: string;
  token: string;
  expiresAt: string;
}

export interface MsisdnStatusResponse {
  available: boolean;
}

export interface MsisdnSuggestionsResponse {
  msisdns: string[];
}

export interface PricePlan {
  productCode: string;
  productName: string;
  productGroup: string;
}

export interface VerifyNidaResponse {
  verified: boolean;
  name: string | null;
  birthday: string | null;
  gender: string | null;
}

export interface VerifyRraResponse {
  verified: boolean;
  supplierName: string | null;
  province: string | null;
  district: string | null;
  sector: string | null;
  cell: string | null;
}

export interface VerifyPassportResponse {
  verified: boolean;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  sex: string | null;
}

export interface ActivateRequest {
  msisdn: string;
  iccid: string;
  productCode: string;
  custType: 'A' | 'B' | 'C' | 'D' | 'E';
  fullName: string;
  birthDay: string;
  addressDetail: string;
  email?: string;
  corpRegNo?: string;
  bizRegNo?: string;
}

export interface ActivateResponse {
  customerId: string;
  msisdn: string;
  status: string;
  token: string;
  expiresAt: string;
}

export interface ProfileResponse {
  customerId: string;
  msisdn: string;
  fullName: string;
  email: string | null;
  addressDetail: string | null;
  custType: string;
  birthDay: string | null;
  status: string;
}

export const identityApi = createApi({
  reducerPath: 'identityApi',
  baseQuery: createApiBaseQuery(BASE_URL),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // /auth/login is the one customer-identity endpoint whose success body IS
    // ApiResponse<T>-wrapped — every /registration/** endpoint below returns the plain DTO.
    login: builder.mutation<LoginResponse, { msisdn: string; pin: string }>({
      query: (body) => ({ url: '/api/v1/auth/login', method: 'POST', body }),
      transformResponse: (response: ApiResponse<LoginResponse>) => response.data,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/api/v1/auth/logout', method: 'POST' }),
    }),
    setPin: builder.mutation<void, { pin: string }>({
      query: (body) => ({ url: '/api/v1/auth/pin/set', method: 'POST', body }),
    }),
    changePin: builder.mutation<void, { currentPin: string; newPin: string }>({
      query: (body) => ({ url: '/api/v1/auth/pin/change', method: 'POST', body }),
    }),
    requestPinReset: builder.mutation<void, { msisdn: string }>({
      query: (body) => ({ url: '/api/v1/auth/pin/reset/request', method: 'POST', body }),
    }),
    confirmPinReset: builder.mutation<void, { msisdn: string; code: string; newPin: string }>({
      query: (body) => ({ url: '/api/v1/auth/pin/reset/confirm', method: 'POST', body }),
    }),
    getMsisdnStatus: builder.query<MsisdnStatusResponse, string>({
      query: (msisdn) => `/api/v1/registration/msisdn-status/${msisdn}`,
    }),
    getMsisdnSuggestions: builder.query<MsisdnSuggestionsResponse, void>({
      query: () => '/api/v1/registration/msisdn-suggestions',
    }),
    getPricePlans: builder.mutation<{ plans: PricePlan[] }, { msisdn: string; iccid: string }>({
      query: (body) => ({ url: '/api/v1/registration/price-plans', method: 'POST', body }),
    }),
    verifyNida: builder.mutation<VerifyNidaResponse, { msisdn: string; nationalId: string; photoBase64: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/registration/verify-nida/${msisdn}`, method: 'POST', body }),
    }),
    verifyRra: builder.mutation<VerifyRraResponse, { msisdn: string; tin: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/registration/verify-rra/${msisdn}`, method: 'POST', body }),
    }),
    verifyPassport: builder.mutation<VerifyPassportResponse, { msisdn: string; docNumber: string; issuedBy: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/registration/verify-passport/${msisdn}`, method: 'POST', body }),
    }),
    activate: builder.mutation<ActivateResponse, ActivateRequest>({
      query: (body) => ({ url: '/api/v1/registration/activate', method: 'POST', body }),
    }),
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/api/v1/profile/me',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileResponse, { fullName?: string; email?: string; addressDetail?: string }>({
      query: (body) => ({ url: '/api/v1/profile/me', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSetPinMutation,
  useChangePinMutation,
  useRequestPinResetMutation,
  useConfirmPinResetMutation,
  useGetMsisdnStatusQuery,
  useLazyGetMsisdnStatusQuery,
  useGetMsisdnSuggestionsQuery,
  useGetPricePlansMutation,
  useVerifyNidaMutation,
  useVerifyRraMutation,
  useVerifyPassportMutation,
  useActivateMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = identityApi;
