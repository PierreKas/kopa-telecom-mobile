/**
 * Kopa Telecom brand tokens, lifted from the Flutter kopa_finance app's
 * lib/theme/app_theme.dart (AppTheme.*Color constants) — the authoritative
 * source for these values, kept in sync with src/constants/theme.ts.
 */
module.exports = {
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        foreground: '#2D3436',
        card: '#FFFFFF',
        'card-foreground': '#2D3436',
        primary: '#C5499A',
        'primary-foreground': '#FFFFFF',
        'primary-dark': '#481A38',
        secondary: '#D1F931',
        'secondary-foreground': '#2D3436',
        muted: '#EDEDED',
        'muted-foreground': '#636E72',
        accent: '#F6E2EF',
        'accent-foreground': '#C5499A',
        destructive: '#EB5757',
        'destructive-foreground': '#FFFFFF',
        success: '#27AE60',
        'success-foreground': '#FFFFFF',
        warning: '#E2B93B',
        'warning-foreground': '#2D3436',
        info: '#2F80ED',
        'info-foreground': '#FFFFFF',
        border: '#DDD6FE',
      },
      borderRadius: {
        lg: 16,
        xl: 22,
        '2xl': 28,
      },
      fontFamily: {
        sans: ['Poppins_400Regular'],
        medium: ['Poppins_500Medium'],
        semibold: ['Poppins_600SemiBold'],
        bold: ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
