/**
 * Design System — Shadow / Elevation Tokens
 *
 * Elevation system using box-shadow. Higher values = more prominent.
 * All shadows use dark-appropriate rgba values.
 */

export const shadows = {
  none: 'none',

  /** Subtle lift — cards, inputs on focus */
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',

  /** Default card elevation */
  md: '0 4px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',

  /** Dropdowns, popovers */
  lg: '0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.2)',

  /** Modals */
  xl: '0 20px 25px rgba(0, 0, 0, 0.5), 0 8px 10px rgba(0, 0, 0, 0.3)',

  /** Full-screen overlays */
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.6)',

  /** Accent glow — primary buttons, focused inputs */
  accent: '0 0 0 3px rgba(124, 58, 237, 0.25)',

  /** Status glows */
  success: '0 0 0 3px rgba(74, 222, 128, 0.2)',
  danger:  '0 0 0 3px rgba(248, 113, 113, 0.2)',
  warning: '0 0 0 3px rgba(251, 191, 36, 0.2)',

  /** Button ambient glow */
  buttonPrimary: '0 0 20px rgba(124, 58, 237, 0.2), 0 0 40px rgba(124, 58, 237, 0.08)',
} as const;

export type ShadowToken = keyof typeof shadows;
