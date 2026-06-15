import { create } from 'zustand';
import { Target } from '@/types';

interface TargetStore {
  targets: Target[];
  selectedTargetId: number | null;
  isLoading: boolean;
  setTargets: (targets: Target[]) => void;
  addTarget: (target: Target) => void;
  updateTarget: (id: number, updates: Partial<Target>) => void;
  removeTarget: (id: number) => void;
  selectTarget: (id: number | null) => void;
  getSelectedTarget: () => Target | undefined;
  getTargetById: (id: number) => Target | undefined;
  getActiveTargets: () => Target[];
}

export const useTargetStore = create<TargetStore>((set, get) => ({
  targets: [],
  selectedTargetId: null,
  isLoading: false,
  
  setTargets: (targets) => set({ targets }),
  
  addTarget: (target) => set((state) => ({ 
    targets: [...state.targets, target] 
  })),
  
  updateTarget: (id, updates) => set((state) => ({
    targets: state.targets.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  removeTarget: (id) => set((state) => ({
    targets: state.targets.filter(t => t.id !== id),
    selectedTargetId: state.selectedTargetId === id ? null : state.selectedTargetId
  })),
  
  selectTarget: (id) => set({ selectedTargetId: id }),
  
  getSelectedTarget: () => {
    const { targets, selectedTargetId } = get();
    return targets.find(t => t.id === selectedTargetId);
  },
  
  getTargetById: (id) => {
    return get().targets.find(t => t.id === id);
  },
  
  getActiveTargets: () => {
    return get().targets.filter(t => t.status === 'active');
  }
}));