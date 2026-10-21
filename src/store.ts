import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

import authReducer, { loggedOut } from './store/authSlice';
import { identityApi } from './store/identityApi';
import { selfCareApi } from './store/selfCareApi';

/** Logging out leaves RTK Query's cached balance/usage/bundles/transactions sitting in the
 *  store — a second account logging in right after would see the FIRST account's cached data
 *  until something forced a refetch. Reacting to `loggedOut` in one place means every current
 *  and future query gets this for free. */
const clearApiCachesOnLogout: Middleware = (api) => (next) => (action) => {
  const result = next(action);
  if (loggedOut.match(action)) {
    next(identityApi.util.resetApiState());
    next(selfCareApi.util.resetApiState());
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [identityApi.reducerPath]: identityApi.reducer,
    [selfCareApi.reducerPath]: selfCareApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clearApiCachesOnLogout, identityApi.middleware, selfCareApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
