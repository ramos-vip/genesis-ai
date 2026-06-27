/**
 * Design System — Border Radius Tokens
 *
 * Consistent rounding scale across all components.
 */

export const radius = {
  none:  '0px',
  sm:    '4px',
  md:    '6px',
  lg:    '8px',
  xl:    '12px',
  '2xl': '16px',
  '3xl': '24px',
  full:  '9999px',
} as const;

/** Component-level radius presets */
export const componentRadius = {
  button: {
    sm:  radius.md,
    md:  radius.lg,
    lg:  radius.xl,
    xl:  radius.xl,
  },
  input:   radius.lg,
  card:    radius['2xl'],
  badge:   radius.full,
  avatar:  radius.full,
  modal:   radius['2xl'],
  tooltip: radius.lg,
  dropdown: radius.xl,
} as const;

export type RadiusToken = keyof typeof radius;
