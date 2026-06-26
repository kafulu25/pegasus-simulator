import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VoiceService {
  id: string;
  name: string;
  platform: string;
  icon: string;
  encryption: 'End-to-End' | 'Transport' | 'None' | 'Unknown';
  keyRequired: boolean;
}

interface VoiceNotesStore {
  services: VoiceService[];
  currentPage: number;
  pageSize: number;
  targetPhone: string;
  batchMapping: Record<string, string>; // serviceId -> number
  selectedService: VoiceService | null;
  setTargetPhone: (phone: string) => void;
  setBatchMapping: (mapping: Record<string, string>) => void;
  addBatchMapping: (serviceId: string, number: string) => void;
  setPage: (page: number) => void;
  selectService: (service: VoiceService | null) => void;
  reset: () => void;
}

// Generate 700+ voice note services from the specified platforms
const generateServices = (): VoiceService[] => {
  const platforms = [
    'WhatsApp', 'Telegram', 'Signal', 'Facebook Messenger',
    'Instagram', 'Snapchat', 'TikTok'
  ];
  const encryptionLevels: VoiceService['encryption'][] = [
    'End-to-End', 'Transport', 'None', 'Unknown'
  ];
  const services: VoiceService[] = [];
  let id = 0;
  for (const platform of platforms) {
    // Generate 100 entries per platform (total 700)
    for (let i = 1; i <= 100; i++) {
      const enc = encryptionLevels[Math.floor(Math.random() * encryptionLevels.length)];
      services.push({
        id: `vs-${id++}`,
        name: `Voice Note ${i}`,
        platform,
        icon: '🎙️',
        encryption: enc,
        keyRequired: enc === 'End-to-End' || enc === 'Transport',
      });
    }
  }
  return services;
};

export const useVoiceNotesStore = create<VoiceNotesStore>()(
  persist(
    (set, get) => ({
      services: generateServices(),
      currentPage: 0,
      pageSize: 50,
      targetPhone: '',
      batchMapping: {},
      selectedService: null,

      setTargetPhone: (phone) => set({ targetPhone: phone }),
      setBatchMapping: (mapping) => set({ batchMapping: mapping }),
      addBatchMapping: (serviceId, number) => {
        set((state) => ({
          batchMapping: { ...state.batchMapping, [serviceId]: number },
        }));
      },
      setPage: (page) => set({ currentPage: page }),
      selectService: (service) => set({ selectedService: service }),
      reset: () => set({
        currentPage: 0,
        targetPhone: '',
        batchMapping: {},
        selectedService: null,
      }),
    }),
    {
      name: 'pegasus-voice-notes',
    }
  )
);
