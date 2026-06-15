import { create } from 'zustand';
import { KeylogEntry } from '@/types';

interface KeylogStore {
  entries: KeylogEntry[];
  addEntry: (entry: KeylogEntry) => void;
  getEntriesByTarget: (targetId: number) => KeylogEntry[];
}

const mockEntries: KeylogEntry[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', app: 'WhatsApp', text: 'meet at the usual place tomorrow. bring the files. make sure no one follows you', timestamp: new Date(), containsPassword: false },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', app: 'Gmail (Compose)', text: 'username: a.karimi@gmail.com password: R3uters@2024!', timestamp: new Date(Date.now() - 3600000), containsPassword: true },
  { id: 3, targetId: 1, targetName: 'Ahmad Karimi', app: 'Notes', text: 'Contact list for story: [1] ministry insider, [2] opposition leader M.W.', timestamp: new Date(Date.now() - 7200000), containsPassword: false },
  { id: 4, targetId: 2, targetName: 'Leila Nazari', app: 'Signal', text: 'I have the documents. 47 pages. classified level 3', timestamp: new Date(Date.now() - 10800000), containsPassword: false },
];

export const useKeylogStore = create<KeylogStore>((set, get) => ({
  entries: mockEntries,
  
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  
  getEntriesByTarget: (targetId) => {
    return get().entries.filter(e => e.targetId === targetId);
  },
}));