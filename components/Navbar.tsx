import React from 'react';
import { UserRole } from '../types';
import { Logo } from './Logo';

/**
 * Props interface for the Navbar component.
 * 
 * @interface NavbarProps
 */
interface NavbarProps {
  /**
   * Current user role determining navbar content and available actions.
   * Affects which navigation items are displayed and authentication state.
   */
  role: UserRole;

  /**
   * Callback function to update the user's role.
   * Triggered when user signs in, signs out, or changes account type.
   * 
   * @param role - The new user role to set
   */
  onRoleChange: (role: UserRole) => void;

  /**
   * Callback function to navigate between different views/pages.
   * Updates the parent component's routing state.
   * 
   * @param view - The identifier of the view to navigate to
   *               (e.g., 'landing', 'map', 'donor-dashboard', 'auth')
   */
  onNavigate: (view: string) => void;

  /**
   * Identifier of the currently active view.
   * Used to highlight the active navigation item.
   */
  currentView: string;
}

/**
 * Primary navigation bar component for the BarakahLink platform.
 * 
 * A fixed-position, glassmorphic navigation bar providing access to main
 * platform features, authentication controls, and role-based navigation.
 * Features smooth animations, hover effects, and responsive design.
 * 
 * Key Features:
 * - Fixed positioning with safe spacing from viewport top
 * - Glassmorphic design with blur and transparency
 * - Logo with click-to-home functionality
 * - Dynamic navigation items based on user role
 * - Active state indicators with animated underlines
 * - Authentication state display (Get Started vs Sign Out)
 * - Responsive layout hiding secondary items on mobile
 * - Smooth hover and active state transitions
 * - Elevated shadow for depth and prominence
 * 
 * Navigation Items:
 * - Food Map: Main view showing all available food drops
 * - SMS Support: Interface for SMS-based interactions
 * - My Listings (donors only): Dashboard for managing donations
 * 
 * Authentication States:
 * - Guest: Shows "Get Started" CTA button
 * - Authenticated (donor/recipient): Shows "Sign Out" button
 * 
 * Visual Design:
 * - Celestial glass background with subtle blur
 * - Amber accents for active states and primary actions
 * - Emerald undertones for brand consistency
 * - Animated underlines for navigation items
 * - Glow effects on hover for premium feel
 * 
 * Responsive Behavior:
 * - Full navigation on desktop (md breakpoint and above)
 * - Reduced navigation items on mobile
 * - Adaptive sizing and spacing across breakpoints
 * 
 * @component
 * @example
 * ```tsx
 * <Navbar
 *   role={currentUserRole}
 *   onRoleChange={(role) => setUserRole(role)}
 *   onNavigate={(view) => setActiveView(view)}
 *   currentView={activeView}
 * />
 * ```
 */
export const Navbar: React.FC<NavbarProps> = ({
  role,
  onRoleChange,
  onNavigate,
  currentView
}) => {
  return (
    /**
     * Fixed Container with Pointer Events Management
     * 
     * Structure:
     * - Fixed positioning ensures navbar stays at top during scroll
     * - Top spacing (48px) provides comfortable distance from viewport edge
     * - Full width with horizontal padding for edge spacing
     * - High z-index (100) keeps navbar above all content
     * - Pointer events disabled on container but enabled on nav element
     *   (allows clicking through transparent areas around navbar)
     */
    <div className="fixed top-12 left-0 right-0 z-[100] px-8 pointer-events-none">
      {/**
       * Main Navigation Bar
       * 
       * Layout:
       * - Centered with max-width constraint (7xl = 80rem)
       * - Celestial glass effect for premium glassmorphic appearance
       * - Extra rounded corners (3rem) for modern, soft aesthetic
       * - Subtle border for definition without harshness
       * - Pointer events re-enabled for interaction
       * - Responsive height: 24 on mobile, 28 on desktop
       * - Flexbox layout with space-between for logo and navigation
       * - Generous horizontal padding that scales with breakpoint
       * - Multi-layered shadow for depth and elevation
       */}
      <nav className="max-w-7xl mx-auto celestial-glass rounded-[3rem] border border-white/10 pointer-events-auto h-24 md:h-28 flex items-center justify-between px-10 md:px-16 shadow-[0_30px_100px_-15px_rgba(0,0,0,0.6)]">
        {/**
         * Logo / Home Button
         * 
         * Interaction:
         * - Clickable area returning user to landing page
         * - Hover scale up (105%) for feedback
         * - Active scale down (95%) for pressed effect
         * - Smooth transform transitions
         * - Cursor pointer indicates interactivity
         * - Explicit pointer events to ensure clickability
         */}
        <div
          className="cursor-pointer pointer-events-auto transition-transform hover:scale-105 active:scale-95"
          onClick={() => onNavigate('landing')}
        >
          <Logo size="md" />
        </div>

        {/**
         * Right Section: Navigation Links and Auth Controls
         * 
         * Layout:
         * - Horizontal flexbox with generous spacing
         * - Spacing increases on large screens (lg breakpoint)
         */}
        <div className="flex items-center space-x-12 lg:space-x-16">
          {/**
           * Primary Navigation Links
           * 
           * Visibility:
           * - Hidden on mobile, visible on medium screens and above
           * - Prevents clutter on small screens
           * 
           * Structure:
           * - Horizontal layout with consistent spacing
           */}
          <div className="hidden md:flex items-center space-x-12">
            {/**
             * Navigation Items Array
             * Defines available navigation links for all users.
             */}
            {[
              { name: 'Food Map', view: 'map' },
              { name: 'SMS Support', view: 'sms' }
            ].map((item) => (
              /**
               * Navigation Link Button
               * 
               * Styling:
               * - Ultra-small text (11px) with heavy weight
               * - Uppercase with wide letter spacing for emphasis
               * - Conditional color: amber when active, slate when inactive
               * - Hover effect brightens inactive links to white
               * - Relative positioning for animated underline
               * - Group class for child element hover targeting
               * - Vertical padding for comfortable click area
               * 
               * Active State:
               * Determined by comparing item.view with currentView.
               */
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative group py-3 ${currentView === item.view
                    ? 'text-amber-500'
                    : 'text-slate-500 hover:text-white'
                  }`}
              >
                {item.name}
                {/**
                 * Animated Underline Indicator
                 * 
                 * Behavior:
                 * - Positioned absolutely at bottom of text
                 * - Full width amber line with glow effect
                 * - Scales from left origin (transform-origin: left)
                 * - Active state: Full width (scale-x-100)
                 * - Inactive state: Hidden (scale-x-0)
                 * - Hover state: Half width (scale-x-50) for subtle preview
                 * - 700ms transition for smooth, luxurious animation
                 * 
                 * Visual Effect:
                 * The glowing amber underline slides in from left,
                 * creating a dynamic visual connection between text
                 * and active state.
                 */}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_10px_#fbbf24] transition-transform duration-700 origin-left ${currentView === item.view
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-50'
                  }`}></span>
              </button>
            ))}

            {/**
             * Donor-Only Navigation: My Listings
             * 
             * Conditional Rendering:
             * Only displayed when user role is 'donor'.
             * Provides access to donor dashboard for managing donations.
             * 
             * Styling:
             * Identical to other navigation items for consistency.
             */}
            {role === 'donor' && (
              <button
                onClick={() => onNavigate('donor-dashboard')}
                className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative group py-3 ${currentView === 'donor-dashboard'
                    ? 'text-amber-500'
                    : 'text-slate-500 hover:text-white'
                  }`}
              >
                My Listings
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 shadow-[0_0_10px_#fbbf24] transition-transform duration-700 origin-left ${currentView === 'donor-dashboard'
                    ? 'scale-x-100'
                    : 'scale-x-0 group-hover:scale-x-50'
                  }`}></span>
              </button>
            )}
          </div>

          {/**
           * Vertical Divider
           * 
           * Visual separator between navigation and authentication controls.
           * - Subtle white line with low opacity
           * - Hidden on mobile to save space
           * - Provides clear section distinction on desktop
           */}
          <div className="h-12 w-[1px] bg-white/10 hidden md:block"></div>

          {/**
           * Authentication Control Section
           * 
           * Conditional Rendering:
           * Displays different button based on authentication state.
           */}
          {role === 'guest' ? (
            /**
             * Guest State: "Get Started" CTA Button
             * 
             * Purpose:
             * Primary call-to-action encouraging users to authenticate.
             * 
             * Styling:
             * - Prominent amber background for high visibility
             * - Dark emerald text for strong contrast
             * - Heavy rounded corners matching design system
             * - Multi-layered shadow with amber glow
             * - Hover effects: scale up, intensified shadow
             * - Active state: scale down for press feedback
             * - Internal gradient overlay on hover for depth
             * - Relative positioning for layered effects
             * 
             * Visual Hierarchy:
             * Most prominent element in navbar when user is guest,
             * drawing attention to authentication action.
             */
            <button
              onClick={() => onNavigate('auth')}
              className="group relative px-12 py-5 overflow-hidden rounded-[2rem] bg-amber-500 text-emerald-950 text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_-10px_rgba(251,191,36,0.5)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_25px_60px_-15px_rgba(251,191,36,0.7)]"
            >
              {/**
               * Hover Gradient Overlay
               * Creates subtle shimmer effect on hover.
               * Diagonal gradient from white/30 to transparent.
               */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/**
               * Button Text
               * Z-index ensures text stays above gradient overlay.
               */}
              <span className="relative z-10">Get Started</span>
            </button>
          ) : (
            /**
             * Authenticated State: "Sign Out" Button
             * 
             * Purpose:
             * Allows authenticated users to sign out and return to guest state.
             * 
             * Styling:
             * - Rose color scheme indicating destructive/exit action
             * - Outline style (border only) for secondary action
             * - Smaller, less prominent than Get Started button
             * - Hover effect adds subtle rose background
             * - Maintains uppercase, wide-tracked typography
             * 
             * Behavior:
             * - Sets role back to 'guest'
             * - Navigates to landing page
             * - Combined action ensures clean state reset
             */
            <button
              onClick={() => {
                onRoleChange('guest');
                onNavigate('landing');
              }}
              className="px-8 py-3 rounded-2xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-rose-500/10 transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};