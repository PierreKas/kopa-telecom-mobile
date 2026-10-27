/**
 * Mock data shaped exactly like the backend's real DTOs (the types imported below are the same
 * ones the RTK Query API slices already use against the real endpoints - see identityApi.ts /
 * selfCareApi.ts). When a screen flips USE_MOCK (mock-config.ts) back to false, no data shape
 * changes - only the source of the data does.
 *
 * Field values deliberately avoid thousand-separator formatting (e.g. "12450" not "12,450") -
 * KTRN's own response fields (REMAIN_AMT, TOTAL_VOLUME, ...) and the local Transaction entity's
 * BigDecimal#toPlainString() both come through unformatted, and every screen already renders
 * amount/currency as two separate raw fields rather than pre-formatting them.
 */
import type {
  ActivateResponse,
  LoginResponse,
  MsisdnStatusResponse,
  MsisdnSuggestionsResponse,
  ProfileResponse,
} from '@/store/identityApi';
import type { Balance, Bundle, StatementEntry, TransactionResult, UsageItem } from '@/store/selfCareApi';

// Not part of any backend DTO - ProfileResponse has no avatar field at all. Kept separate so it's
// obviously a frontend-only placeholder rather than something that looks like it came from the API.
export const MOCK_AVATAR_URL = 'https://i.pravatar.cc/200?img=47';

export const MOCK_MSISDN = '0771234567';

export const MOCK_PROFILE: ProfileResponse = {
  customerId: 'f1a2b3c4-5d6e-4f70-8a9b-0c1d2e3f4a5b',
  msisdn: MOCK_MSISDN,
  fullName: 'Sarah Uwase',
  email: 'sarah.uwase@example.com',
  addressDetail: 'KG 11 Ave, Kigali',
  custType: 'A',
  birthDay: '19950414',
  status: 'ACTIVE',
};

export const MOCK_BALANCE: Balance = {
  msisdn: MOCK_MSISDN,
  ispCd: null,
  remainingAmount: '12450',
  currency: 'RWF',
  retrievedAt: '2026-10-27T07:30:00Z',
};

// productName carries "data"/"voice" so the same `.find()` logic the real UsageItem[] response
// is matched against in Home works unchanged against this mock.
export const MOCK_USAGE_ITEMS: UsageItem[] = [
  {
    productCode: 'PD00000574',
    productName: 'G-MAX Monthly 5GB Data Bundle',
    flag: 'V',
    allowance: '5 GB',
    usage: '1.8 GB',
    remaining: '3.2 GB',
  },
  {
    productCode: 'PD00001042',
    productName: 'G-MAX Monthly 500min Voice Bundle',
    flag: 'V',
    allowance: '500 min',
    usage: '355 min',
    remaining: '145 min',
  },
];

export const MOCK_BUNDLES: Bundle[] = [
  { productCode: 'PD00000574', productName: 'G-MAX Monthly 5GB Data Bundle', price: '5000' },
  { productCode: 'PD00000760', productName: 'G-MAX Weekly 1GB Data Bundle', price: '1500' },
  { productCode: 'PD00000931', productName: 'G-MAX Daily 500MB Data Bundle', price: '500' },
  { productCode: 'PD00001042', productName: 'G-MAX Monthly 500min Voice Bundle', price: '3000' },
  { productCode: 'PD00001177', productName: 'G-MAX Combo 2GB + 100min Bundle', price: '2500' },
];

// A mix of LOCAL (this app's own transactions table) and KTRN_HISTORY (HP00005/HPOP101's
// BUNDLE_HIST) entries, same as the real /api/v1/statement/{msisdn} response will contain once
// wired up (architecture-reference.md s5.2) - see StatementEntryDto on the backend.
export const MOCK_STATEMENT_ENTRIES: StatementEntry[] = [
  {
    id: '3f2504e0-4f89-41d3-9a0c-0305e82c3301',
    source: 'LOCAL',
    transactionType: 'RECHARGE',
    productCode: null,
    amount: '5000',
    currency: 'RWF',
    status: 'SUCCESS',
    ktrnMessage: 'IT HAS BEEN SUCCESSFULLY PROCESSED.',
    requestedAt: '2026-10-20T14:32:00Z',
    completedAt: '2026-10-20T14:32:04Z',
    expiresAt: null,
  },
  {
    id: 'a1b2c3d4-e5f6-4789-90ab-cdef01234567',
    source: 'LOCAL',
    transactionType: 'BUNDLE_PURCHASE',
    productCode: 'PD00001177',
    amount: '2500',
    currency: 'RWF',
    status: 'OTP_PENDING',
    ktrnMessage: null,
    requestedAt: '2026-10-18T09:10:00Z',
    completedAt: null,
    expiresAt: null,
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    source: 'LOCAL',
    transactionType: 'BUNDLE_PURCHASE',
    productCode: 'PD00000760',
    amount: '1500',
    currency: 'RWF',
    status: 'FAILED',
    ktrnMessage: 'THE SUBSCRIBER DOES NOT EXIST OR IS NOT ACTIVE.',
    requestedAt: '2026-10-15T19:45:00Z',
    completedAt: '2026-10-15T19:45:03Z',
    expiresAt: null,
  },
  {
    id: null,
    source: 'KTRN_HISTORY',
    transactionType: 'PURCHASE',
    productCode: 'G-MAX NEW MONTHLY UNLIMITED 1GB BUNDLE(PRE)',
    amount: '25000',
    currency: 'RWF',
    status: 'Y',
    ktrnMessage: null,
    requestedAt: '2026-10-11T11:53:04Z',
    completedAt: '2026-10-11T11:53:04Z',
    expiresAt: '2026-11-09T23:59:59Z',
  },
];

export const MOCK_LOGIN_RESPONSE: LoginResponse = {
  customerId: MOCK_PROFILE.customerId,
  msisdn: MOCK_MSISDN,
  token: 'mock-session-token',
  expiresAt: '2026-10-28T07:30:00Z',
};

export const MOCK_ACTIVATE_RESPONSE: ActivateResponse = {
  customerId: MOCK_PROFILE.customerId,
  msisdn: MOCK_MSISDN,
  status: 'ACTIVE',
  token: 'mock-session-token',
  expiresAt: '2026-10-28T07:30:00Z',
};

export const MOCK_MSISDN_STATUS: MsisdnStatusResponse = { available: true };

export const MOCK_MSISDN_SUGGESTIONS: MsisdnSuggestionsResponse = {
  msisdns: ['0781234567', '0781234568', '0781234569', '0781234570', '0781234571'],
};

export function mockTransactionResult(status: 'SUCCESS' | 'OTP_PENDING' | 'FAILED'): TransactionResult {
  if (status === 'OTP_PENDING') {
    return { transactionId: '9e8d7c6b-5a4f-4321-b0a9-f8e7d6c5b4a3', status: 'OTP_PENDING' };
  }
  if (status === 'FAILED') {
    return {
      transactionId: '9e8d7c6b-5a4f-4321-b0a9-f8e7d6c5b4a3',
      status: 'FAILED',
      ktrnMessage: 'THE SUBSCRIBER DOES NOT EXIST OR IS NOT ACTIVE.',
    };
  }
  return {
    transactionId: '9e8d7c6b-5a4f-4321-b0a9-f8e7d6c5b4a3',
    status: 'SUCCESS',
    ktrnMessage: 'IT HAS BEEN SUCCESSFULLY PROCESSED.',
  };
}
