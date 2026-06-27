/**
 * Design System — Color Tokens
 *
 * Single source of truth for all colors. CSS variables in globals.css
 * @theme block are kept in sync with these values.
 */

export const palette = {
  neutral: {
    0:    '#ffffff',
    50:   '#fafafa',
    100:  '#f4f4f5',
    200:  '#e4e4e7',
    300:  '#d4d4d8',
    400:  '#a1a1aa',
    500:  '#71717a',
    600:  '#52525b',
    700:  '#3f3f46',
    800:  '#27272a',
    850:  '#1c1c1f',
    900:  '#18181b',
    925:  '#14141a',
    950:  '#0d0d12',
    975:  '#07070a',
    1000: '#000000',
  },
  violet: {
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  blue: {
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  green: {
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  yellow: {
    300: '#fde047',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  red: {
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

/** Semantic tokens — reference these in component code */
export const colors = {
  // ── Backgrounds ──────────────────────────────────────────────
  background:       palette.neutral[975],
  surface:          palette.neutral[950],
  surfaceElevated:  palette.neutral[925],
  surfaceOverlay:   '#1a1a22',

  // ── Borders ──────────────────────────────────────────────────
  border:           'rgba(255, 255, 255, 0.06)',
  borderHover:      'rgba(255, 255, 255, 0.12)',
  borderFocus:      'rgba(124, 58, 237, 0.6)',

  // ── Accent / Primary ─────────────────────────────────────────
  accent:           palette.violet[600],
  accentHover:      palette.violet[700],
  accentMuted:      'rgba(124, 58, 237, 0.12)',
  accentSubtle:     'rgba(124, 58, 237, 0.06)',

  // ── Text ─────────────────────────────────────────────────────
  text: {
    primary:   '#f0f0f2',
    secondary: palette.neutral[500],
    muted:     palette.neutral[600],
    disabled:  palette.neutral[700],
    inverse:   palette.neutral[900],
  },

  // ── Status ───────────────────────────────────────────────────
  success: {
    text:   palette.green[400],
    bg:     'rgba(74, 222, 128, 0.08)',
    border: 'rgba(74, 222, 128, 0.2)',
  },
  warning: {
    text:   palette.yellow[400],
    bg:     'rgba(251, 191, 36, 0.08)',
    border: 'rgba(251, 191, 36, 0.2)',
  },
  danger: {
    text:   palette.red[400],
    bg:     'rgba(248, 113, 113, 0.08)',
    border: 'rgba(248, 113, 113, 0.2)',
  },
  info: {
    text:   palette.blue[400],
    bg:     'rgba(96, 165, 250, 0.08)',
    border: 'rgba(96, 165, 250, 0.2)',
  },
} as const;

export type ColorToken = typeof colors;
