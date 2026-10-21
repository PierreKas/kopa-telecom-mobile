import * as SecureStore from 'expo-secure-store';

/**
 * Backed by iOS Keychain / Android Keystore — the only place the session
 * bearer token is ever written. Never put it in AsyncStorage/plain state
 * persistence.
 */
export async function secureStorageReadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    await secureStorageRemove(key);
    return fallback;
  }
}

export async function secureStorageWriteJson(key: string, value: unknown): Promise<boolean> {
  try {
    if (value === null || value === undefined) {
      await secureStorageRemove(key);
      return true;
    }
    await SecureStore.setItemAsync(key, JSON.stringify(value));
    return true;
  } catch {
    await secureStorageRemove(key);
    return false;
  }
}

export async function secureStorageRemove(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Best effort cleanup only.
  }
}
