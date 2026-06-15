import { create } from 'zustand';
import { Contact } from '@/types';

interface ContactStore {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  getContactsByTarget: (targetId: number) => Contact[];
  getFrequentContacts: () => Contact[];
}

const mockContacts: Contact[] = [
  { id: 1, targetId: 1, targetName: 'Ahmad Karimi', name: 'Source Redacted', phoneNumbers: ['+98 21 *** 4782'], emails: ['source@proton.me'], interactionCount: 47, lastInteraction: new Date(), isFrequent: true },
  { id: 2, targetId: 1, targetName: 'Ahmad Karimi', name: 'Editor Hariri', phoneNumbers: ['+98 21 *** 1234'], emails: ['editor@reuters.com'], interactionCount: 23, lastInteraction: new Date(Date.now() - 86400000), isFrequent: true },
  { id: 3, targetId: 1, targetName: 'Ahmad Karimi', name: 'Lawyer Mostafa', phoneNumbers: ['+98 912 *** 5678'], emails: ['mostafa@law.com'], interactionCount: 12, lastInteraction: new Date(Date.now() - 172800000), isFrequent: false },
  { id: 4, targetId: 1, targetName: 'Ahmad Karimi', name: 'UN Representative', phoneNumbers: ['+41 22 *** 8901'], emails: ['un.rep@un.org'], interactionCount: 8, lastInteraction: new Date(Date.now() - 259200000), isFrequent: false },
  { id: 5, targetId: 2, targetName: 'Leila Nazari', name: 'Geneva Office', phoneNumbers: ['+41 22 *** 8901'], emails: ['geneva@intl.org'], interactionCount: 34, lastInteraction: new Date(), isFrequent: true },
  { id: 6, targetId: 2, targetName: 'Leila Nazari', name: 'Extraction Contact', phoneNumbers: ['+90 532 *** 2190'], emails: ['extract@secure.net'], interactionCount: 18, lastInteraction: new Date(Date.now() - 43200000), isFrequent: true },
  { id: 7, targetId: 2, targetName: 'Leila Nazari', name: 'Sister - Maryam N.', phoneNumbers: ['+90 533 *** 4567'], emails: ['maryam@email.com'], interactionCount: 45, lastInteraction: new Date(Date.now() - 21600000), isFrequent: true },
];

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: mockContacts,
  
  addContact: (contact) => set((state) => ({ contacts: [contact, ...state.contacts] })),
  
  getContactsByTarget: (targetId) => {
    return get().contacts.filter(c => c.targetId === targetId);
  },
  
  getFrequentContacts: () => {
    return get().contacts.filter(c => c.isFrequent);
  },
}));