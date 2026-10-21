import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiErrorBody } from '@/store/apiTypes';

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

/** Every error response from both backend services is ApiResponse<Void>-shaped (see
 *  apiTypes.ts) — this extracts the human-readable message regardless of which service /
 *  which endpoint threw it. */
export function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return FALLBACK_MESSAGE;

  const fetchError = error as FetchBaseQueryError;
  if ('status' in fetchError) {
    if (fetchError.status === 'FETCH_ERROR' || fetchError.status === 'TIMEOUT_ERROR') {
      return 'Could not reach the server. Check your connection and try again.';
    }
    const data = fetchError.data as ApiErrorBody | undefined;
    return data?.error?.message || FALLBACK_MESSAGE;
  }

  return FALLBACK_MESSAGE;
}
