import { FoodDrop } from './types';
import { analyzeFoodDescription } from '../services/geminiService';

/**
 * Initial mock database state containing sample food drop listings.
 * These entries serve as placeholder data for development and testing purposes.
 * 
 * Each entry represents a food donation from a local business or donor,
 * including essential information such as location, availability window,
 * dietary tags, and AI-generated summaries.
 */
const INITIAL_DROPS: FoodDrop[] = [
  {
    id: '1',
    donorId: 'd1',
    donorName: 'Kitchener Market Bakery',
    donorPhone: '519-555-0101',
    title: 'Fresh Sourdough Loaves',
    description: '10 loaves of fresh sourdough baked this morning. Must go today!',
    quantity: '10 loaves',
    pickupAddress: '300 King St E',
    city: 'Kitchener',
    lat: 43.4497,
    lng: -80.4855,
    pickupStartTime: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 1000 * 60 * 120).toISOString(), // Available for 2 hours
    tags: ['Vegan', 'Bakery'],
    status: 'available',
    createdAt: new Date().toISOString(),
    aiSummary: 'Fresh sourdough loaves from a local bakery, perfect for families.'
  },
  {
    id: '2',
    donorId: 'd2',
    donorName: 'Uptown Bistro',
    donorPhone: '519-555-0202',
    title: 'Individual Pasta Meals',
    description: 'Surplus pasta with marinara. Halal and Vegetarian.',
    quantity: '15 portions',
    pickupAddress: '75 King St S',
    city: 'Waterloo',
    lat: 43.4651,
    lng: -80.5223,
    pickupStartTime: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 1000 * 60 * 300).toISOString(), // Available for 5 hours
    tags: ['Halal', 'Vegetarian', 'Hot Meal'],
    status: 'available',
    createdAt: new Date().toISOString(),
    aiSummary: 'Nutritious halal pasta meals ready for immediate pickup.'
  }
];

/**
 * In-memory database simulation for food drop listings.
 * This array maintains the current state of all food drops in the system.
 * 
 * Note: This is a temporary solution for development. In production,
 * this should be replaced with a persistent database solution.
 */
let dbDrops: FoodDrop[] = [...INITIAL_DROPS];

/**
 * BarakahLink Backend API
 * 
 * Provides core backend functionality for the BarakahLink food sharing platform.
 * This API handles food drop creation, retrieval, reservation, and user authentication.
 * 
 * Key Features:
 * - AI-powered content moderation and tagging using Gemini API
 * - Real-time food drop availability management
 * - Reservation system to prevent double-booking
 * - Mock authentication for development purposes
 */
export const BarakahBackend = {
  /**
   * Retrieves all food drop listings from the database.
   * 
   * This method fetches the complete list of food donations currently
   * available or claimed in the system. Results include all drop metadata
   * such as location, availability times, dietary tags, and reservation status.
   * 
   * @returns {Promise<FoodDrop[]>} Array of all food drop listings
   * 
   * @example
   * const drops = await BarakahBackend.getDrops();
   * console.log(`Found ${drops.length} food drops`);
   */
  async getDrops(): Promise<FoodDrop[]> {
    // Simulate network latency for realistic development experience
    await new Promise(r => setTimeout(r, 300));

    // Return a copy to prevent external modifications to the database
    return [...dbDrops];
  },

  /**
   * Creates a new food drop listing with AI-powered content analysis.
   * 
   * This method processes donor-submitted food donation information, validates
   * the content for appropriateness using AI analysis, automatically generates
   * relevant dietary tags, and creates a summary for recipients.
   * 
   * Content Moderation:
   * - Uses Gemini AI to analyze food descriptions for appropriateness
   * - Rejects submissions containing inappropriate or harmful content
   * - Automatically extracts dietary information (Halal, Vegan, etc.)
   * - Generates AI summaries to help recipients quickly understand offerings
   * 
   * @param {Partial<FoodDrop>} dropData - Partial food drop data from the donor
   * @param {string} donorId - Unique identifier for the donor
   * @param {string} donorName - Display name of the donor organization/individual
   * 
   * @returns {Promise<FoodDrop>} The newly created food drop with AI enhancements
   * 
   * @throws {Error} If the food description is flagged as inappropriate by AI analysis
   * 
   * @example
   * const newDrop = await BarakahBackend.createDrop({
   *   title: 'Fresh Vegetables',
   *   description: 'Organic carrots and lettuce from our garden',
   *   quantity: '5 kg',
   *   pickupAddress: '123 Main St',
   *   city: 'Kitchener'
   * }, 'donor123', 'Green Gardens');
   */
  async createDrop(dropData: Partial<FoodDrop>, donorId: string, donorName: string): Promise<FoodDrop> {
    // Analyze food description using AI for content moderation and tagging
    const analysis = await analyzeFoodDescription(dropData.description || '');

    // Reject inappropriate content to maintain platform safety
    if (!analysis.isAppropriate) {
      throw new Error("Content inappropriate for the community platform.");
    }

    // Construct the complete food drop object with AI-enhanced data
    const newDrop: FoodDrop = {
      // Generate a unique identifier for this drop
      id: Math.random().toString(36).substr(2, 9),

      // Donor information
      donorId,
      donorName,

      // Drop lifecycle status
      status: 'available',
      createdAt: new Date().toISOString(),

      // Core drop information with fallback defaults
      title: dropData.title || 'Untitled Donation',
      description: dropData.description || '',
      donorPhone: dropData.donorPhone || '',
      pickupAddress: dropData.pickupAddress || '',
      city: dropData.city || 'Kitchener',
      quantity: dropData.quantity || '1 portion',

      // AI-generated metadata from content analysis
      tags: analysis.tags,
      aiSummary: analysis.summary,

      // Availability window (defaults to 4 hours if not specified)
      pickupStartTime: dropData.pickupStartTime || new Date().toISOString(),
      availableUntil: dropData.availableUntil || new Date(Date.now() + 4 * 3600000).toISOString(),

      // Geographic coordinates (defaults to Kitchener city center)
      lat: dropData.lat || 43.45,
      lng: dropData.lng || -80.49,
    };

    // Add new drop to the beginning of the array for chronological ordering
    dbDrops = [newDrop, ...dbDrops];

    return newDrop;
  },

  /**
   * Reserves a food drop for a specific recipient.
   * 
   * This method allows recipients to claim available food drops, preventing
   * double-booking and ensuring fair distribution. Once reserved, the drop
   * status changes to 'claimed' and stores the recipient's contact information.
   * 
   * Validation:
   * - Verifies the drop exists in the system
   * - Ensures the drop hasn't already been claimed
   * - Atomically updates the drop status to prevent race conditions
   * 
   * @param {string} dropId - Unique identifier of the food drop to reserve
   * @param {string} name - Full name of the person claiming the food
   * @param {string} phone - Contact phone number for pickup coordination
   * 
   * @returns {Promise<FoodDrop>} The updated food drop with reservation details
   * 
   * @throws {Error} If the drop ID doesn't exist in the database
   * @throws {Error} If the drop has already been claimed by another recipient
   * 
   * @example
   * const reserved = await BarakahBackend.reserveDrop(
   *   'abc123',
   *   'John Doe',
   *   '519-555-0123'
   * );
   * console.log(`Reserved by: ${reserved.reservedBy?.name}`);
   */
  async reserveDrop(dropId: string, name: string, phone: string): Promise<FoodDrop> {
    // Locate the drop in the database
    const dropIndex = dbDrops.findIndex(d => d.id === dropId);

    // Validate drop exists
    if (dropIndex === -1) {
      throw new Error("Drop not found.");
    }

    // Prevent double-booking by checking current status
    if (dbDrops[dropIndex].status === 'claimed') {
      throw new Error("Already claimed.");
    }

    // Update drop with reservation information
    dbDrops[dropIndex] = {
      ...dbDrops[dropIndex],
      status: 'claimed',
      reservedBy: { name, phone }
    };

    return dbDrops[dropIndex];
  },

  /**
   * Authenticates a user and retrieves their profile information.
   * 
   * This is a mock authentication implementation for development purposes.
   * In production, this should be replaced with a proper authentication
   * system using secure password hashing, JWT tokens, or OAuth.
   * 
   * Current Behavior:
   * - Accepts any email address without password verification
   * - Derives username from email prefix (before @ symbol)
   * - Does not perform actual credential validation
   * 
   * @param {string} email - User's email address
   * 
   * @returns {Promise<{email: string, name: string}>} User profile object
   * 
   * @example
   * const user = await BarakahBackend.login('john.doe@example.com');
   * console.log(user.name); // Output: 'john.doe'
   * 
   * @todo Replace with production-ready authentication (e.g., Firebase Auth, Auth0)
   */
  async login(email: string): Promise<{ email: string; name: string }> {
    return {
      email,
      // Extract username from email (everything before '@')
      name: email.split('@')[0]
    };
  }
};