/**
 * Design System — Typography Tokens
 *
 * Full type scale from Display (hero headlines) to Caption (micro labels).
 * All sizes in rem, line-heights unitless for correct inheritance.
 */

export const fontFamily = {
  sans: 'var(--font-geist-sans), system-ui, -apple-system, sans-serif',
  mono: 'var(--font-geist-mono), "Fira Code", "Cascadia Code", monospace',
} as const;

export const fontWeight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const;

export const fontSize = {
  '2xs': '0.625rem',   // 10px
  xs:    '0.75rem',    // 12px
  sm:    '0.875rem',   // 14px
  base:  '1rem',       // 16px
  lg:    '1.125rem',   // 18px
  xl:    '1.25rem',    // 20px
  '2xl': '1.5rem',     // 24px
  '3xl': '1.875rem',   // 30px
  '4xl': '2.25rem',    // 36px
  '5xl': '3rem',       // 48px
  '6xl': '3.75rem',    // 60px
  '7xl': '4.5rem',     // 72px
  '8xl': '6rem',       // 96px
} as const;

export const lineHeight = {
  none:    '1',
  tight:   '1.1',
  snug:    '1.25',
  normal:  '1.5',
  relaxed: '1.65',
  loose:   '2',
} as const;

export const letterSpacing = {
  tighter: '-0.04em',
  tight:   '-0.02em',
  normal:  '0',
  wide:    '0.02em',
  wider:   '0.05em',
  widest:  '0.15em',
} as const;

/**
 * Semantic type scale
 *
 * Usage: import { typeScale } from '@/design/typography'
 * Then use typeScale.display.xl to get the className string.
 */
export const typeScale = {
  /** Hero headlines — landing page only */
  display: {
    xl:  'text-[80px] font-bold tracking-tight leading-none',
    lg:  'text-[64px] font-bold tracking-tight leading-none',
    md:  'text-[48px] font-bold tracking-tight leading-tight',
    sm:  'text-[36px] font-bold tracking-tight leading-tight',
  },

  /** Section headings */
  heading: {
    xl:  'text-5xl font-bold tracking-tight leading-tight',
    lg:  'text-4xl font-bold tracking-tight leading-tight',
    md:  'text-3xl font-bold tracking-tight leading-tight',
    sm:  'text-2xl font-semibold tracking-tight leading-snug',
    xs:  'text-xl font-semibold tracking-tight leading-snug',
  },

  /** Component titles */
  title: {
    lg:  'text-lg font-semibold leading-snug',
    md:  'text-base font-semibold leading-snug',
    sm:  'text-sm font-semibold leading-snug',
  },

  /** Body text */
  body: {
    lg:  'text-lg font-normal leading-relaxed',
    md:  'text-base font-normal leading-relaxed',
    sm:  'text-sm font-normal leading-relaxed',
  },

  /** Supporting text */
  caption: {
    md:  'text-xs font-normal leading-normal',
    sm:  'text-[10px] font-normal leading-normal',
  },

  /** UI labels */
  label: {
    lg:  'text-sm font-medium leading-none',
    md:  'text-xs font-medium leading-none',
    sm:  'text-[10px] font-semibold tracking-wider uppercase leading-none',
  },

  /** Code / monospace */
  mono: {
    lg:  'text-base font-mono leading-relaxed',
    md:  'text-sm font-mono leading-relaxed',
    sm:  'text-xs font-mono leading-relaxed',
  },
} as const;

export type TypeScaleCategory = keyof typeof typeScale;
