import React, { useState, useMemo, useEffect } from 'react';

/**
 * Backend service responsible for API calls such as
 * authentication, fetching drops, creating drops, and reservations.
 */
import { BarakahBackend } from './backend/index.ts';

/**
 * Shared application types.
 * - FoodDrop: represents a food donation listing
 * - UserRole: role of the logged-in user (guest, donor, receiver, etc.)
 */
import type { FoodDrop, UserRole } from './backend/types.ts';

/**
 * Root UI component that renders different views
 * based on application state and user role.
 */
import { AppView } from './frontend/index.tsx';

const App: React.FC = () => {
  /**
   * Current user role (guest by default).
   * Determines which views and actions are available.
   */
  const [role, setRole] = useState<UserRole>('guest');

  /**
   * Logged-in user information.
   * Null indicates an unauthenticated guest user.
   */
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  /**
   * Controls the active view within the application
   * (e.g., landing page, map view, donor dashboard).
   */
  const [view, setView] = useState<string>('landing');

  /**
   * Full list of food drops fetched from the backend.
   */
  const [drops, setDrops] = useState<FoodDrop[]>([]);

  /**
   * Currently selected food drop for viewing details or reserving.
   */
  const [selectedDrop, setSelectedDrop] = useState<FoodDrop | null>(null);

  /**
   * Active tag-based filter (e.g., "Halal", "Vegetarian").
   */
  const [filter, setFilter] = useState<string>('All');

  /**
   * Active city filter for narrowing down food drops.
   */
  const [selectedCity, setSelectedCity] = useState<string>('All');

  /**
   * Tracks whether the reservation form is currently open.
   */
  const [isReserving, setIsReserving] = useState(false);

  /**
   * Reservation form state: name of the person reserving the drop.
   */
  const [reserveName, setReserveName] = useState('');

  /**
   * Reservation form state: phone number of the person reserving the drop.
   */
  const [reservePhone, setReservePhone] = useState('');

  /**
   * Initial data load.
   * Fetches all available food drops from the backend
   * when the application first mounts.
   */
  useEffect(() => {
    BarakahBackend.getDrops()
      .then(setDrops)
      .catch(err => console.error("Initial load failed:", err));
  }, []);

  /**
   * Memoized filtered list of drops.
   * Recomputes only when drops, city, or tag filter changes.
   * This improves performance by avoiding unnecessary recalculations.
   */
  const filteredDrops = useMemo(() => {
    return drops.filter(d => {
      const cityMatch = selectedCity === 'All' || d.city === selectedCity;
      const tagMatch = filter === 'All' || d.tags.includes(filter);
      return cityMatch && tagMatch;
    });
  }, [drops, filter, selectedCity]);

  /**
   * Handles creation of a new food drop.
   * Uses the logged-in user's details when available,
   * otherwise falls back to guest defaults.
   */
  const handleAddDrop = async (partialDrop: Partial<FoodDrop>) => {
    try {
      const newDrop = await BarakahBackend.createDrop(
        partialDrop,
        user?.email || 'guest',
        user?.name || 'Community Donor'
      );

      // Prepend the new drop to the existing list
      setDrops(prev => [newDrop, ...prev]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create drop");
    }
  };

  /**
   * Handles user login and role selection.
   * Updates application state and redirects to the appropriate view.
   */
  const handleLogin = async (chosenRole: UserRole, email: string) => {
    const userData = await BarakahBackend.login(email);
    setRole(chosenRole);
    setUser(userData);

    // Redirect user based on their role
    setView(chosenRole === 'donor' ? 'donor-dashboard' : 'map');
  };

  /**
   * Handles reservation submission for a selected food drop.
   * Updates both local state and backend data.
   */
  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrop) return;

    try {
      const updatedDrop = await BarakahBackend.reserveDrop(
        selectedDrop.id,
        reserveName,
        reservePhone
      );

      // Update drop list with the reserved drop
      setDrops(prev =>
        prev.map(d => d.id === updatedDrop.id ? updatedDrop : d)
      );

      // Update currently selected drop
      setSelectedDrop(updatedDrop);

      // Reset reservation UI state
      setIsReserving(false);
      setReserveName('');
      setReservePhone('');
    } catch (e) {
      alert("Reservation failed.");
    }
  };

  /**
   * Main render.
   * Delegates UI rendering to AppView and passes
   * all required state, setters, and handlers as props.
   */
  return (
    <AppView
      role={role} setRole={setRole}
      user={user} view={view} setView={setView}
      drops={filteredDrops} allDrops={drops}
      selectedDrop={selectedDrop} setSelectedDrop={setSelectedDrop}
      filter={filter} setFilter={setFilter}
      selectedCity={selectedCity} setSelectedCity={setSelectedCity}
      isReserving={isReserving} setIsReserving={setIsReserving}
      reserveName={reserveName} setReserveName={setReserveName}
      reservePhone={reservePhone} setReservePhone={setReservePhone}
      onAddDrop={handleAddDrop}
      onLogin={handleLogin}
      onReserve={handleReserve}
    />
  );
};

export default App;
