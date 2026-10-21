import { Image } from 'react-native';

/** Full "KOPA TELECOM" wordmark — from the Flutter kopa_finance app's assets/logo.png. */
export function KopaWordmark({ className, width = 220 }: { className?: string; width?: number }) {
  return (
    <Image
      source={require('@/assets/images/brand/logo-wordmark.png')}
      style={{ width, height: (width * 180) / 350 }}
      resizeMode="contain"
      className={className}
    />
  );
}

/** Signal/wifi icon mark on a lime badge — the avatar-slot icon from the kopa_finance reference
 *  screens. Source asset is only 100x100 (see KopaTelecom/README follow-ups) — fine at the small
 *  sizes used here, would look soft blown up past ~120px. */
export function KopaIcon({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      source={require('@/assets/images/brand/logo-icon.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      className={className}
    />
  );
}
