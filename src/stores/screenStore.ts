import { create } from 'zustand';

interface ScreenStore {
  isRecording: boolean;
  scheduleActive: boolean;
  interval: number;
  screenshots: Array<{ id: number; targetId: number; timestamp: Date; url: string }>;
  startRecording: () => void;
  stopRecording: () => void;
  startSchedule: (intervalSeconds: number) => void;
  stopSchedule: () => void;
  addScreenshot: (targetId: number) => void;
}

let scheduleInterval: NodeJS.Timeout | null = null;

export const useScreenStore = create<ScreenStore>((set, get) => ({
  isRecording: false,
  scheduleActive: false,
  interval: 30,
  screenshots: [],
  
  startRecording: () => set({ isRecording: true }),
  
  stopRecording: () => set({ isRecording: false }),
  
  startSchedule: (intervalSeconds) => {
    if (scheduleInterval) clearInterval(scheduleInterval);
    set({ scheduleActive: true, interval: intervalSeconds });
    scheduleInterval = setInterval(() => {
      get().addScreenshot(1);
    }, intervalSeconds * 1000);
  },
  
  stopSchedule: () => {
    if (scheduleInterval) {
      clearInterval(scheduleInterval);
      scheduleInterval = null;
    }
    set({ scheduleActive: false });
  },
  
  addScreenshot: (targetId) => set((state) => ({
    screenshots: [{ id: Date.now(), targetId, timestamp: new Date(), url: '' }, ...state.screenshots],
  })),
}));