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
  totalServices: number;
  pageSize: number;
  currentPage: number;
  targetPhone: string;
  batchMapping: Record<string, string>; // serviceId -> number
  selectedService: VoiceService | null;
  setTotalServices: (count: number) => void;
  setPageSize: (size: number) => void;
  setTargetPhone: (phone: string) => void;
  setBatchMapping: (mapping: Record<string, string>) => void;
  addBatchMapping: (serviceId: string, number: string) => void;
  setPage: (page: number) => void;
  selectService: (service: VoiceService | null) => void;
  reset: () => void;
}

const platforms = [
  'WhatsApp', 'Telegram', 'Signal', 'Facebook Messenger',
  'Instagram', 'Snapchat', 'TikTok'
];
const encryptionLevels: VoiceService['encryption'][] = [
  'End-to-End', 'Transport', 'None', 'Unknown'
];

// Generates a specific number of services
const generateServices = (count: number): VoiceService[] => {
  const services: VoiceService[] = [];
  for (let i = 0; i < count; i++) {
    const platform = platforms[i % platforms.length];
    const enc = encryptionLevels[Math.floor(Math.random() * encryptionLevels.length)];
    services.push({
      id: `vs-${i}`,
      name: `Voice Note ${i + 1}`,
      platform,
      icon: '🎙️',
      encryption: enc,
      keyRequired: enc === 'End-to-End' || enc === 'Transport',
    });
  }
  return services;
};

export const useVoiceNotesStore = create<VoiceNotesStore>()(
  persist(
    (set, get) => ({
      services: generateServices(700),
      totalServices: 700,
      pageSize: 50,
      currentPage: 0,
      targetPhone: '',
      batchMapping: {},
      selectedService: null,

      setTotalServices: (count) => {
        const newServices = generateServices(count);
        set({
          totalServices: count,
          services: newServices,
          currentPage: 0, // reset to first page
        });
      },

      setPageSize: (size) => {
        set({
          pageSize: size,
          currentPage: 0, // reset to first page
        });
      },

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
        totalServices: 700,
        services: generateServices(700),
        pageSize: 50,
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
