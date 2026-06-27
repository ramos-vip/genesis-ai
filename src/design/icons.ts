/**
 * Design System — Icon Registry
 *
 * Centralized icon definitions. All icons use 24×24 viewBox,
 * stroke-based, with configurable size and strokeWidth.
 * Import individual icons from @/components/ui/icons/ for tree-shaking.
 *
 * This file acts as the registry / manifest — lists every icon
 * available in the system and the props contract they all share.
 */

export interface IconProps {
  /** Pixel size (width and height). Default: 20 */
  size?: number;
  /** CSS className for color, margin, etc. */
  className?: string;
  /** SVG stroke width. Default: 1.5 */
  strokeWidth?: number;
  /** Accessible label. Omit for decorative icons. */
  'aria-label'?: string;
}

/**
 * Icon name catalogue.
 * Every name here maps to a component in @/components/ui/icons/
 */
export const iconRegistry = [
  // Navigation
  'arrow-right',
  'arrow-left',
  'arrow-up',
  'arrow-down',
  'chevron-right',
  'chevron-left',
  'chevron-up',
  'chevron-down',
  'external-link',

  // Actions
  'plus',
  'minus',
  'x',
  'check',
  'copy',
  'edit',
  'trash',
  'search',
  'filter',
  'upload',
  'download',

  // UI chrome
  'menu',
  'settings',
  'eye',
  'eye-off',
  'more-horizontal',
  'more-vertical',
  'loader',

  // Status
  'alert-circle',
  'alert-triangle',
  'check-circle',
  'info',
  'help-circle',

  // Entities
  'user',
  'users',
  'mail',
  'star',
  'heart',
  'bookmark',
  'globe',

  // Theme
  'sun',
  'moon',

  // Brand placeholder
  'genesis',
] as const;

export type IconName = typeof iconRegistry[number];
