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
  totalServices: number; // editable hidden
  setTargetPhone: (phone: string) => void;
  setBatchMapping: (mapping: Record<string, string>) => void;
  randomizeMapping: (numbers: string[]) => void; // new: random assign
  setPage: (page: number) => void;
  selectService: (service: VoiceService | null) => void;
  setTotalServices: (count: number) => void;
  reset: () => void;
}

// Generate services based on total count
const generateServices = (count: number): VoiceService[] => {
  const platforms = [
    'WhatsApp', 'Telegram', 'Signal', 'Facebook Messenger',
    'Instagram', 'Snapchat', 'TikTok'
  ];
  const encryptionLevels: VoiceService['encryption'][] = [
    'End-to-End', 'Transport', 'None', 'Unknown'
  ];
  const services: VoiceService[] = [];
  let id = 0;
  // Distribute evenly across platforms
  const perPlatform = Math.ceil(count / platforms.length);
  for (const platform of platforms) {
    for (let i = 0; i < perPlatform && services.length < count; i++) {
      const enc = encryptionLevels[Math.floor(Math.random() * encryptionLevels.length)];
      services.push({
        id: `vs-${id++}`,
        name: `Voice Note ${i+1}`,
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
    (set, get) => {
      const total = 700;
      return {
        services: generateServices(total),
        currentPage: 0,
        pageSize: 50,
        targetPhone: '',
        batchMapping: {},
        selectedService: null,
        totalServices: total,

        setTargetPhone: (phone) => set({ targetPhone: phone }),
        setBatchMapping: (mapping) => set({ batchMapping: mapping }),
        randomizeMapping: (numbers: string[]) => {
          const { services } = get();
          if (numbers.length === 0) return;
          const newMapping: Record<string, string> = {};
          // For each service, pick a random number from the list
          for (const service of services) {
            const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
            newMapping[service.id] = randomNumber;
          }
          set({ batchMapping: newMapping });
        },
        setPage: (page) => set({ currentPage: page }),
        selectService: (service) => set({ selectedService: service }),
        setTotalServices: (count) => {
          const newServices = generateServices(count);
          set({ services: newServices, totalServices: count, currentPage: 0 });
        },
        reset: () => set({
          currentPage: 0,
          targetPhone: '',
          batchMapping: {},
          selectedService: null,
          totalServices: 700,
          services: generateServices(700),
        }),
      };
    },
    {
      name: 'pegasus-voice-notes',
    }
  )
);
