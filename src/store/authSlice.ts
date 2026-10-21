import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthSession {
  customerId: string;
  msisdn: string;
  token: string;
  expiresAt: string;
}

interface AuthState {
  session: AuthSession | null;
  /**
   * Whether the initial secure-storage read has completed. On a cold start,
   * Redux re-initializes with `session: null` before that async read
   * resolves — route guards must wait for `hydrated` before deciding to
   * redirect to login, or a valid session gets kicked to the login screen
   * on every launch.
   */
  hydrated: boolean;
}

const initialState: AuthState = { session: null, hydrated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionEstablished(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
    },
    loggedOut(state) {
      state.session = null;
    },
    authHydrated(state) {
      state.hydrated = true;
    },
  },
});

export const { sessionEstablished, loggedOut, authHydrated } = authSlice.actions;
export default authSlice.reducer;
