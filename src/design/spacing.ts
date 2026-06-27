/**
 * Design System — Spacing Tokens
 *
 * 4px base unit grid. All layout spacing references these values.
 * Matches Tailwind's default spacing scale for consistency.
 */

export const spacing = {
  0:    '0px',
  px:   '1px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  11:   '44px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  28:   '112px',
  32:   '128px',
  36:   '144px',
  40:   '160px',
  48:   '192px',
  56:   '224px',
  64:   '256px',
} as const;

/** Component-level spacing presets */
export const componentSpacing = {
  /** Padding inside interactive elements */
  input: {
    sm: { x: spacing[3],  y: spacing[1.5] },
    md: { x: spacing[4],  y: spacing[2.5] },
    lg: { x: spacing[5],  y: spacing[3] },
  },
  /** Button horizontal padding */
  button: {
    xs: spacing[3],
    sm: spacing[4],
    md: spacing[5],
    lg: spacing[7],
    xl: spacing[8],
  },
  /** Section vertical padding */
  section: {
    sm: spacing[16],
    md: spacing[24],
    lg: spacing[32],
  },
} as const;

export type SpacingToken = keyof typeof spacing;
