import { create } from 'zustand';
import { Credential } from '@/types';

interface PasswordStore {
  credentials: Credential[];
  addCredential: (credential: Credential) => void;
  getByTarget: (targetId: number) => Credential[];
  getWeakPasswords: () => Credential[];
}

const mockCredentials: Credential[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', service: 'Gmail', username: 'a.karimi.journalist@gmail.com', password: 'R3uters@2024!', token: 'ya29.a0AX...', capturedAt: new Date(), strength: 'strong' },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', service: 'ProtonMail', username: 'a.karimi@proton.me', password: 'SecurePass123!', token: 'pm_sess_8b3c...', capturedAt: new Date(Date.now() - 86400000), strength: 'strong' },
  { id: 3, targetId: 1, targetName: 'Ahmad Karimi', service: 'Signal', username: '+98-912-xxx-4782', password: 'SignalKey123', token: 'sig_key_0x4a2f...', capturedAt: new Date(Date.now() - 172800000), strength: 'medium' },
  { id: 4, targetId: 2, targetName: 'Leila Nazari', service: 'ProtonMail', username: 'l.nazari.free@proton.me', password: 'Fr33d0m!#2024', token: 'pm_sess_7d2e...', capturedAt: new Date(Date.now() - 259200000), strength: 'strong' },
  { id: 5, targetId: 2, targetName: 'Leila Nazari', service: 'WhatsApp', username: '+90-532-xxx-2190', password: 'WhatsApp2024', token: 'wa_token_abc...', capturedAt: new Date(Date.now() - 345600000), strength: 'weak' },
  { id: 6, targetId: 3, targetName: 'Marcus Webb', service: 'Twitter/X', username: '@marcus_webb_mp', password: 'W3bbMP!2023', token: 'oauth_1a_x9k...', capturedAt: new Date(Date.now() - 432000000), strength: 'medium' },
];

export const usePasswordStore = create<PasswordStore>((set, get) => ({
  credentials: mockCredentials,
  
  addCredential: (credential) => set((state) => ({ credentials: [credential, ...state.credentials] })),
  
  getByTarget: (targetId) => {
    return get().credentials.filter(c => c.targetId === targetId);
  },
  
  getWeakPasswords: () => {
    return get().credentials.filter(c => c.strength === 'weak');
  },
}));