// src/stores/targetStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Define your Target type ---
// Add any extra fields you have (e.g., email, imei, notes, etc.)
export interface Target {
  id: string;
  name: string;
  phone: string;
  device: string;
  os?: string;
  status: 'active' | 'inactive' | 'offline';
  lastSeen?: string;
  notes?: string;// src/stores/targetStore.ts
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
  loadFromStorage: () => void; // load from localStorage on app start
}

// Helper to sync to localStorage
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
  targets: [], // will be populated by loadFromStorage
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
  // ... add any other fields you use
}

// --- Store interface ---
interface TargetStore {
  // State
  targets: Target[];
  selectedTargetId: string | null;
  _hasHydrated: boolean;   // <-- NEW: hydration flag

  // Actions
  setTargets: (targets: Target[]) => void;
  updateTarget: (id: string, data: Partial<Target>) => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: string) => void;
  selectTarget: (id: string | null) => void;
  resetTargets: (defaultTargets: Target[]) => void;
  setHydrated: (state: boolean) => void;  // <-- NEW: setter for hydration flag

  // Add any other custom actions you have here (e.g., addNote, setStatus, etc.)
}

// --- Create the store with persist ---
export const useTargetStore = create<TargetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      targets: [],
      selectedTargetId: null,
      _hasHydrated: false,   // <-- NEW

      // --- Actions ---
      setTargets: (targets) => set({ targets }),

      updateTarget: (id, data) =>
        set((state) => ({
          targets: state.targets.map((target) =>
            target.id === id ? { ...target, ...data } : target
          ),
        })),

      addTarget: (target) =>
        set((state) => ({
          targets: [...state.targets, target],
        })),

      removeTarget: (id) =>
        set((state) => ({
          targets: state.targets.filter((target) => target.id !== id),
        })),

      selectTarget: (id) => set({ selectedTargetId: id }),

      resetTargets: (defaultTargets) => set({ targets: defaultTargets }),

      setHydrated: (state) => set({ _hasHydrated: state }),  // <-- NEW

      // --- Add any extra custom actions you have here ---
      // e.g.,
      // addNote: (id, note) => set((state) => ({
      //   targets: state.targets.map(t => t.id === id ? { ...t, notes: note } : t)
      // })),
    }),
    {
      name: 'pegasus-target-storage',   // <-- localStorage key
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // When hydration finishes, set the flag to true
        state?.setHydrated(true);
      },
    }
  )
);
