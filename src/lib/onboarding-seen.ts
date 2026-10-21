import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'kopa-telecom-onboarding-seen';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, 'true');
  } catch {
    // Non-critical — worst case the carousel reappears once more.
  }
}
