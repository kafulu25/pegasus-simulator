import { create } from 'zustand';
import { BrowserHistory } from '@/types';

interface BrowserStore {
  history: BrowserHistory[];
  addHistory: (item: BrowserHistory) => void;
  getByBrowser: (browser: string) => BrowserHistory[];
  getByTarget: (targetId: number) => BrowserHistory[];
}

const mockHistory: BrowserHistory[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', browser: 'safari', url: 'https://protonmail.com/login', title: 'ProtonMail', timestamp: new Date(), visitCount: 3 },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', browser: 'chrome', url: 'https://signal.org/download', title: 'Signal Messenger', timestamp: new Date(Date.now() - 3600000), visitCount: 1 },
  { id: 3, targetId: 2, targetName: 'Leila Nazari', browser: 'firefox', url: 'https://theintercept.com', title: 'The Intercept', timestamp: new Date(Date.now() - 7200000), visitCount: 5 },
  { id: 4, targetId: 1, targetName: 'Ahmad Karimi', browser: 'safari', url: 'https://secure-drop.theguardian.com', title: 'SecureDrop', timestamp: new Date(Date.now() - 86400000), visitCount: 2 },
  { id: 5, targetId: 3, targetName: 'Marcus Webb', browser: 'chrome', url: 'https://github.com/security-tools', title: 'GitHub', timestamp: new Date(Date.now() - 172800000), visitCount: 8 },
];

export const useBrowserStore = create<BrowserStore>((set, get) => ({
  history: mockHistory,
  
  addHistory: (item) => set((state) => ({ history: [item, ...state.history] })),
  
  getByBrowser: (browser) => {
    return get().history.filter(h => h.browser === browser);
  },
  
  getByTarget: (targetId) => {
    return get().history.filter(h => h.targetId === targetId);
  },
}));