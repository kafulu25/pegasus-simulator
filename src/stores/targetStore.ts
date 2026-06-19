// src/stores/targetStore.ts
import { create } from 'zustand';

export interface Target {
  id: string;
  name: string;
  phone: string;
  device: string;
  os?: string;
  status: 'active' | 'inactive' | 'offline';
  lastSeen?: string;
  notes?: string;
}

interface TargetStore {
  targets: Target[];
  selectedTargetId: string | null;
  setTargets: (targets: Target[]) => void;
  updateTarget: (id: string, data: Partial<Target>) => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: string) => void;
  selectTarget: (id: string | null) => void;
  resetTargets: (defaultTargets: Target[]) => void;
  loadFromStorage: () => void;
}

const STORAGE_KEY = 'pegasus-targets';
const saveToStorage = (targets: Target[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
};
const loadFromStorage = (): Target[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return []; }
  }
  return [];
};

export const useTargetStore = create<TargetStore>((set, get) => ({
  targets: [],
  selectedTargetId: null,

  setTargets: (targets) => {
    set({ targets });
    saveToStorage(targets);
  },

  updateTarget: (id, data) => {
    set((state) => {
      const newTargets = state.targets.map(t =>
        t.id === id ? { ...t, ...data } : t
      );
      saveToStorage(newTargets);
      return { targets: newTargets };
    });
  },

  addTarget: (target) => {
    set((state) => {
      const newTargets = [...state.targets, target];
      saveToStorage(newTargets);
      return { targets: newTargets };
    });
  },

  removeTarget: (id) => {
    set((state) => {
      const newTargets = state.targets.filter(t => t.id !== id);
      saveToStorage(newTargets);
      return { targets: newTargets };
    });
  },

  selectTarget: (id) => set({ selectedTargetId: id }),

  resetTargets: (defaultTargets) => {
    set({ targets: defaultTargets });
    saveToStorage(defaultTargets);
  },

  loadFromStorage: () => {
    const stored = loadFromStorage();
    set({ targets: stored });
  },
}));
