import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewStore {
  currentView: string;
  previousView: string;
  setView: (view: string) => void;
  goBack: () => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set, get) => ({
      currentView: 'overview',
      previousView: 'overview',
      setView: (view) => {
        console.log('🔄 ViewStore: Changing view to:', view);
        set({ previousView: get().currentView, currentView: view });
      },
      goBack: () => {
        console.log('🔙 ViewStore: Going back to:', get().previousView);
        set({ currentView: get().previousView });
      },
    }),
    {
      name: 'pegasus-view-storage',
    }
  )
);