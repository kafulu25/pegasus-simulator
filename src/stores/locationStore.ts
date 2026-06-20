// src/stores/locationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocationPoint {
  id: number;
  targetId: number;
  targetName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  timestamp: Date;
  accuracy: number;
  speed?: number;
  heading?: number;
}

interface LocationStore {
  locations: LocationPoint[];
  addLocation: (location: LocationPoint) => void;
  getLatestLocation: (targetId: number) => LocationPoint | null;
  getMovementHistory: (targetId: number, hours?: number) => LocationPoint[];
  getLocationsByTarget: (targetId: number) => LocationPoint[];
  clearLocations: () => void;
}

const mockLocations: LocationPoint[] = [
  {
    id: 1,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Home — North Tehran Apt.',
    coordinates: { lat: 35.7912, lng: 51.4108 },
    timestamp: new Date(Date.now() - 8 * 3600000),
    accuracy: 5,
    speed: 0,
  },
  {
    id: 2,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Tehran Metro — Tajrish Station',
    coordinates: { lat: 35.8059, lng: 51.4307 },
    timestamp: new Date(Date.now() - 6 * 3600000),
    accuracy: 8,
    speed: 12,
  },
  {
    id: 3,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Reuters Bureau — Vanak',
    coordinates: { lat: 35.7642, lng: 51.4026 },
    timestamp: new Date(Date.now() - 4 * 3600000),
    accuracy: 6,
    speed: 0,
  },
  {
    id: 4,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    address: 'Current Location',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    timestamp: new Date(),
    accuracy: 3,
    speed: 0,
  },
  // Add more mock data for other targets if needed
];

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locations: mockLocations,

      addLocation: (location) =>
        set((state) => ({
          locations: [...state.locations, location],
        })),

      getLatestLocation: (targetId) => {
        const targetLocations = get().locations
          .filter(l => l.targetId === targetId)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return targetLocations[0] || null;
      },

      getMovementHistory: (targetId, hours = 24) => {
        const cutoff = new Date(Date.now() - hours * 3600000);
        return get().locations
          .filter(l => l.targetId === targetId && l.timestamp >= cutoff)
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      },

      getLocationsByTarget: (targetId) => {
        return get().locations
          .filter(l => l.targetId === targetId)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      },

      clearLocations: () => set({ locations: [] }),
    }),
    {
      name: 'pegasus-locations',
    }
  )
);
