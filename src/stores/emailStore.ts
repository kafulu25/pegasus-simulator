import { create } from 'zustand';
import { Email } from '@/types';

interface EmailStore {
  emails: Email[];
  selectedEmailId: number | null;
  selectEmail: (id: number | null) => void;
  markAsRead: (id: number) => void;
  addEmail: (email: Email) => void;
  getEmailsByTarget: (targetId: number) => Email[];
  getUnreadCount: () => number;
}

const mockEmails: Email[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', from: 'source_anonymous@proton.me', to: ['a.karimi@gmail.com'], subject: 'URGENT — Documents attached (classified)', body: 'Dear Ahmad,\n\nPlease find 47 pages of classified correspondence attached. This must reach the public before the parliamentary session scheduled for February 15.\n\nThe documents detail direct involvement in the censorship campaign. Destroy this email after reading.\n\nFor security, respond only via Signal.\n\n— [Source Protected]', date: new Date(), hasAttachments: true, isRead: false, folder: 'inbox' },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', from: 'editor@reuters-middle-east.com', to: ['a.karimi@gmail.com'], subject: 'Re: Story clearance — Feb 12 publish', body: 'Ahmad,\n\nLegal has signed off. Green light for Friday publication. Ensure all source identifications are anonymized.\n\nWord count: 2,400 max. Include the leaked ministry memo in Exhibit A.\n\n— Editorial Desk', date: new Date(Date.now() - 3600000), hasAttachments: false, isRead: true, folder: 'inbox' },
  { id: 3, targetId: 2, targetName: 'Leila Nazari', from: 'operations@int-org-geneva.net', to: ['l.nazari@proton.me'], subject: 'SR-9 Activation — 3 individuals', body: 'Leila,\n\nThe SR-9 extraction protocol has been authorized for 3 individuals on your list. Logistics team will contact each one separately via secure channel.\n\nPlease confirm receipt and destroy this message.\n\n— Operations Geneva', date: new Date(Date.now() - 7200000), hasAttachments: false, isRead: false, folder: 'inbox' },
  { id: 4, targetId: 1, targetName: 'Ahmad Karimi', from: 'security@protonmail.com', to: ['a.karimi@gmail.com'], subject: 'Security Alert: New login detected', body: 'A new login to your account was detected from Tehran, Iran. If this was not you, please secure your account immediately.', date: new Date(Date.now() - 86400000), hasAttachments: false, isRead: false, folder: 'inbox' },
];

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: mockEmails,
  selectedEmailId: null,
  
  selectEmail: (id) => set({ selectedEmailId: id }),
  
  markAsRead: (id) => set((state) => ({
    emails: state.emails.map(e => e.id === id ? { ...e, isRead: true } : e),
  })),
  
  addEmail: (email) => set((state) => ({ emails: [email, ...state.emails] })),
  
  getEmailsByTarget: (targetId) => {
    return get().emails.filter(e => e.targetId === targetId);
  },
  
  getUnreadCount: () => {
    return get().emails.filter(e => !e.isRead).length;
  },
}));