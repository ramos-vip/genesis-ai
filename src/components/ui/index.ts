/**
 * UI Component Library — Barrel Export
 *
 * Import from '@/components/ui' to access any primitive.
 *
 * Example:
 *   import { Button, Input, Badge, Modal } from '@/components/ui'
 */

export { default as Button }    from './Button';
export { default as Input }     from './Input';
export { default as Textarea }  from './Textarea';
export { default as Select }    from './Select';
export { default as Checkbox }  from './Checkbox';
export { default as Switch }    from './Switch';
export { default as Badge }     from './Badge';
export { default as Avatar }    from './Avatar';
export { default as Card, CardHeader, CardBody, CardFooter } from './Card';
export { default as Modal }     from './Modal';
export { Dropdown }             from './Dropdown';
export { default as Tooltip }   from './Tooltip';
export { Tabs }                 from './Tabs';
export { default as Alert }     from './Alert';
export { default as Spinner }   from './Spinner';
export { default as Skeleton }  from './Skeleton';
export { default as Separator } from './Separator';
export { default as SectionHeader } from './SectionHeader';
export { default as AnimateIn }    from './AnimateIn';
export { default as FAQList }      from './FAQList';
export { default as ProgressBar }  from './ProgressBar';
export { default as Stepper }      from './Stepper';
export type { StepDefinition }     from './Stepper';
export { default as Slider }       from './Slider';

// Types
export type { ButtonVariant, ButtonSize }   from './Button';
export type { InputSize, InputVariant }     from './Input';
export type { SelectSize }                  from './Select';
export type { BadgeVariant, BadgeSize }     from './Badge';
export type { AvatarSize, AvatarStatus }    from './Avatar';
export type { CardVariant }                 from './Card';
export type { ModalSize }                   from './Modal';
export type { TooltipSide }                 from './Tooltip';
export type { TabsVariant }                 from './Tabs';
export type { AlertVariant }                from './Alert';
export type { SpinnerSize, SpinnerColor }   from './Spinner';
export type { SkeletonVariant }             from './Skeleton';
