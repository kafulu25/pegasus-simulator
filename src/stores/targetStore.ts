import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the Target type (match your existing mock data structure)
export interface Target {
  id: string;
  name: string;
  phone: string;
  device: string;
  os?: string;
  status: 'active' | 'inactive' | 'offline';
  lastSeen?: string;
  notes?: string;
  // add any other fields you use (e.g., email, imei, etc.)
}

interface TargetStore {
  targets: Target[];
  selectedTargetId: string | null;
  // Actions
  setTargets: (targets: Target[]) => void;
  updateTarget: (id: string, data: Partial<Target>) => void;
  addTarget: (target: Target) => void;
  removeTarget: (id: string) => void;
  selectTarget: (id: string | null) => void;
  resetTargets: (defaultTargets: Target[]) => void; // optional reset helper
}

export const useTargetStore = create<TargetStore>()(
  persist(
    (set) => ({
      targets: [],
      selectedTargetId: null,

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
    }),
    {
      name: 'pegasus-target-storage', // localStorage key
    }
  )
);
