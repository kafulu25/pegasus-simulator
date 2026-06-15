import { create } from 'zustand';

interface CameraStore {
  isActive: boolean;
  currentTarget: number | null;
  mode: 'front' | 'rear';
  captures: Array<{ id: number; targetId: number; timestamp: Date; type: string }>;
  activateCamera: (targetId: number, mode: 'front' | 'rear') => void;
  deactivateCamera: () => void;
  addCapture: (targetId: number, type: string) => void;
}

export const useCameraStore = create<CameraStore>((set, get) => ({
  isActive: false,
  currentTarget: null,
  mode: 'front',
  captures: [],
  
  activateCamera: (targetId, mode) => set({ isActive: true, currentTarget: targetId, mode }),
  
  deactivateCamera: () => set({ isActive: false, currentTarget: null }),
  
  addCapture: (targetId, type) => set((state) => ({
    captures: [{ id: Date.now(), targetId, timestamp: new Date(), type }, ...state.captures],
  })),
}));