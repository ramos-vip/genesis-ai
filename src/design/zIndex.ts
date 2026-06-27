/**
 * Design System — Z-Index Tokens
 *
 * Explicit stacking context layers. Never use arbitrary numbers.
 */

export const zIndex = {
  below:     -1,
  base:       0,
  raised:     1,
  dropdown:  10,
  sticky:    20,
  overlay:   30,
  modal:     40,
  toast:     50,
  tooltip:   60,
  maximum:  999,
} as const;

export type ZIndexToken = keyof typeof zIndex;
