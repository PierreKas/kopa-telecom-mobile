/**
 * Kopa Telecom brand tokens — lifted from the Flutter kopa_finance app's
 * lib/theme/app_theme.dart (AppTheme.*Color constants), the authoritative
 * source for these values. Kept in sync with tailwind.config.js; this file
 * exists for the places a plain JS value is needed (gradients, icon
 * `color` props, StyleSheet) that a Tailwind class can't reach.
 */

export const Colors = {
  primary: '#C5499A',
  primaryDark: '#481A38',
  secondary: '#D1F931',
  background: '#F8F9FA',
  card: '#FFFFFF',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  border: '#DDD6FE',
  error: '#EB5757',
  success: '#27AE60',
  info: '#2F80ED',
  warning: '#E2B93B',
  white: '#FFFFFF',
  black: '#1D1D1D',
  gray2: '#4F4F4F',
  gray3: '#828282',
  gray4: '#BDBDBD',
  gray5: '#EDEDED',
} as const;

/** The hero-card gradient (balance card, recharge/bundle amount cards) seen
 *  across every kopa_finance screenshot — primary magenta to a near-black
 *  plum, top-left to bottom-right. */
export const HeroGradient = [Colors.primary, Colors.primaryDark] as const;

export const StatusPillColors = {
  active: { bg: '#FCE4F3', fg: Colors.primary },
  success: { bg: '#E3F8EE', fg: Colors.success },
  overdue: { bg: '#FDE8E8', fg: Colors.error },
  pending: { bg: '#E3EEFD', fg: Colors.info },
  warning: { bg: '#FBF1DA', fg: Colors.warning },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const CardShadow = { boxShadow: '0px 4px 16px rgba(72, 26, 56, 0.08)' } as const;

export const BottomTabInset = 80;
