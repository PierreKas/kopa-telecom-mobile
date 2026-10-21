import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import { loggedOut } from './authSlice';

/** Minimal shape of the slice this needs from RootState — avoids a circular import with
 *  store.ts (which imports the API slices built from this factory). */
interface AuthOnlyState {
  auth: { session: { token: string } | null };
}

/**
 * One fetchBaseQuery factory shared by every API slice (identityApi, selfCareApi) — injects the
 * bearer token from the auth slice on every request, and clears the session on a 401 so the
 * navigation guard redirects to login instead of the app sitting on a dead session.
 */
export function createApiBaseQuery(baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AuthOnlyState).auth.session?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
      api.dispatch(loggedOut());
    }
    return result;
  };
}
