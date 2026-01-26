import React from 'react';

/**
 * Props interface for the Button component.
 * Extends native HTML button attributes to maintain compatibility
 * with standard button functionality while adding custom styling options.
 * 
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button.
   * 
   * Variants:
   * - 'primary': Emerald background with amber text, used for main CTAs
   * - 'secondary': Amber background with white text, for secondary actions
   * - 'outline': Glass-morphic design with border, for subtle actions
   * - 'ghost': Minimal styling, text-only appearance for tertiary actions
   * - 'danger': Rose-colored styling for destructive actions (delete, cancel)
   * 
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

  /**
   * Size preset for the button.
   * Controls padding and font size for consistent sizing across the app.
   * 
   * Sizes:
   * - 'sm': Small, compact button (9px text, minimal padding)
   * - 'md': Medium, default size (10px text, balanced padding)
   * - 'lg': Large, prominent button (12px text, generous padding)
   * 
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Whether the button should expand to fill its container's width.
   * Useful for mobile layouts and form submissions.
   * 
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Premium button component with advanced visual effects and animations.
 * 
 * A highly styled button component designed for the BarakahLink platform,
 * featuring sophisticated hover effects, shimmer animations, and multiple
 * visual variants to support different use cases throughout the application.
 * 
 * Key Features:
 * - Five distinct visual variants for different contexts
 * - Three size presets for hierarchical importance
 * - Animated shimmer effect on hover for premium feel
 * - Decorative gold accent line for primary buttons
 * - Active state scale animation for tactile feedback
 * - Full-width option for responsive layouts
 * - Disabled state styling with reduced opacity
 * - Layered design with gradient effects
 * 
 * Accessibility:
 * - Maintains all native button functionality
 * - Supports disabled state with visual feedback
 * - Keyboard accessible with native button behavior
 * - Proper ARIA attributes inherited from HTML button
 * 
 * @component
 * @example
 * ```tsx
 * // Primary CTA button
 * <Button variant="primary" size="lg" fullWidth>
 *   Create Food Drop
 * </Button>
 * 
 * // Secondary action button
 * <Button variant="secondary" size="md">
 *   View Details
 * </Button>
 * 
 * // Danger action with confirmation
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Listing
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  /**
   * Base styles applied to all button variants.
   * Provides consistent foundation for positioning, transitions, and states.
   * 
   * Includes:
   * - Flexbox centering for content alignment
   * - Uppercase typography with wide letter spacing for modern aesthetic
   * - Rounded corners for soft, approachable appearance
   * - Smooth transitions for all interactive states
   * - Active state scaling for tactile feedback
   * - Disabled state handling with reduced opacity
   * - Overflow hidden to contain animated effects
   * - Group class for child element hover targeting
   */
  const baseStyles = 'relative inline-flex items-center justify-center font-black uppercase tracking-[0.25em] rounded-[1.5rem] transition-all duration-500 active:scale-[0.94] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  /**
   * Variant-specific style configurations.
   * Each variant defines colors, shadows, and borders for different use cases.
   * 
   * Design rationale:
   * - Primary uses emerald/amber for brand consistency and high visibility
   * - Secondary uses amber for important but non-primary actions
   * - Outline provides subtle, non-intrusive option with glass effect
   * - Ghost offers minimal styling for low-emphasis actions
   * - Danger uses rose colors to signal destructive actions
   * 
   * All variants include sophisticated shadow systems for depth and elevation.
   */
  const variants = {
    primary: 'bg-emerald-950 text-amber-400 shadow-[0_20px_40px_-15px_rgba(1,26,20,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(1,26,20,0.4)] border-b-4 border-emerald-900',
    secondary: 'bg-amber-600 text-white shadow-[0_20px_40px_-15px_rgba(217,119,6,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(217,119,6,0.3)] border-b-4 border-amber-800',
    outline: 'bg-white/40 backdrop-blur-md border border-emerald-900/10 text-emerald-900 hover:bg-white hover:border-emerald-900/30 shadow-sm',
    ghost: 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-50/50',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white shadow-sm',
  };

  /**
   * Size-specific style configurations.
   * Provides consistent padding and text sizing across different button sizes.
   * 
   * Sizing system:
   * - Small: Compact for inline actions or tight spaces
   * - Medium: Default, balanced size for most use cases
   * - Large: Prominent for primary CTAs and important actions
   */
  const sizes = {
    sm: 'px-6 py-3 text-[9px]',
    md: 'px-10 py-5 text-[10px]',
    lg: 'px-16 py-8 text-[12px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* 
        Premium Shimmer Streak Effect
        Creates a light streak that sweeps across the button on hover.
        
        Implementation:
        - Positioned absolutely to overlay button content
        - 200% width to ensure complete coverage during animation
        - Gradient from transparent through white/5 creates subtle light effect
        - Starts off-screen left (-translate-x-full)
        - Translates to off-screen right on hover for sweep effect
        - 1-second duration with ease-in-out for smooth motion
        - Pointer events disabled to prevent interaction interference
      */}
      <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"></div>

      {/* 
        Decorative Gold Accent Line for Primary Variant
        Adds a subtle golden underline that fades in on hover.
        Only appears on primary variant buttons for brand distinction.
        
        Visual effect:
        - Positioned at bottom of button
        - Gradient from transparent through amber creates glowing line
        - Initially hidden (opacity-0)
        - Fades in on hover for refined detail
        - Reinforces premium, polished aesthetic
      */}
      {variant === 'primary' && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      )}

      {/* 
        Button Content Container
        Ensures button text and children appear above animated effects.
        
        - Relative positioning creates new stacking context
        - z-10 ensures content stays above shimmer and accent effects
        - Flexbox centers content both horizontally and vertically
        - Accepts any React children (text, icons, combinations)
      */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};