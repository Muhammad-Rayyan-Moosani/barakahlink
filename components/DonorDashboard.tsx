import React, { useState } from 'react';
import { Button } from './Button';
import { analyzeFoodDescription } from '../services/geminiService';
import { FoodDrop } from '../types';
import { DIETARY_TAGS, CANADIAN_CITIES } from '../constants';

/**
 * Props interface for the DonorDashboard component.
 * 
 * @interface DonorDashboardProps
 */
interface DonorDashboardProps {
  /**
   * Callback function to add a new food drop to the platform.
   * Triggered when donor successfully submits the donation form.
   * 
   * @param drop - Partial food drop object containing donor-provided information
   */
  onAddDrop: (drop: Partial<FoodDrop>) => void;

  /**
   * Array of food drops created by the current donor.
   * Used to display the donor's active and claimed listings.
   */
  myDrops: FoodDrop[];
}

/**
 * Donor dashboard component for managing food donations.
 * 
 * Provides a comprehensive interface for donors to create new food drop listings
 * and monitor the status of their existing donations. Features AI-powered content
 * analysis to ensure food descriptions are appropriate and to automatically
 * generate dietary tags and summaries.
 * 
 * Key Features:
 * - Multi-step form for creating detailed food donations
 * - AI-powered content moderation using Gemini API
 * - Automatic dietary tag extraction and categorization
 * - Real-time form validation and error handling
 * - Visual status indicators for claimed vs. available donations
 * - Recipient contact information display for claimed items
 * - Responsive grid layout for donation listings
 * - Smooth animations and transitions for enhanced UX
 * 
 * Form Fields:
 * - Title: Short, descriptive name for the food
 * - Description: Detailed information about ingredients, dietary info, quantity
 * - Contact Phone: Donor's phone number for coordination
 * - City: Location selection from predefined Canadian cities
 * - Pickup Address: Street address for food collection
 * - Pickup Window: Start and end times for availability
 * 
 * AI Integration:
 * The component uses Gemini AI to analyze food descriptions for:
 * - Content appropriateness and safety
 * - Automatic dietary tag extraction (Vegan, Halal, Gluten-Free, etc.)
 * - AI-generated summaries for recipient convenience
 * 
 * @component
 * @example
 * ```tsx
 * <DonorDashboard
 *   onAddDrop={(drop) => handleCreateDrop(drop)}
 *   myDrops={userDonations}
 * />
 * ```
 */
export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onAddDrop, myDrops }) => {
  // Form field state management

  /**
   * Detailed description of the food donation.
   * Analyzed by AI for content moderation and tag extraction.
   */
  const [description, setDescription] = useState('');

  /**
   * Street address where recipients can pick up the food.
   */
  const [address, setAddress] = useState('');

  /**
   * City where the donation is located.
   * Defaults to the first city in the predefined list.
   */
  const [city, setCity] = useState(CANADIAN_CITIES[0]);

  /**
   * Short, descriptive title for the food donation.
   */
  const [title, setTitle] = useState('');

  /**
   * Donor's contact phone number for recipient coordination.
   */
  const [phone, setPhone] = useState('');

  /**
   * Quantity of food available (e.g., "10 loaves", "5 kg").
   */
  const [quantity, setQuantity] = useState('');

  /**
   * Time when the food becomes available for pickup.
   * Stored in HH:MM format for time input.
   */
  const [startTime, setStartTime] = useState('');

  /**
   * Time when the food is no longer available.
   * Stored in HH:MM format for time input.
   */
  const [endTime, setEndTime] = useState('');

  /**
   * Loading state indicating AI analysis is in progress.
   * Disables form submission to prevent duplicate requests.
   */
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Controls visibility of the donation creation form.
   * Toggles between form view and listings-only view.
   */
  const [showForm, setShowForm] = useState(false);

  /**
   * Handles form submission and food drop creation.
   * 
   * Process Flow:
   * 1. Prevents default form submission behavior
   * 2. Analyzes food description using Gemini AI
   * 3. Validates content appropriateness
   * 4. Constructs complete food drop object with AI-enhanced data
   * 5. Generates time-based availability window
   * 6. Adds randomized coordinates for map display
   * 7. Triggers parent callback with new drop data
   * 8. Resets form and closes form view
   * 
   * AI Analysis:
   * - Checks for inappropriate or unsafe content
   * - Extracts dietary tags (Vegan, Halal, etc.)
   * - Generates recipient-friendly summary
   * 
   * Error Handling:
   * - Alerts user if content is flagged as inappropriate
   * - Stops submission process if validation fails
   * - Maintains form state for user correction
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Analyze food description using AI for moderation and tagging
    const analysis = await analyzeFoodDescription(description);

    // Validate content appropriateness
    if (!analysis.isAppropriate) {
      alert("Please review your description for safety.");
      setIsAnalyzing(false);
      return;
    }

    // Construct availability time window
    const now = new Date();
    const start = startTime
      ? new Date(`${now.toDateString()} ${startTime}`)
      : now;
    const end = endTime
      ? new Date(`${now.toDateString()} ${endTime}`)
      : new Date(now.getTime() + 4 * 60 * 60 * 1000); // Default: 4 hours from now

    // Create food drop object with form data and AI enhancements
    onAddDrop({
      title,
      description,
      donorPhone: phone,
      pickupAddress: address,
      city,
      quantity,
      tags: analysis.tags, // AI-extracted dietary tags
      aiSummary: analysis.summary, // AI-generated summary
      pickupStartTime: start.toISOString(),
      availableUntil: end.toISOString(),
      // Generate randomized coordinates near Kitchener-Waterloo area
      // TODO: Replace with actual geocoding service in production
      lat: 43.45 + (Math.random() * 0.05 - 0.025),
      lng: -80.49 + (Math.random() * 0.05 - 0.025),
    });

    // Reset all form fields and close form
    setTitle('');
    setDescription('');
    setAddress('');
    setPhone('');
    setQuantity('');
    setStartTime('');
    setEndTime('');
    setShowForm(false);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-16">
      {/* Dashboard Header with Title and Action Button */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="serif text-7xl text-white mb-2 tracking-tight">My Listings</h2>
          <p className="text-slate-500 font-medium">Manage your active donations and community impact.</p>
        </div>
        {/* Toggle form visibility */}
        <Button size="lg" className="rounded-2xl" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Post New Donation'}
        </Button>
      </header>

      {/* Donation Creation Form (conditionally rendered) */}
      {showForm && (
        <div className="celestial-glass p-12 rounded-[3rem] border border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Row 1: Title and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Food Title Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Food Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-white outline-none"
                  placeholder="e.g. Fresh Bread Basket"
                />
              </div>

              {/* Contact Phone Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-white outline-none"
                  placeholder="519-XXX-XXXX"
                />
              </div>
            </div>

            {/* Row 2: City and Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* City Selection Dropdown */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium appearance-none text-white outline-none"
                >
                  {CANADIAN_CITIES.map(c => (
                    <option key={c} value={c} className="bg-emerald-950">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Address Input (spans 2 columns) */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Pickup Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-white outline-none"
                  placeholder="Street address for pickup"
                />
              </div>
            </div>

            {/* Row 3: Pickup Time Window */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Pickup Start Time */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Pickup Start
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-white outline-none"
                />
              </div>

              {/* Pickup End Time */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Pickup End
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:ring-2 focus:ring-amber-500 font-medium text-white outline-none"
                />
              </div>
            </div>

            {/* Food Description Textarea */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl h-32 focus:ring-2 focus:ring-amber-500 font-medium resize-none text-white outline-none"
                placeholder="List ingredients, dietary info, or quantity details..."
              ></textarea>
            </div>

            {/* Submit Button with Loading State */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              className="h-20 text-lg rounded-[2rem]"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Processing..." : 'Post Donation'}
            </Button>
          </form>
        </div>
      )}

      {/* Donor's Existing Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myDrops.map(drop => (
          <div
            key={drop.id}
            className="celestial-glass p-8 rounded-[2.5rem] border border-white/5 group hover:border-amber-400/30 transition-all"
          >
            {/* Card Header with Title and Status Badge */}
            <div className="flex justify-between items-start mb-6">
              <h4 className="serif text-3xl text-white group-hover:text-amber-400 transition-colors">
                {drop.title}
              </h4>
              {/* Status Badge (claimed/available) */}
              <span
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${drop.status === 'claimed'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                  }`}
              >
                {drop.status}
              </span>
            </div>

            {/* Conditional Content: Recipient Info or Waiting Message */}
            {drop.reservedBy ? (
              // Display recipient contact information for claimed drops
              <div className="mt-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Claimed By
                </p>
                <p className="text-sm font-bold text-white">{drop.reservedBy.name}</p>
                <p className="text-sm text-amber-500 font-black mt-1">{drop.reservedBy.phone}</p>
              </div>
            ) : (
              // Display waiting message for unclaimed drops
              <p className="text-xs text-slate-500 font-medium italic">
                Waiting for someone to claim.
              </p>
            )}
          </div>
        ))}

        {/* Empty State: No Active Listings */}
        {myDrops.length === 0 && !showForm && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-[3rem]">
            <p className="serif text-4xl text-slate-700">No active listings</p>
            <p className="text-slate-600 font-medium">Create your first donation above.</p>
          </div>
        )}
      </div>
    </div>
  );
};