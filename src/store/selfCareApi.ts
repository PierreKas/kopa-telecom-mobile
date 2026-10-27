import { createApi } from '@reduxjs/toolkit/query/react';

import { createApiBaseQuery } from './createApiBaseQuery';
import type { ApiResponse } from './apiTypes';

const BASE_URL = process.env.EXPO_PUBLIC_SELFCARE_API_BASE_URL?.trim() || 'http://localhost:8081/kopa-customer-self-care';

export interface Balance {
  msisdn: string;
  ispCd: string | null;
  remainingAmount: string;
  currency: string;
  retrievedAt: string;
}

export interface UsageItem {
  productCode: string;
  productName: string;
  flag: string;
  allowance: string;
  usage: string;
  remaining: string;
}

export interface Bundle {
  productCode: string;
  productName: string;
  price: string;
}

export interface TransactionResult {
  transactionId: string;
  status: string;
  ktrnMessage?: string | null;
  result?: string | null;
  message?: string | null;
}

export interface StatementEntry {
  id: string | null;
  // "LOCAL" (this app's own transactions table) or "KTRN_HISTORY" (HP00005/HPOP101's
  // BUNDLE_HIST) - the two have different provenance and no local id for KTRN_HISTORY rows.
  source: 'LOCAL' | 'KTRN_HISTORY';
  transactionType: string;
  productCode: string | null;
  amount: string | null;
  currency: string;
  status: string;
  ktrnMessage: string | null;
  requestedAt: string | null;
  completedAt: string | null;
  // Only ever populated for KTRN_HISTORY entries (the bundle's validity end).
  expiresAt: string | null;
}

// Every customer-self-care endpoint wraps its success body in ApiResponse<T> — unlike
// customer-identity, where only /auth/login does. One shared unwrap helper for all of them.
function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export const selfCareApi = createApi({
  reducerPath: 'selfCareApi',
  baseQuery: createApiBaseQuery(BASE_URL),
  tagTypes: ['Balance', 'Usage', 'Bundles', 'Statement'],
  endpoints: (builder) => ({
    getBalance: builder.query<Balance, string>({
      query: (msisdn) => `/api/v1/balance/${msisdn}`,
      transformResponse: unwrap<Balance>,
      providesTags: ['Balance'],
    }),
    getUsage: builder.query<{ msisdn: string; items: UsageItem[] }, string>({
      query: (msisdn) => `/api/v1/usage/${msisdn}`,
      transformResponse: unwrap<{ msisdn: string; items: UsageItem[] }>,
      providesTags: ['Usage'],
    }),
    getBundles: builder.query<{ msisdn: string; bundles: Bundle[] }, string>({
      query: (msisdn) => `/api/v1/bundles/${msisdn}`,
      transformResponse: unwrap<{ msisdn: string; bundles: Bundle[] }>,
      providesTags: ['Bundles'],
    }),
    purchaseBundle: builder.mutation<TransactionResult, { msisdn: string; productCode: string; price?: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/bundles/${msisdn}/purchase`, method: 'POST', body }),
      transformResponse: unwrap<TransactionResult>,
    }),
    recharge: builder.mutation<TransactionResult, { msisdn: string; nationalId: string; approvalNo: string; amount: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/recharge/${msisdn}`, method: 'POST', body }),
      transformResponse: unwrap<TransactionResult>,
    }),
    rechargeByVoucher: builder.mutation<TransactionResult, { msisdn: string; voucherNumber: string }>({
      query: ({ msisdn, ...body }) => ({ url: `/api/v1/recharge/${msisdn}/voucher`, method: 'POST', body }),
      transformResponse: unwrap<TransactionResult>,
    }),
    cancelRecharge: builder.mutation<TransactionResult, { msisdn: string; transactionId: string; nationalId: string; cancelAmount: string }>({
      query: ({ msisdn, transactionId, ...body }) => ({
        url: `/api/v1/recharge/${msisdn}/${transactionId}/cancel`,
        method: 'POST',
        body,
      }),
      transformResponse: unwrap<TransactionResult>,
    }),
    verifyTransactionOtp: builder.mutation<TransactionResult, { msisdn: string; transactionId: string; code: string }>({
      query: ({ msisdn, transactionId, code }) => ({
        url: `/api/v1/transactions/${msisdn}/${transactionId}/otp/verify`,
        method: 'POST',
        body: { code },
      }),
      transformResponse: unwrap<TransactionResult>,
      invalidatesTags: ['Balance', 'Usage', 'Statement'],
    }),
    getStatement: builder.query<{ msisdn: string; entries: StatementEntry[] }, string>({
      query: (msisdn) => `/api/v1/statement/${msisdn}`,
      transformResponse: unwrap<{ msisdn: string; entries: StatementEntry[] }>,
      providesTags: ['Statement'],
    }),
  }),
});

export const {
  useGetBalanceQuery,
  useGetUsageQuery,
  useGetBundlesQuery,
  usePurchaseBundleMutation,
  useRechargeMutation,
  useRechargeByVoucherMutation,
  useCancelRechargeMutation,
  useVerifyTransactionOtpMutation,
  useGetStatementQuery,
} = selfCareApi;
