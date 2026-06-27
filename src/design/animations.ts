/**
 * Design System — Animation Tokens
 *
 * CSS-only. No Framer Motion. Keyframes are defined in globals.css.
 * This file exports class names and timing constants for consistency.
 */

/** Duration constants (ms) */
export const duration = {
  instant:  0,
  fast:     100,
  normal:   150,
  moderate: 200,
  slow:     300,
  slower:   500,
  crawl:    700,
} as const;

/** Easing presets */
export const easing = {
  linear:      'linear',
  ease:        'ease',
  easeIn:      'ease-in',
  easeOut:     'ease-out',
  easeInOut:   'ease-in-out',
  /** Spring-like — matches cubic-bezier used throughout the app */
  spring:      'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Snappy enter */
  snapIn:      'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Animation class names.
 * All keyframes are defined in globals.css.
 *
 * Usage:
 *   import { animation } from '@/design/animations'
 *   <div className={animation.fadeIn}>...</div>
 */
export const animation = {
  /** Element fades in from transparent */
  fadeIn:      'animate-fade-in',
  /** Element slides up and fades in (dropdowns, tooltips opening upward) */
  slideUp:     'animate-slide-up',
  /** Element slides down and fades in (dropdowns, menus opening downward) */
  slideDown:   'animate-slide-down',
  /** Element scales in and fades in (modals, popovers) */
  scaleIn:     'animate-scale-in',
  /** Infinite rotation (spinners) */
  spin:        'animate-spin',
  /** Skeleton shimmer */
  shimmer:     'animate-shimmer',
  /** Scroll-triggered reveal — initial state */
  revealInit:  'animate-in-element',
  /** Scroll-triggered reveal — visible state */
  revealShow:  'animate-in-visible',
  /** Hero section ambient glow */
  heroGlow:    'hero-glow',
} as const;

/** Transition utility strings for inline use */
export const transition = {
  none:    'none',
  all:     `all ${duration.normal}ms ${easing.easeOut}`,
  colors:  `color ${duration.normal}ms ${easing.easeOut}, background-color ${duration.normal}ms ${easing.easeOut}, border-color ${duration.normal}ms ${easing.easeOut}`,
  opacity: `opacity ${duration.normal}ms ${easing.easeOut}`,
  shadow:  `box-shadow ${duration.normal}ms ${easing.easeOut}`,
  transform: `transform ${duration.normal}ms ${easing.spring}`,
} as const;

export type AnimationToken = keyof typeof animation;
export type DurationToken  = keyof typeof duration;
