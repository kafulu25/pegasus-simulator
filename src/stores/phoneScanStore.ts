// src/stores/phoneScanStore.ts
import { create } from 'zustand';

export interface Packet {
  timestamp: string;      // e.g., "2026-06-19 14:23:45"
  data: string;           // human-readable, e.g., "SMS packet from 0755123456"
  base64: string;         // Base64 encoded data
  type: 'sms' | 'call' | 'gps' | 'app' | 'contact' | 'keystroke';
}

export interface CallLog {
  direction: 'incoming' | 'outgoing' | 'missed';
  number: string;
  duration: string;
  time: string;
}

export interface MessageLog {
  platform: 'sms' | 'whatsapp' | 'telegram';
  direction: 'incoming' | 'outgoing';
  number: string;
  content: string;
  time: string;
}

export interface ScanResult {
  phoneNumber: string;
  calls: CallLog[];
  messages: MessageLog[];
  associatedNumbers: { number: string; frequency: number }[];
  topCallers: { number: string; count: number }[];
  topCallees: { number: string; count: number }[];
  coordinates: { lat: number; lng: number; timestamp: string };
  installedApps: string[];
}

interface PhoneScanStore {
  // Scan state
  isScanning: boolean;
  progress: number; // 0-100
  statusText: string;
  packets: Packet[];
  // Discovered data (populated live)
  discoveredCalls: CallLog[];
  discoveredMessages: MessageLog[];
  discoveredContacts: Set<string>; // track unique numbers
  // Final result
  scanResult: ScanResult | null;
  
  // Actions
  startScan: (phone: string) => void;
  stopScan: () => void;
  addPacket: (packet: Packet) => void;
  addCall: (call: CallLog) => void;
  addMessage: (msg: MessageLog) => void;
  addContact: (number: string) => void;
  setProgress: (progress: number) => void;
  setStatus: (text: string) => void;
  completeScan: (result: ScanResult) => void;
  reset: () => void;
}

export const usePhoneScanStore = create<PhoneScanStore>((set, get) => ({
  isScanning: false,
  progress: 0,
  statusText: 'Idle',
  packets: [],
  discoveredCalls: [],
  discoveredMessages: [],
  discoveredContacts: new Set(),
  scanResult: null,

  startScan: (phone) => set({ 
    isScanning: true, 
    progress: 0, 
    packets: [], 
    discoveredCalls: [],
    discoveredMessages: [],
    discoveredContacts: new Set(),
    scanResult: null,
    statusText: 'Initializing wiretap...'
  }),
  stopScan: () => set({ isScanning: false }),
  addPacket: (packet) => set((state) => ({ packets: [...state.packets, packet] })),
  addCall: (call) => set((state) => ({ discoveredCalls: [...state.discoveredCalls, call] })),
  addMessage: (msg) => set((state) => ({ discoveredMessages: [...state.discoveredMessages, msg] })),
  addContact: (number) => set((state) => {
    const newSet = new Set(state.discoveredContacts);
    newSet.add(number);
    return { discoveredContacts: newSet };
  }),
  setProgress: (progress) => set({ progress }),
  setStatus: (statusText) => set({ statusText }),
  completeScan: (result) => set({ scanResult: result, isScanning: false, statusText: 'Scan complete' }),
  reset: () => set({ 
    isScanning: false, 
    progress: 0, 
    statusText: 'Idle', 
    packets: [], 
    discoveredCalls: [],
    discoveredMessages: [],
    discoveredContacts: new Set(),
    scanResult: null 
  }),
}));
