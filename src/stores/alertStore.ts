import { create } from 'zustand';
import { Alert } from '@/types';

interface AlertStore {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  dismissAlert: (id: number) => void;
  acknowledgeAlert: (id: number) => void;
  getActiveAlerts: () => Alert[];
  getCriticalAlerts: () => Alert[];
}

const mockAlerts: Alert[] = [
  { id: 1, type: 'critical', icon: '🔴', title: 'Keyword Alert: "extraction"', description: 'Target Leila Nazari used keyword in Signal message to Geneva contact.', metadata: '2024-02-10 12:31 · Signal · Target: Leila Nazari', timestamp: new Date(), dismissed: false, acknowledged: false },
  { id: 2, type: 'critical', icon: '🔴', title: 'Counter-Surveillance Detected', description: 'Ahmad Karimi installed Kaspersky Mobile Security — possible detection awareness.', metadata: '2024-02-10 10:15 · Device Activity · Target: Ahmad Karimi', timestamp: new Date(Date.now() - 3600000), dismissed: false, acknowledged: false },
  { id: 3, type: 'warning', icon: '🟡', title: 'Geofence Exit: Marcus Webb', description: 'Target has left London boundary. Current location: Brussels, Belgium.', metadata: '2024-02-10 09:44 · GPS Alert · Target: Marcus Webb', timestamp: new Date(Date.now() - 7200000), dismissed: false, acknowledged: false },
  { id: 4, type: 'warning', icon: '🟡', title: 'New Encrypted App Installed', description: 'Sara Petrov installed Briar Messenger — unknown encryption protocol.', metadata: '2024-02-09 21:12 · App Monitor · Target: Sara Petrov', timestamp: new Date(Date.now() - 86400000), dismissed: false, acknowledged: false },
  { id: 5, type: 'info', icon: '🔵', title: 'New Contact Added', description: 'Ahmad Karimi added 2 new contacts not previously in social graph.', metadata: '2024-02-09 18:00 · Contacts · Target: Ahmad Karimi', timestamp: new Date(Date.now() - 129600000), dismissed: false, acknowledged: false },
];

export const useAlertStore = create<AlertStore>((set, get) => ({
  alerts: mockAlerts,
  
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  
  dismissAlert: (id) => set((state) => ({ alerts: state.alerts.map(a => a.id === id ? { ...a, dismissed: true } : a) })),
  
  acknowledgeAlert: (id) => set((state) => ({ alerts: state.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a) })),
  
  getActiveAlerts: () => {
    return get().alerts.filter(a => !a.dismissed);
  },
  
  getCriticalAlerts: () => {
    return get().alerts.filter(a => a.type === 'critical' && !a.dismissed);
  },
}));