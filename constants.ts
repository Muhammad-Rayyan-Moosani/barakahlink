/**
 * FoodDrop type definition shared across the application.
 * Represents a single food donation listing.
 */
import { FoodDrop } from './types';

/**
 * Geographic center point for the Kitchener–Waterloo region.
 * Used as the default map center when no city is selected.
 */
export const KW_CENTER = {
  lat: 43.4516,
  lng: -80.4925,
};

/**
 * Supported cities within the application.
 * Used for filtering food drops and populating city selectors.
 */
export const CANADIAN_CITIES = [
  'Kitchener',
  'Waterloo',
  'Cambridge',
  'Guelph',
  'Toronto',
  'Hamilton',
  'London'
];

/**
 * Initial mock data for food drops.
 * 
 * This is typically used for:
 * - Local development
 * - UI prototyping
 * - Demo or fallback data when the backend is unavailable
 */
export const INITIAL_DROPS: FoodDrop[] = [
  {
    /** Unique identifier for the food drop */
    id: '1',

    /** Identifier of the donor who created the drop */
    donorId: 'd1',

    /** Display name of the donating organization or individual */
    donorName: 'Kitchener Market Bakery',

    /** Contact phone number for pickup coordination */
    donorPhone: '519-555-0101',

    /** Short, descriptive title of the food donation */
    title: 'Fresh Sourdough Loaves',

    /** Detailed description including urgency and context */
    description: '10 loaves of fresh sourdough baked this morning. Must go today!',

    /** Human-readable quantity information */
    quantity: '10 loaves',

    /** Street address where the food can be picked up */
    pickupAddress: '300 King St E',

    /** City used for filtering and map grouping */
    city: 'Kitchener',

    /** Latitude for map marker placement */
    lat: 43.4497,

    /** Longitude for map marker placement */
    lng: -80.4855,

    /** ISO timestamp indicating when pickup can begin */
    pickupStartTime: new Date().toISOString(),

    /** ISO timestamp indicating when the food is no longer available */
    availableUntil: new Date(Date.now() + 1000 * 60 * 120).toISOString(),

    /** Dietary and category tags used for filtering */
    tags: ['Vegan', 'Bakery'],

    /** Current availability status of the drop */
    status: 'available',

    /** Timestamp of when the drop was created */
    createdAt: new Date().toISOString(),

    /** AI-generated summary for quick scanning and accessibility */
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
    availableUntil: new Date(Date.now() + 1000 * 60 * 300).toISOString(),
    tags: ['Halal', 'Vegetarian', 'Hot Meal'],
    status: 'available',
    createdAt: new Date().toISOString(),
    aiSummary: 'Nutritious halal pasta meals ready for immediate pickup.'
  }
];

/**
 * Standardized dietary tags supported across the platform.
 * Used for tagging food drops and enabling dietary-based filtering.
 */
export const DIETARY_TAGS = [
  'Halal',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Kosher'
];
