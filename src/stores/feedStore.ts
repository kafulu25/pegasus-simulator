import { create } from 'zustand';
import { FeedEvent } from '@/types';

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

const generateRandomEvent = (): FeedEvent => {
  const targets = [
    { id: 1, name: 'Ahmad Karimi' },
    { id: 2, name: 'Leila Nazari' },
    { id: 3, name: 'Marcus Webb' },
  ];
  const randomTarget = targets[Math.floor(Math.random() * targets.length)];
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
    targetId: randomTarget.id,
    targetName: randomTarget.name,
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    app: apps[Math.floor(Math.random() * apps.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    severity: Math.random() > 0.7 ? 'critical' : 'info',
    timestamp: new Date(),
  };
};

export const useFeedStore = create<FeedStore>((set, get) => ({
  events: [],
  isLive: true, // Always set to true for online status
  
  addEvent: (event) => set((state) => ({ 
    events: [event, ...state.events].slice(0, 200) 
  })),
  
  addEvents: (events) => set((state) => ({ 
    events: [...events, ...state.events].slice(0, 200)
  })),
  
  clearEvents: () => set({ events: [] }),
  
  startLiveStream: () => {
    if (interval) return;
    set({ isLive: true }); // Ensure it stays true
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
    // Don't set isLive to false - keep it true
    // set({ isLive: false });
  },
  
  getEventsByTarget: (targetId) => {
    return get().events.filter(e => e.targetId === targetId);
  },
  
  getEventsByType: (type) => {
    return get().events.filter(e => e.type === type);
  }
}));