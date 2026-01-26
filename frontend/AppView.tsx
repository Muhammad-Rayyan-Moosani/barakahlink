import React from 'react';
import { UserRole, FoodDrop } from '../backend/types';
import { DIETARY_TAGS, CANADIAN_CITIES } from '../constants';
import { Navbar } from '../components/Navbar';
import { MapView } from '../components/MapView';
import { FoodCard } from '../components/FoodCard';
import { DonorDashboard } from '../components/DonorDashboard';
import { SMSView } from '../components/SMSView';
import { Button } from '../components/Button';
import { AuthView } from '../components/AuthView';
import { Logo } from '../components/Logo';

/**
 * Props interface for the AppView component.
 * 
 * This component receives a large number of props as it serves as the main
 * view orchestrator for the entire application, managing state and routing.
 * 
 * @interface AppViewProps
 */
interface AppViewProps {
  /**
   * Current user role determining UI permissions and available features.
   */
  role: UserRole;

  /**
   * Function to update the user's role (e.g., on login/logout).
   */
  setRole: (role: UserRole) => void;

  /**
   * Current authenticated user object, or null if guest.
   * Contains email and display name.
   */
  user: { email: string; name: string } | null;

  /**
   * Current active view identifier.
   * Determines which major section of the app to display.
   * 
   * Possible values:
   * - 'landing': Hero landing page
   * - 'auth': Authentication/signup view
   * - 'map': Food drops map and listing view
   * - 'donor-dashboard': Donor's listing management
   * - 'sms': SMS interface simulation
   */
  view: string;

  /**
   * Function to navigate between different views.
   */
  setView: (view: string) => void;

  /**
   * Filtered array of food drops for the map view.
   * Already filtered by city and dietary preferences.
   */
  drops: FoodDrop[];

  /**
   * Complete unfiltered array of all food drops.
   * Used for donor dashboard to show all user's listings.
   */
  allDrops: FoodDrop[];

  /**
   * Currently selected food drop for detailed view, or null if none selected.
   */
  selectedDrop: FoodDrop | null;

  /**
   * Function to update the selected food drop.
   */
  setSelectedDrop: (drop: FoodDrop | null) => void;

  /**
   * Current active dietary filter tag.
   * Used to filter food drops by dietary restrictions.
   */
  filter: string;

  /**
   * Function to update the dietary filter.
   */
  setFilter: (filter: string) => void;

  /**
   * Currently selected city for location-based filtering.
   */
  selectedCity: string;

  /**
   * Function to update the selected city filter.
   */
  setSelectedCity: (city: string) => void;

  /**
   * Boolean indicating if reservation form is currently active.
   * Controls display of reservation input form in detail panel.
   */
  isReserving: boolean;

  /**
   * Function to toggle reservation form visibility.
   */
  setIsReserving: (val: boolean) => void;

  /**
   * Name input value for food drop reservation.
   */
  reserveName: string;

  /**
   * Function to update reservation name input.
   */
  setReserveName: (val: string) => void;

  /**
   * Phone number input value for food drop reservation.
   */
  reservePhone: string;

  /**
   * Function to update reservation phone input.
   */
  setReservePhone: (val: string) => void;

  /**
   * Callback function to add a new food drop to the platform.
   * Triggered by donor dashboard form submission.
   */
  onAddDrop: (drop: Partial<FoodDrop>) => void;

  /**
   * Callback function to handle user authentication.
   * Updates user role and creates session.
   */
  onLogin: (role: UserRole, email: string) => void;

  /**
   * Form submission handler for food drop reservation.
   * Processes reservation request and updates drop status.
   */
  onReserve: (e: React.FormEvent) => void;
}

/**
 * Main application view orchestrator component.
 * 
 * Serves as the primary routing and layout component for the BarakahLink
 * platform. Manages view transitions, state coordination, and renders the
 * appropriate interface based on current view and user state.
 * 
 * Architecture:
 * - Single-page application with client-side view routing
 * - Props-based state management (lifted to parent App component)
 * - Conditional rendering for different application views
 * - Shared layout elements (navbar, footer) across all views
 * 
 * Major Views:
 * 1. Landing Page: Hero section with call-to-action
 * 2. Authentication: Login/signup interface
 * 3. Map View: Interactive map with food drop listings and filters
 * 4. Donor Dashboard: Food drop management for donors
 * 5. SMS View: Simulated SMS interface for accessibility
 * 
 * Layout Structure:
 * - Fixed navbar at top
 * - Main content area with view-specific content
 * - Footer with branding and credits
 * 
 * State Management:
 * All state is managed in parent component and passed down via props.
 * This component focuses on presentation and user interaction coordination.
 * 
 * Responsive Design:
 * - Mobile-first approach with breakpoint-based layouts
 * - Grid systems adapt from single to multi-column layouts
 * - Touch-friendly interaction areas
 * - Optimized spacing and typography for different screen sizes
 * 
 * @component
 * @example
 * ```tsx
 * <AppView
 *   role={userRole}
 *   view={currentView}
 *   drops={filteredDrops}
 *   // ... other props
 * />
 * ```
 */
export const AppView: React.FC<AppViewProps> = (props) => {
  /**
   * Destructure all props for cleaner access in component body.
   * Groups related state and handlers together.
   */
  const {
    role, setRole, user, view, setView, drops, allDrops, selectedDrop, setSelectedDrop,
    filter, setFilter, selectedCity, setSelectedCity, isReserving, setIsReserving,
    reserveName, setReserveName, reservePhone, setReservePhone, onAddDrop, onLogin, onReserve
  } = props;

  /**
   * Renders the hero landing page section.
   * 
   * Features:
   * - Large, impactful typography with serif headline
   * - Status indicator showing active service area
   * - Descriptive subtitle explaining platform purpose
   * - Dual call-to-action buttons (Find Food, SMS Access)
   * - Staggered fade-in animations for progressive disclosure
   * - Centered layout optimized for first impressions
   * 
   * Design Philosophy:
   * Creates immediate emotional connection through generous white space,
   * elegant typography, and warm amber accents. The italic "Meal" emphasizes
   * the human, communal aspect of food sharing.
   * 
   * @returns JSX.Element containing the hero section
   */
  const renderHero = () => (
    <div className="relative max-w-7xl mx-auto pt-40 pb-72 px-6">
      <div className="flex flex-col items-center text-center">
        {/* 
          Status Badge
          Indicates service area and active status with pulsing indicator.
          Glassmorphic design with subtle border and shadow.
          Hover effect scales for interactive polish.
        */}
        <div className="fade-up inline-flex items-center space-x-3 px-10 py-5 rounded-[2rem] glass-light border border-amber-500/20 mb-16 shadow-[0_15px_40px_-10px_rgba(251,191,36,0.1)] group hover:scale-105 transition-transform">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_20px_#fbbf24] animate-pulse"></span>
          <span className="text-[11px] font-black text-amber-200 uppercase tracking-[0.5em]">
            Active Support in Kitchener-Waterloo
          </span>
        </div>

        {/* 
          Main Headline
          
          Typography:
          - Massive serif font (5rem to 10rem responsive)
          - Extremely tight line height (0.85) for impact
          - Negative letter spacing (tighter) for modern look
          - "Meal" in italic amber for emphasis and warmth
          - Text glow effect for ethereal quality
          
          Animation:
          - Fade-up animation with 0.2s delay
          - Creates sense of emergence and revelation
        */}
        <h1 className="fade-up serif text-[5rem] md:text-[8rem] lg:text-[10rem] text-white mb-12 leading-[0.85] tracking-tighter select-none" style={{ animationDelay: '0.2s' }}>
          Share the <span className="italic text-amber-500 block text-glow-gold">Meal.</span>
        </h1>

        {/* 
          Subtitle / Value Proposition
          
          Content:
          Explains the platform's purpose in clear, human terms.
          Emphasizes: simplicity, privacy, and community values.
          
          Styling:
          - Large but readable text (xl to 2xl)
          - Muted slate color for visual hierarchy
          - Reduced opacity (80%) for subtle presence
          - Generous line height for readability
          
          Animation: 0.4s delay for sequential reveal
        */}
        <p className="fade-up text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-24 px-4 opacity-80" style={{ animationDelay: '0.4s' }}>
          Bridging the gap between local food surplus and those who need it most. Simple, private, and community-driven.
        </p>

        {/* 
          Call-to-Action Buttons
          
          Layout:
          - Flexbox with column on mobile, row on desktop
          - Generous gap between buttons (12 spacing units)
          - High z-index ensures buttons appear above background effects
          
          Buttons:
          1. "Find Food" - Primary action, prominent amber styling
          2. "SMS Access" - Secondary action, outline style
          
          Both have enhanced shadows and extra-large sizing for prominence.
          
          Animation: 0.6s delay completes the staggered reveal sequence
        */}
        <div className="fade-up flex flex-col sm:flex-row items-center justify-center gap-12 relative z-10" style={{ animationDelay: '0.6s' }}>
          <Button
            size="lg"
            className="px-24 py-10 text-xl shadow-[0_30px_100px_-20px_rgba(251,191,36,0.4)] hover:shadow-[0_40px_120px_-25px_rgba(251,191,36,0.6)]"
            onClick={() => setView('auth')}
          >
            Find Food
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-20 py-10 text-lg text-white border-white/10 hover:bg-white/5"
            onClick={() => setView('sms')}
          >
            SMS Access
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    /**
     * Root Application Container
     * Ensures full viewport height minimum for proper footer positioning.
     */
    <div className="min-h-screen">
      {/* 
        Global Navigation Bar
        Fixed at top, visible across all views.
        Handles authentication state, role display, and view navigation.
      */}
      <Navbar
        role={role}
        onRoleChange={setRole}
        onNavigate={setView}
        currentView={view}
      />

      {/* 
        Main Content Area
        
        Layout:
        - Max-width container (7xl = 80rem) for readability
        - Centered with auto margins
        - Responsive padding that increases with viewport size
        - Top padding accounts for fixed navbar height
        
        Content:
        Conditionally renders different views based on view state.
      */}
      <main className="max-w-7xl mx-auto px-6 py-12 pt-40 md:pt-56">
        {/* Landing Page Hero Section */}
        {view === 'landing' && renderHero()}

        {/* 
          Authentication View
          
          Layout:
          - Narrower max-width (xl) for form focus
          - Centered with generous vertical padding
          - Contains login/signup interface
          
          Props:
          - onLogin: Handles successful authentication
          - onCancel: Returns user to landing page
        */}
        {view === 'auth' && (
          <div className="max-w-xl mx-auto py-20">
            <AuthView
              onLogin={onLogin}
              onCancel={() => setView('landing')}
            />
          </div>
        )}

        {/* 
          Map View - Primary Food Discovery Interface
          
          Layout:
          - 12-column grid on large screens
          - Left column (8 cols): Map and food listings
          - Right column (4 cols): Detail panel
          - Single column on mobile
          - Generous gap (20 units) for breathing room
          - Entrance animation: fade and slide from bottom
        */}
        {view === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* 
              Left Column: Map and Listings
              Contains header with filters, interactive map, and food cards grid.
            */}
            <div className="lg:col-span-8 space-y-24">
              {/* 
                Map View Header
                
                Contains:
                1. Title and city selector
                2. Dietary filter tags
                
                Layout:
                - Flexbox with space-between for title and filters
                - Stacks vertically on mobile, horizontal on desktop
              */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                <div className="space-y-4">
                  {/* Page Title with massive serif typography */}
                  <h2 className="serif text-7xl md:text-9xl text-white tracking-tighter text-glow-gold">
                    Pickups
                  </h2>

                  {/* 
                    City Filter Dropdown
                    Glassmorphic container with select element.
                    Shows current city or "All Regions".
                  */}
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-inner">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      Location
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-amber-400 font-black focus:outline-none cursor-pointer text-sm"
                    >
                      <option value="All">All Regions</option>
                      {CANADIAN_CITIES.map(c => (
                        <option key={c} value={c} className="bg-emerald-950">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 
                  Dietary Filter Tags
                  
                  Horizontal scrollable row of filter buttons.
                  Shows "All" plus first 4 dietary tags.
                  
                  Active state:
                  - Amber background with glow
                  - Emerald text for contrast
                  
                  Inactive state:
                  - Subtle white background
                  - Slate text
                  - Hover brightens border
                */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {['All', ...DIETARY_TAGS.slice(0, 4)].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setFilter(tag)}
                      className={`px-12 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${filter === tag
                          ? 'bg-amber-500 text-emerald-950 shadow-[0_0_40px_rgba(251,191,36,0.3)]'
                          : 'bg-white/5 text-slate-400 border border-white/5 hover:border-white/20'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </header>

              {/* 
                Interactive Map Container
                
                Styling:
                - Fixed height (700px) for consistent appearance
                - Heavy border radius (5rem) for modern aesthetic
                - Thick decorative border (20px) with glass effect
                - Multi-layered shadow for depth
                - Group hover effects for interaction polish
                
                Content:
                MapView component showing only available drops.
              */}
              <div className="h-[700px] rounded-[5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative group border-[20px] border-white/5 celestial-glass">
                <MapView
                  drops={drops.filter(d => d.status === 'available')}
                  onSelectDrop={setSelectedDrop}
                />
              </div>

              {/* 
                Food Cards Grid
                
                Layout:
                - Single column on mobile
                - Two columns on medium screens and up
                - Generous gap (16 units) for clear separation
                
                Content:
                Maps through filtered drops to render FoodCard components.
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {drops.map(drop => (
                  <FoodCard
                    key={drop.id}
                    drop={drop}
                    onClick={setSelectedDrop}
                  />
                ))}
              </div>
            </div>

            {/* 
              Right Column: Detail Panel
              
              Sticky positioning keeps panel visible during scroll.
              Top offset (48 spacing = 192px) accounts for navbar.
            */}
            <div className="lg:col-span-4">
              <div className="sticky top-48">
                {selectedDrop ? (
                  /* 
                    Selected Drop Detail Panel
                    
                    Large glassmorphic container with:
                    - Heavy padding (14 units = 56px)
                    - Extra rounded corners (5rem)
                    - Slide-in animation from right
                    - Deep shadow for elevation
                    
                    Contains conditional content based on drop status
                    and reservation state.
                  */
                  <div className="celestial-glass p-14 rounded-[5rem] border border-white/10 animate-in slide-in-from-right-12 duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                    {/* 
                      Panel Header
                      
                      Contains:
                      - City label and title
                      - Close button (X)
                      
                      Layout: Flex with space-between
                    */}
                    <div className="flex justify-between items-start mb-16">
                      <div className="space-y-4">
                        {/* City label in amber */}
                        <span className="text-[12px] font-black text-amber-500 uppercase tracking-[0.6em] mb-4 block">
                          {selectedDrop.city}
                        </span>
                        {/* Drop title in massive serif font */}
                        <h3 className="serif text-7xl text-white leading-[0.8] tracking-tighter text-glow-gold">
                          {selectedDrop.title}
                        </h3>
                      </div>

                      {/* 
                        Close Button
                        
                        Features:
                        - Circular shape (16 units = 64px)
                        - Glassmorphic background
                        - X icon that rotates 90° on hover
                        - Hover effect changes to rose tint
                        - Clears selection and resets reservation state
                      */}
                      <button
                        onClick={() => {
                          setSelectedDrop(null);
                          setIsReserving(false);
                        }}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/20 text-slate-400 hover:text-white transition-all shadow-xl group"
                      >
                        <svg
                          className="w-8 h-8 transition-transform group-hover:rotate-90"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* 
                      Detail Panel Content
                      Conditional rendering based on drop status and reservation state.
                    */}
                    <div className="space-y-16">
                      {/* 
                        Available Drop - Not Reserving
                        Shows drop details and reservation button.
                      */}
                      {selectedDrop.status === 'available' && !isReserving && (
                        <>
                          {/* AI Summary in italicized quote box */}
                          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 italic text-slate-300 text-2xl leading-relaxed shadow-inner italic">
                            "{selectedDrop.aiSummary}"
                          </div>

                          {/* Address Information */}
                          <div className="space-y-4">
                            <span className="text-slate-500 uppercase tracking-[0.5em] text-[11px] font-black">
                              Address
                            </span>
                            <p className="text-2xl font-black text-white leading-tight tracking-tight">
                              {selectedDrop.pickupAddress}
                            </p>
                          </div>

                          {/* 
                            Reserve Pickup Button
                            
                            Behavior:
                            - Guest users: Redirects to authentication
                            - Authenticated users: Opens reservation form
                            
                            Styling: Extra large with dramatic sizing
                          */}
                          <Button
                            fullWidth
                            size="lg"
                            className="h-32 text-2xl rounded-[3rem]"
                            onClick={() => role === 'guest' ? setView('auth') : setIsReserving(true)}
                          >
                            Reserve Pickup
                          </Button>
                        </>
                      )}

                      {/* 
                        Available Drop - Reservation Form Active
                        
                        Form with:
                        - Name input
                        - Phone input
                        - Confirm button
                        
                        Animation: Fade and zoom entrance
                      */}
                      {selectedDrop.status === 'available' && isReserving && (
                        <form
                          onSubmit={onReserve}
                          className="space-y-12 animate-in fade-in zoom-in-95 duration-700"
                        >
                          {/* Name Input */}
                          <input
                            type="text"
                            required
                            placeholder="Pickup Name"
                            value={reserveName}
                            onChange={e => setReserveName(e.target.value)}
                            className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-white outline-none text-2xl"
                          />

                          {/* Phone Input */}
                          <input
                            type="tel"
                            required
                            placeholder="Phone Number"
                            value={reservePhone}
                            onChange={e => setReservePhone(e.target.value)}
                            className="w-full px-10 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-white outline-none text-2xl"
                          />

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            fullWidth
                            className="h-28 text-xl"
                          >
                            Confirm Pickup
                          </Button>
                        </form>
                      )}

                      {/* 
                        Claimed Drop - Confirmation Screen
                        
                        Shows:
                        - Success message
                        - Unique confirmation code
                        - Back to map button
                        
                        Animation: Zoom-in entrance for celebration effect
                      */}
                      {selectedDrop.status === 'claimed' && (
                        <div className="space-y-16 text-center py-10 animate-in zoom-in-90 duration-1000">
                          {/* Success headline */}
                          <h4 className="serif text-7xl text-white mb-4">Confirmed.</h4>

                          {/* 
                            Confirmation Code
                            Random 4-digit code with BKL prefix.
                            Large, prominent display in amber.
                          */}
                          <span className="text-2xl font-black text-amber-500 uppercase tracking-[0.6em]">
                            CODE: BKL-{Math.floor(Math.random() * 9000) + 1000}
                          </span>

                          {/* Return to map button */}
                          <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setSelectedDrop(null)}
                            className="h-20 rounded-full text-sm text-slate-400"
                          >
                            Back to Map
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* 
                    No Selection State
                    
                    Placeholder shown when no drop is selected.
                    Dashed border suggests interactivity.
                    Faded text provides gentle instruction.
                  */
                  <div className="p-32 rounded-[6rem] border-4 border-dashed border-white/5 text-center bg-emerald-950/20">
                    <p className="serif text-5xl text-white/10">Select a point</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 
          Donor Dashboard View
          
          Only accessible when authenticated as donor.
          Filters drops to show only those created by current user.
          
          Props:
          - onAddDrop: Callback for creating new food drops
          - myDrops: User's donations filtered by email
        */}
        {view === 'donor-dashboard' && (
          <DonorDashboard
            onAddDrop={onAddDrop}
            myDrops={allDrops.filter(d => d.donorId === user?.email)}
          />
        )}

        {/* 
          SMS Interface View
          
          Simulates SMS-based platform access.
          Shows only available drops (filters out claimed/expired).
        */}
        {view === 'sms' && (
          <SMSView
            drops={allDrops.filter(d => d.status === 'available')}
          />
        )}
      </main>

      {/* 
        Footer Section
        
        Appears at bottom of all pages.
        Contains:
        - Large logo
        - Copyright/year information
        
        Styling:
        - Heavy vertical padding for spaciousness
        - Top margin separates from content
        - Border and dark background for definition
        - Centered content
      */}
      <footer className="py-72 mt-72 border-t border-white/5 bg-black/20 text-center">
        <Logo size="lg" className="justify-center mb-32" />
        <p className="text-amber-500 font-black text-[14px] uppercase tracking-[1.5em] mb-48">
          BarakahLink • 2026
        </p>
      </footer>
    </div>
  );
};