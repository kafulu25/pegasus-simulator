import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '@/types';

const defaultSettings: Settings = {
  opsec: {
    autoDestruct: true,
    trafficObfuscation: true,
    stealthMode: true,
    encryptedStorage: true,
    antiForensics: false,
  },
  c2: {
    primary: 'c2-pri.peg-ops.net:443',
    backup: 'c2-bak.relay-anon.net:8443',
    syncInterval: 15,
    encryptionKey: '3a9f2bc4e8d1f7a0c6b5e3d2a1f9c8b7',
  },
  dataCollection: {
    messages: true,
    calls: true,
    location: true,
    photos: true,
    keylogger: true,
    browserHistory: true,
    passwords: true,
    contacts: true,
    email: true,
    microphone: false,
    camera: false,
    screenCapture: false,
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
};

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  updateOpSec: (key: keyof Settings['opsec'], value: boolean) => void;
  updateC2: (key: keyof Settings['c2'], value: string | number) => void;
  updateDataCollection: (key: keyof Settings['dataCollection'], value: boolean) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      updateOpSec: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          opsec: { ...state.settings.opsec, [key]: value }
        }
      })),
      
      updateC2: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          c2: { ...state.settings.c2, [key]: value }
        }
      })),
      
      updateDataCollection: (key, value) => set((state) => ({
        settings: {
          ...state.settings,
          dataCollection: { ...state.settings.dataCollection, [key]: value }
        }
      })),
      
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'pegasus-settings',
    }
  )
);