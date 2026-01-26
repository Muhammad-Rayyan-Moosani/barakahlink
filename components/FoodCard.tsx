import React from 'react';
import { FoodDrop } from '../types';

/**
 * Props interface for the FoodCard component.
 * 
 * @interface FoodCardProps
 */
interface FoodCardProps {
  /**
   * The food drop data to display in the card.
   * Contains all information about the donation including location,
   * availability, dietary tags, and reservation status.
   */
  drop: FoodDrop;

  /**
   * Callback function triggered when the card is clicked.
   * Typically opens a detailed view or reservation modal.
   * 
   * @param drop - The food drop associated with the clicked card
   */
  onClick: (drop: FoodDrop) => void;
}

/**
 * Interactive card component displaying food drop information.
 * 
 * A sophisticated, visually rich card that presents food donation details
 * with real-time availability indicators, progress tracking, and premium
 * animations. Designed with a "celestial glass" aesthetic featuring
 * glassmorphism, ambient lighting effects, and cultural design motifs.
 * 
 * Key Features:
 * - Real-time countdown progress bar showing remaining pickup window
 * - Visual status indicators (Available/Claimed/Expired)
 * - Animated hover effects with elevation and glow
 * - Decorative mashrabiya corner motif (Islamic geometric pattern)
 * - Responsive layout adapting to different screen sizes
 * - Automatic opacity reduction for claimed/expired items
 * - Location display with icon
 * - Dietary tag badges (up to 2 visible)
 * - Quantity indicator with dedicated styling
 * 
 * Visual States:
 * - Available: Full color with emerald status badge, interactive
 * - Claimed: Reduced opacity (60%) and saturation (20%)
 * - Expired: Rose-colored status badge
 * 
 * Progress Calculation:
 * The card calculates and displays a visual progress bar representing
 * how much time remains in the pickup window. This helps recipients
 * understand urgency and prioritize their food claims.
 * 
 * Cultural Design Elements:
 * The mashrabiya (Islamic lattice) motif in the corner reflects the
 * platform's name "Barakah" (blessing in Arabic) and adds cultural
 * resonance to the design.
 * 
 * @component
 * @example
 * ```tsx
 * <FoodCard
 *   drop={foodDropData}
 *   onClick={(drop) => openDetailModal(drop)}
 * />
 * ```
 */
export const FoodCard: React.FC<FoodCardProps> = ({ drop, onClick }) => {
  // Time-based availability calculations

  /**
   * Current timestamp for real-time comparisons.
   */
  const now = new Date();

  /**
   * Pickup window start time converted to Date object.
   */
  const start = new Date(drop.pickupStartTime);

  /**
   * Pickup window end time converted to Date object.
   */
  const end = new Date(drop.availableUntil);

  /**
   * Time elapsed since pickup window opened (in milliseconds).
   */
  const elapsed = now.getTime() - start.getTime();

  /**
   * Total duration of the pickup window (in milliseconds).
   */
  const total = end.getTime() - start.getTime();

  /**
   * Progress percentage through the pickup window.
   * Clamped between 0 and 100 to prevent overflow/underflow.
   * 
   * Used to visualize time remaining via progress bar.
   * Higher values indicate more time has passed.
   */
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);

  /**
   * Determines if the food drop is currently available for claiming.
   * 
   * Conditions:
   * - Status must be 'available' (not already claimed)
   * - Current time must be before the end of pickup window
   * 
   * Used to style the status badge and control interactivity.
   */
  const isAvailable = drop.status === 'available' && now < end;

  return (
    <div
      onClick={() => onClick(drop)}
      className="group relative cursor-pointer fade-up"
    >
      {/* 
        Main Card Container
        
        Features:
        - Glassmorphic background with celestial-glass class
        - Rounded corners (3rem) for soft, approachable design
        - Hover effects: elevation, border glow, shadow expansion
        - Conditional opacity/saturation for claimed items
        - Smooth transitions (700ms duration)
      */}
      <div className={`relative overflow-hidden rounded-[3rem] border border-white/5 transition-all duration-700 celestial-glass p-8 md:p-10 hover:border-amber-400/40 hover:-translate-y-4 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] ${drop.status === 'claimed' ? 'opacity-60 saturate-[0.2]' : ''}`}>

        {/* 
          Internal Glow Effect
          Subtle gradient overlay that appears on hover to create
          an inner light effect, enhancing the premium feel.
        */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {/* 
          Mashrabiya Corner Motif
          
          Decorative Islamic geometric pattern (8-pointed star) positioned
          in the top-right corner. Translates closer to view on hover.
          
          Cultural Significance:
          Mashrabiya refers to traditional Islamic lattice screens, connecting
          to the platform's "Barakah" (blessing) theme and adding visual richness.
        */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 text-amber-400 transform translate-x-12 -translate-y-12 transition-transform group-hover:translate-x-6 group-hover:-translate-y-6">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0L55 45L100 50L55 55L50 100L45 55L0 50L45 45Z" />
          </svg>
        </div>

        {/* Card Header: Donor Info and Status Badge */}
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="space-y-4">
            {/* Donor Name with Animated Indicator */}
            <div className="flex items-center space-x-3">
              {/* Pulsing dot indicator */}
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_#fbbf24]"></span>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">
                {drop.donorName}
              </p>
            </div>
            {/* Food Title with Glow Effect */}
            <h3 className="serif text-4xl md:text-5xl text-white tracking-tight leading-[0.9] text-glow-gold">
              {drop.title}
            </h3>
          </div>

          {/* 
            Status Badge
            Dynamically styled based on availability and claim status.
            
            States:
            - Claimed: Rose background and text
            - Available: Emerald background and text
            - Expired: Rose background and text
          */}
          <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/10 ${isAvailable ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'}`}>
            {drop.status === 'claimed' ? 'Claimed' : isAvailable ? 'Available' : 'Expired'}
          </div>
        </div>

        {/* Card Body: Progress, Location, Quantity, and Tags */}
        <div className="space-y-8 relative z-10">
          {/* 
            Pickup Window Progress Indicator
            
            Visualizes time remaining in the pickup window as a horizontal
            progress bar. The bar decreases from left to right as time passes.
            
            Calculation:
            - 100% - progress gives remaining percentage
            - Amber gradient creates warm, inviting appearance
            - Glow effect draws attention to urgency
          */}
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black text-amber-200/50 uppercase tracking-[0.3em]">
              <span>Pickup Window</span>
              <span>{Math.round(100 - progress)}% Remaining</span>
            </div>
            {/* Progress Bar Track */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              {/* Progress Bar Fill */}
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                style={{ width: `${100 - progress}%` }}
              ></div>
            </div>
          </div>

          {/* 
            Location Display
            Shows pickup address and city with location pin icon.
            Only displays the first part of the address (before comma) for brevity.
          */}
          <div className="flex items-center space-x-4">
            {/* Location Pin Icon Container */}
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            {/* Address Text */}
            <div>
              <p className="text-white font-black text-lg tracking-tight">
                {drop.pickupAddress.split(',')[0]}
              </p>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                {drop.city}
              </p>
            </div>
          </div>

          {/* Bottom Row: Quantity and Dietary Tags */}
          <div className="flex justify-between items-end">
            {/* 
              Quantity Indicator
              Displays the numerical quantity in a highlighted container.
              Extracts just the number from the quantity string.
            */}
            <div className="bg-emerald-950/40 px-6 py-4 rounded-3xl border border-white/5 flex flex-col items-center">
              <span className="text-[8px] uppercase font-black text-amber-500/60 mb-1 tracking-widest">
                Quantity
              </span>
              <span className="text-xl font-black text-white">
                {drop.quantity.split(' ')[0]}
              </span>
            </div>

            {/* 
              Dietary Tags
              Displays up to 2 dietary/category tags as badges.
              Limited to prevent visual clutter on the card.
              Full tag list available in detail view.
            */}
            <div className="flex space-x-2">
              {drop.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-5 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};