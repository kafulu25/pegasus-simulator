// src/stores/feedStore.ts
import { create } from 'zustand';
import { FeedEvent } from '@/types';
import { useTargetStore } from './targetStore'; // <-- import target store

interface FeedStore {
  events: FeedEvent[];
  isLive: boolean;
  addEvent: (event: FeedEvent) => void;
  addEvents: (events: FeedEvent[]) => void;
  clearEvents: () => void;
  startLiveStream: () => void;
  stopLiveStream: () => void;
  getEventsByTarget: (targetId: number) => FeedEvent[];
  getEventsByType: (type: FeedEvent['type']) => FeedEvent[];
}

let interval: NodeJS.Timeout | null = null;

// Helper to get a random element from an array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomEvent = (): FeedEvent => {
  // 🔥 Get the current targets from the persistent store
  const currentTargets = useTargetStore.getState().targets;

  let targetId: number;
  let targetName: string;

  if (currentTargets.length > 0) {
    // Pick a random target from the store
    const target = randomItem(currentTargets);
    targetId = Number(target.id); // ensure number (adjust if you use strings)
    targetName = target.name;
  } else {
    // Fallback: if no targets exist yet, use generic placeholders
    const fallbackTargets = [
      { id: 1, name: 'Target001' },
      { id: 2, name: 'Target002' },
      { id: 3, name: 'Target003' },
      { id: 4, name: 'Target004' },
    ];
    const fallback = randomItem(fallbackTargets);
    targetId = fallback.id;
    targetName = fallback.name;
  }

  // Static event data (you can also make these dynamic if needed)
  const eventTypes: FeedEvent['type'][] = ['message', 'location', 'call', 'keylog', 'camera'];
  const apps = ['WhatsApp', 'Signal', 'Telegram', 'Cellular', 'GPS', 'Camera'];
  const messages = [
    'New encrypted message received',
    'GPS location updated',
    'Call recording saved',
    'Keystroke capture detected',
    'App opened: Signal',
    'Photo captured via front camera',
    'Location shared with contact',
    'File downloaded from cloud',
  ];

  return {
    id: Date.now().toString(),
    targetId,
    targetName,
    type: randomItem(eventTypes),
    app: randomItem(apps),
    message: randomItem(messages),
    severity: Math.random() > 0.7 ? 'critical' : 'info',
    timestamp: new Date(),
  };
};

export const useFeedStore = create<FeedStore>((set, get) => ({
  events: [],
  isLive: true,

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 200),
    })),

  addEvents: (events) =>
    set((state) => ({
      events: [...events, ...state.events].slice(0, 200),
    })),

  clearEvents: () => set({ events: [] }),

  startLiveStream: () => {
    if (interval) return;
    set({ isLive: true });
    interval = setInterval(() => {
      const newEvent = generateRandomEvent();
      if (newEvent) {
        get().addEvent(newEvent);
      }
    }, 8000);
  },

  stopLiveStream: () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    // Keep isLive true to maintain the "online" indicator
  },

  getEventsByTarget: (targetId) => {
    return get().events.filter((e) => e.targetId === targetId);
  },

  getEventsByType: (type) => {
    return get().events.filter((e) => e.type === type);
  },
}));
