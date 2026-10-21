import { useEffect, useRef } from 'react';

import { secureStorageReadJson, secureStorageWriteJson } from '@/lib/secureStorage';
import { authHydrated, sessionEstablished, type AuthSession } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const AUTH_STORAGE_KEY = 'kopa-telecom-auth-session';

/** Persists the auth session via expo-secure-store. Hydrates once on mount, then writes on
 *  every change. A session past its expiresAt is dropped rather than restored, so a stale token
 *  never gets sent to the backend only to bounce back as a 401. */
export function useAuthPersistence() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void secureStorageReadJson<AuthSession | null>(AUTH_STORAGE_KEY, null).then((stored) => {
      if (!cancelled) {
        if (stored && new Date(stored.expiresAt).getTime() > Date.now()) {
          dispatch(sessionEstablished(stored));
        }
        dispatch(authHydrated());
      }
      hydratedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    void secureStorageWriteJson(AUTH_STORAGE_KEY, session);
  }, [session]);
}
