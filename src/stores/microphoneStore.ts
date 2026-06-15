import { create } from 'zustand';
import { Recording } from '@/types';

interface MicrophoneStore {
  isRecording: boolean;
  duration: number;
  recordings: Recording[];
  startRecording: () => void;
  stopRecording: () => void;
  addRecording: (recording: Recording) => void;
}

let interval: NodeJS.Timeout | null = null;

const mockRecordings: Recording[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', type: 'ambient', duration: 502, size: 14.2 * 1024 * 1024, timestamp: new Date(Date.now() - 86400000), url: '' },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', type: 'call', duration: 191, size: 11.1 * 1024 * 1024, timestamp: new Date(Date.now() - 129600000), url: '' },
  { id: 3, targetId: 2, targetName: 'Leila Nazari', type: 'call', duration: 944, size: 26.8 * 1024 * 1024, timestamp: new Date(Date.now() - 172800000), url: '' },
  { id: 4, targetId: 3, targetName: 'Marcus Webb', type: 'call', duration: 1323, size: 37.5 * 1024 * 1024, timestamp: new Date(Date.now() - 259200000), url: '' },
];

export const useMicrophoneStore = create<MicrophoneStore>((set, get) => ({
  isRecording: false,
  duration: 0,
  recordings: mockRecordings,
  
  startRecording: () => {
    if (interval) return;
    set({ isRecording: true, duration: 0 });
    interval = setInterval(() => {
      set((state) => ({ duration: state.duration + 1 }));
    }, 1000);
  },
  
  stopRecording: () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    set({ isRecording: false });
  },
  
  addRecording: (recording) => set((state) => ({ recordings: [recording, ...state.recordings] })),
}));