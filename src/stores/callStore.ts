import { create } from 'zustand';
import { CallLog } from '@/types';

interface CallStore {
  calls: CallLog[];
  isPlaying: boolean;
  currentPlayingId: number | null;
  toggleRecording: (id: number) => void;
  addCall: (call: CallLog) => void;
}

const mockCalls: CallLog[] = [
  {
    id: 1,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    direction: 'incoming',
    number: '+98 21 *** 4782',
    date: new Date(),
    duration: 502,
    hasRecording: true,
    app: 'Cellular',
  },
  {
    id: 2,
    targetId: 1,
    targetName: 'Ahmad Karimi',
    direction: 'outgoing',
    number: '+98 912 *** 1234',
    date: new Date(Date.now() - 3600000),
    duration: 180,
    hasRecording: true,
    app: 'WhatsApp',
  },
  {
    id: 3,
    targetId: 2,
    targetName: 'Leila Nazari',
    direction: 'incoming',
    number: '+90 532 *** 2190',
    date: new Date(Date.now() - 7200000),
    duration: 944,
    hasRecording: true,
    app: 'Signal',
  },
];

export const useCallStore = create<CallStore>((set, get) => ({
  calls: mockCalls,
  isPlaying: false,
  currentPlayingId: null,
  
  toggleRecording: (id) => set((state) => ({
    isPlaying: state.currentPlayingId === id ? !state.isPlaying : true,
    currentPlayingId: id,
  })),
  
  addCall: (call) => set((state) => ({
    calls: [call, ...state.calls],
  })),
}));