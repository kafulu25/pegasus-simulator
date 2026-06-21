import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PhoneScanSettings {
  targetPhoneNumbers: string[];
  appList: string[];
  messageTemplates: string[];
  callDurationRange: [number, number];
  coordinateRange: { latMin: number; latMax: number; lngMin: number; lngMax: number };
  packetIntervalMs: number;
  simulateFailure: boolean; // ✅ ADD THIS LINE
}

interface PhoneScanSettingsStore {
  settings: PhoneScanSettings;
  updateSettings: (newSettings: Partial<PhoneScanSettings>) => void;
}

const defaultSettings: PhoneScanSettings = {
  targetPhoneNumbers: ['0755123456', '0776123456', '0788123456', '0701123456'],
  appList: ['WhatsApp', 'Telegram', 'Signal', 'Facebook', 'Instagram', 'Snapchat', 'TikTok'],
  messageTemplates: ['Hello', 'Meeting at 5', 'On my way', 'Call me later', "I'm here", 'Please confirm', 'Can you talk?', 'On the phone now'],
  callDurationRange: [10, 300],
  coordinateRange: { latMin: 0.3, latMax: 0.35, lngMin: 32.5, lngMax: 32.65 },
  packetIntervalMs: 500,
  simulateFailure: false, // ✅ ADD THIS LINE
};

export const usePhoneScanSettingsStore = create<PhoneScanSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'phone-scan-settings',
    }
  )
);
