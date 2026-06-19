import { create } from 'zustand';
import type { CallLog, Message } from '@/types';

export interface Packet {
  timestamp: string;
  data: string;
  base64: string;
  type: 'sms' | 'call' | 'gps' | 'app' | 'contact' | 'keystroke';
}

export interface ScanResult {
  phoneNumber: string;
  calls: CallLog[];
  messages: Message[];
  associatedNumbers: { number: string; frequency: number }[];
  topCallers: { number: string; count: number }[];
  topCallees: { number: string; count: number }[];
  coordinates: { lat: number; lng: number; timestamp: string };
  installedApps: string[];
}

interface PhoneScanStore {
  isScanning: boolean;
  progress: number;
  statusText: string;
  packets: Packet[];
  discoveredCalls: CallLog[];
  discoveredMessages: Message[];
  discoveredContacts: Set<string>;
  scanResult: ScanResult | null;
  startScan: (phone: string) => void;
  stopScan: () => void;
  addPacket: (packet: Packet) => void;
  addCall: (call: CallLog) => void;
  addMessage: (msg: Message) => void;
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
    scanResult: null,
  }),
}));
