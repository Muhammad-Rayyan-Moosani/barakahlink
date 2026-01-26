import React from 'react';

/**
 * Props interface for the Logo component.
 * 
 * @interface LogoProps
 */
interface LogoProps {
  /**
   * Size preset for the logo.
   * Controls the dimensions of the icon and text scaling.
   * 
   * Sizes:
   * - 'sm': Small (32px icon, 18px text) - for compact headers or inline usage
   * - 'md': Medium (48px icon, 24px text) - default, balanced size
   * - 'lg': Large (96px icon, 48px text) - for hero sections or emphasis
   * - 'xl': Extra Large (144px icon, 72px text) - for splash screens
   * 
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Additional CSS classes to apply to the root container.
   * Allows for custom positioning, margins, or other styling.
   * 
   * @default ''
   */
  className?: string;

  /**
   * Whether to display the text portion of the logo.
   * When false, only the emblem icon is shown.
   * Useful for mobile views or space-constrained layouts.
   * 
   * @default true
   */
  showText?: boolean;

  /**
   * Whether to use light color scheme for the text.
   * 
   * Color Modes:
   * - light (true): Pure white text for dark backgrounds
   * - default (false): Emerald-tinted white for subtle contrast
   * 
   * @default false
   */
  light?: boolean;
}

/**
 * BarakahLink brand logo component with animated emblem.
 * 
 * A sophisticated, spiritually-inspired logo featuring an animated geometric
 * emblem combining Islamic design motifs (8-pointed star and crescent) with
 * modern glassmorphic styling and interactive animations.
 * 
 * Design Philosophy:
 * The logo embodies the platform's mission of blessing (Barakah) and connection
 * through culturally resonant visual elements:
 * - 8-pointed Khatam star: Represents Islamic geometric art and spiritual harmony
 * - Crescent moon: Traditional Islamic symbol, also suggests growth and nourishment
 * - Amber/Gold accents: Warmth, generosity, and premium quality
 * - Emerald background: Growth, prosperity, and environmental consciousness
 * 
 * Interactive Features:
 * - Hover animations: Icon rotates 22.5° (1/16 rotation for geometric harmony)
 * - Scale expansion on hover for depth
 * - Pulsing ambient glow creating divine/ethereal atmosphere
 * - Rotating radial gradient background for subtle movement
 * - Smooth transitions for professional polish
 * 
 * Accessibility:
 * - High contrast between emblem and background
 * - Text remains readable at all sizes
 * - Maintains brand recognition with or without text
 * 
 * @component
 * @example
 * ```tsx
 * // Full logo with default medium size
 * <Logo />
 * 
 * // Icon-only logo for mobile header
 * <Logo size="sm" showText={false} />
 * 
 * // Large hero logo with light text on dark background
 * <Logo size="xl" light={true} />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  light = false
}) => {
  /**
   * Size configuration mapping for different logo scales.
   * Each size preset defines icon dimensions, text size, and subtitle size.
   * 
   * Sizing System:
   * - icon: Width and height for the emblem container
   * - text: Font size for "BarakahLink" main text
   * - sub: Font size for "Community Food Support" subtitle
   * 
   * Maintains proportional scaling across all size variants.
   */
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[7px]' },
    md: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[9px]' },
    lg: { icon: 'w-24 h-24', text: 'text-5xl', sub: 'text-[11px]' },
    xl: { icon: 'w-36 h-36', text: 'text-7xl', sub: 'text-[14px]' },
  };

  /**
   * Current size configuration based on size prop.
   */
  const currentSize = sizes[size];

  /**
   * Primary text color based on light mode.
   * - light: Pure white for maximum contrast on dark backgrounds
   * - default: Emerald-50 for softer appearance with subtle tint
   */
  const primaryColor = light ? 'text-white' : 'text-emerald-50';

  return (
    <div className={`flex items-center space-x-5 ${className}`}>
      {/* 
        The Sacred Emblem
        
        Multi-layered animated icon combining:
        - Ambient glow effect
        - Geometric container with gradient
        - Rotating radial background
        - 8-pointed star (Khatam)
        - Crescent moon
        
        Interaction:
        - Hover triggers rotation and scale increase
        - Glow intensifies on hover
        - All transitions smoothly animated
      */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 group perspective-1000`}>
        {/* 
          Divine Aura Glow
          
          Soft, pulsing amber glow surrounding the emblem.
          Creates an ethereal, blessed atmosphere around the icon.
          
          Effects:
          - Heavy blur (40px) for soft diffusion
          - Continuous pulse animation
          - Opacity increases on hover for emphasis
          - Rounded shape matches icon geometry
        */}
        <div className="absolute inset-0 bg-amber-500/30 blur-[40px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>

        {/* 
          Main Geometric Container
          
          Primary background for the emblem with:
          - Emerald gradient from lighter to darker tones
          - Rounded corners for modern aesthetic
          - Deep shadow for elevation
          - Ring border in amber for accent
          - Centered content alignment
          
          Transforms:
          - Rotates 22.5° on hover (geometric harmony - 1/16 of full rotation)
          - Scales up 10% for depth effect
          - 700ms transition for smooth, luxurious feel
        */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 to-emerald-950 rounded-2xl shadow-2xl transform transition-all duration-700 group-hover:rotate-[22.5deg] group-hover:scale-110 overflow-hidden ring-1 ring-amber-500/30 flex items-center justify-center">
          {/* 
            Subtle Rotating Radial Background
            
            Creates gentle, perpetual motion within the emblem.
            Radial gradient with amber tint adds depth and dimensionality.
            
            Animation:
            - Continuously rotates over 10 seconds
            - Linear timing for consistent speed
            - Infinite loop for ongoing effect
            - Subtle enough not to distract from main elements
          */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent)] animate-[spin_10s_linear_infinite]"></div>

          {/* 
            SVG Emblem Container
            
            Contains the star and crescent symbols.
            Sized at 80% of container to provide comfortable padding.
            Drop shadow creates golden glow effect around symbols.
          */}
          <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
            {/* 
              SVG Definitions
              
              Mask for creating the crescent moon shape.
              The crescent is formed by overlapping two circles:
              - Main circle filled with white
              - Smaller offset circle cuts out a portion (black in mask)
            */}
            <defs>
              <mask id="crescent-mask">
                {/* White background allows main circle to show */}
                <rect width="100" height="100" fill="white" />
                {/* Black circle cuts out portion to create crescent */}
                <circle cx="42" cy="50" r="12" fill="black" />
              </mask>
            </defs>

            {/* 
              The 8-pointed Khatam Star
              
              Traditional Islamic geometric pattern representing:
              - Spiritual harmony and balance
              - Eight directions of divine blessing
              - Symmetry and order in creation
              
              Visual Properties:
              - Initially semi-transparent (40% opacity)
              - Becomes fully visible on hover
              - Positioned behind crescent in layering
              - Amber color for warmth and blessing
            */}
            <path
              fill="currentColor"
              d="M50 0L61 39H100L69 61L81 100L50 78L19 100L31 61L0 39H39L50 0Z"
              className="opacity-40 group-hover:opacity-100 transition-opacity"
            />

            {/* 
              The Spiritual Crescent
              
              Created using SVG mask technique:
              - Full circle at center
              - Masked by offset circle to create crescent shape
              - White color for purity and prominence
              
              Symbolism:
              - Islamic spiritual heritage
              - Growth and renewal
              - Nourishment and care (moon's role in Islamic calendar)
              
              Technical Note:
              Using mask instead of path ensures smooth, perfect curves
              and easier alignment adjustments.
            */}
            <circle cx="50" cy="50" r="15" fill="white" mask="url(#crescent-mask)" />
          </svg>
        </div>
      </div>

      {/* 
        Logo Text Section
        Conditionally rendered based on showText prop.
        
        Contains:
        - Main brand name "BarakahLink" with mixed styling
        - Decorative divider line
        - Descriptive subtitle "Community Food Support"
      */}
      {showText && (
        <div className="flex flex-col">
          {/* 
            Main Brand Name
            
            "Barakah" (blessing in Arabic) + "Link" (connection)
            
            Styling:
            - Serif font for sophistication and trustworthiness
            - Bold weight for prominence
            - Tight tracking for modern aesthetic
            - "Barakah" in primary color (emerald or white)
            - "Link" italicized in amber for emphasis and differentiation
            - Text glow effect for premium feel
          */}
          <span className={`serif font-bold tracking-tight leading-none ${currentSize.text} ${primaryColor} text-glow-gold`}>
            Barakah <span className="italic text-amber-500">Link</span>
          </span>

          {/* 
            Subtitle Section
            
            Decorative divider and descriptive tagline.
            Provides context about platform purpose.
            
            Layout:
            - Horizontal flexbox with centered alignment
            - Top margin for spacing from main text
            - Reduced opacity (60%) for visual hierarchy
          */}
          <div className="flex items-center space-x-2 mt-2 opacity-60">
            {/* Decorative amber line separator */}
            <div className="h-[1px] w-6 bg-amber-500"></div>

            {/* 
              Subtitle Text: "Community Food Support"
              
              Styling:
              - Uppercase for formality and structure
              - Extra wide letter spacing (0.6em) for emphasis
              - Small size relative to main text
              - Amber-200 color for subtlety with warmth
              - Black weight for clarity despite small size
            */}
            <span className={`font-black uppercase tracking-[0.6em] ${currentSize.sub} text-amber-200`}>
              Community Food Support
            </span>
          </div>
        </div>
      )}
    </div>
  );
};