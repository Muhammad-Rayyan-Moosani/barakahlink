import React, { useEffect, useRef } from 'react';
import { FoodDrop } from '../types';
import { KW_CENTER } from '../constants';

/**
 * Props interface for the MapView component.
 * 
 * @interface MapViewProps
 */
interface MapViewProps {
  /**
   * Array of food drop listings to display as markers on the map.
   * Each drop is represented by a marker at its geographic coordinates.
   */
  drops: FoodDrop[];

  /**
   * Callback function triggered when a user clicks on a map marker.
   * Allows parent component to display detailed information or open modals.
   * 
   * @param drop - The food drop associated with the clicked marker
   */
  onSelectDrop: (drop: FoodDrop) => void;
}

/**
 * Global Leaflet library declaration.
 * Leaflet is loaded externally via CDN, so we declare it for TypeScript.
 * 
 * Note: This assumes Leaflet is available in the global scope.
 * In production, consider using proper TypeScript definitions (@types/leaflet).
 */
declare const L: any;

/**
 * Interactive map component displaying food drop locations.
 * 
 * Renders an OpenStreetMap-based interactive map showing all available
 * food drops as clickable markers. Uses Leaflet.js for map rendering
 * and interaction handling.
 * 
 * Key Features:
 * - Interactive pan and zoom controls
 * - Marker clustering for food drop locations
 * - Click-to-select interaction for detailed views
 * - Popup previews showing basic food information
 * - Automatic marker updates when drop list changes
 * - Centered on Kitchener-Waterloo region by default
 * - Responsive container with fixed height
 * 
 * Map Initialization:
 * - Centers on KW_CENTER coordinates (Kitchener-Waterloo)
 * - Default zoom level of 13 (neighborhood view)
 * - Uses OpenStreetMap tiles (free, open-source)
 * 
 * Marker Behavior:
 * - Each food drop rendered as a standard Leaflet marker
 * - Markers show popup on hover with basic info
 * - Click triggers onSelectDrop callback for detailed view
 * - Markers automatically refresh when drops array changes
 * 
 * Performance Considerations:
 * - Markers are cleared and recreated on drops change
 * - Uses refs to maintain map instance across renders
 * - Prevents map re-initialization on component updates
 * 
 * Dependencies:
 * - Leaflet.js library (loaded externally)
 * - OpenStreetMap tile server
 * 
 * @component
 * @example
 * ```tsx
 * <MapView
 *   drops={availableFoodDrops}
 *   onSelectDrop={(drop) => openDetailModal(drop)}
 * />
 * ```
 * 
 * @remarks
 * This component requires Leaflet CSS to be loaded in the HTML head:
 * <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
 */
export const MapView: React.FC<MapViewProps> = ({ drops, onSelectDrop }) => {
  /**
   * Reference to the DOM element that will contain the map.
   * Used by Leaflet to attach the map instance to the DOM.
   */
  const mapContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Reference to the Leaflet map instance.
   * Persists across re-renders to prevent map re-initialization.
   * 
   * Initialized once on component mount, then reused for all updates.
   */
  const mapRef = useRef<any>(null);

  /**
   * Reference to array of all active marker instances.
   * Used to track and remove markers when the drops array changes.
   * 
   * Cleared and repopulated whenever drops prop updates.
   */
  const markersRef = useRef<any[]>([]);

  /**
   * Effect hook for map initialization and marker management.
   * 
   * Lifecycle:
   * 1. On first mount: Initialize Leaflet map instance
   * 2. On every update: Clear old markers and add new ones
   * 3. On unmount: Cleanup handled by Leaflet internally
   * 
   * Map Initialization:
   * - Only runs once when map instance doesn't exist
   * - Centers on Kitchener-Waterloo coordinates
   * - Adds OpenStreetMap tile layer for base map
   * 
   * Marker Management:
   * - Runs on every drops or onSelectDrop change
   * - Removes all existing markers from map
   * - Creates new markers for current drops array
   * - Binds popups and click handlers to each marker
   * 
   * Dependencies:
   * - drops: Triggers marker refresh when food drops change
   * - onSelectDrop: Ensures click handlers use latest callback
   */
  useEffect(() => {
    // Initialize map instance if it doesn't exist
    if (!mapRef.current && mapContainerRef.current) {
      // Create Leaflet map centered on Kitchener-Waterloo
      mapRef.current = L.map(mapContainerRef.current).setView(
        [KW_CENTER.lat, KW_CENTER.lng],
        13 // Zoom level: 13 is neighborhood-level view
      );

      // Add OpenStreetMap tile layer
      // Provides the actual map imagery and street data
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Clear all existing markers from the map
    // Prevents marker duplication when drops array changes
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    // Create and add new markers for each food drop
    drops.forEach(drop => {
      // Create marker at food drop's geographic coordinates
      const marker = L.marker([drop.lat, drop.lng]).addTo(mapRef.current);

      /**
       * Bind popup to marker with food drop preview information.
       * 
       * Popup Content:
       * - Title: Food drop name in bold, emerald color
       * - Donor: Organization/person name in small gray text
       * - Quantity: Amount available in medium size
       * 
       * Styling:
       * - Minimal padding for compact appearance
       * - Tailwind classes for consistent styling
       * - Color scheme matches platform design
       */
      marker.bindPopup(`
        <div class="p-1">
          <h3 class="font-bold text-emerald-800">${drop.title}</h3>
          <p class="text-xs text-slate-600">${drop.donorName}</p>
          <p class="text-sm mt-1">${drop.quantity}</p>
        </div>
      `);

      /**
       * Attach click event handler to marker.
       * Triggers parent callback to display detailed view or modal.
       */
      marker.on('click', () => onSelectDrop(drop));

      // Store marker reference for cleanup on next update
      markersRef.current.push(marker);
    });

    /**
     * Cleanup function (currently minimal).
     * Leaflet handles most cleanup internally when map is destroyed.
     * 
     * Future Considerations:
     * - Could add explicit map destruction on unmount if needed
     * - Could remove event listeners if memory leaks occur
     */
    return () => {
      // Cleanup if needed in future
    };
  }, [drops, onSelectDrop]);

  return (
    /**
     * Map Container
     * 
     * Styling:
     * - Fixed height (500px) for consistent appearance
     * - Full width to fill parent container
     * - Rounded corners for modern aesthetic
     * - Border and shadow for depth and definition
     * - Overflow hidden to contain map rendering
     * - Relative positioning for potential overlays
     * 
     * Accessibility:
     * - Interactive map is keyboard accessible via Leaflet
     * - Consider adding ARIA labels in future for screen readers
     */
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      {/* 
        Leaflet Map Mount Point
        
        This div serves as the DOM element where Leaflet attaches the map.
        Must fill container completely for proper map rendering.
        
        Ref: mapContainerRef provides DOM element to Leaflet initialization
      */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};