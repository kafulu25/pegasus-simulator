import { create } from 'zustand';
import { LocationPoint } from '@/types';
import { mockLocationPoints } from '@/utils/mockData';

interface LocationStore {
  locations: LocationPoint[];
  addLocation: (location: LocationPoint) => void;
  getLocationsByTarget: (targetId: number) => LocationPoint[];
  getLatestLocation: (targetId: number) => LocationPoint | undefined;
  getMovementHistory: (targetId: number, hours?: number) => LocationPoint[];
  clearLocations: () => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  locations: mockLocationPoints,
  
  addLocation: (location) => set((state) => ({
    locations: [...state.locations, location]
  })),
  
  getLocationsByTarget: (targetId) => {
    return get().locations.filter(l => l.targetId === targetId);
  },
  
  getLatestLocation: (targetId) => {
    const targetLocations = get().locations.filter(l => l.targetId === targetId);
    return targetLocations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  },
  
  getMovementHistory: (targetId, hours = 24) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return get().locations
      .filter(l => l.targetId === targetId && l.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },
  
  clearLocations: () => set({ locations: [] })
}));