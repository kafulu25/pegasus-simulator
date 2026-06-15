import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Case {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  targets: string[];
  createdDate: Date;
  lastUpdated: Date;
  evidenceCount: number;
}

interface CaseStore {
  cases: Case[];
  addCase: (caseItem: Case) => void;
  updateCase: (id: number, updates: Partial<Case>) => void;
  removeCase: (id: number) => void;
  getCasesByStatus: (status: Case['status']) => Case[];
  getCasesByPriority: (priority: Case['priority']) => Case[];
}

const mockCases: Case[] = [
  {
    id: 1,
    name: 'Operation Nightfall',
    description: 'Journalist surveillance - Tehran based reporter leaking classified documents',
    status: 'active',
    priority: 'high',
    targets: ['Ahmad Karimi', 'Source Redacted'],
    createdDate: new Date('2024-01-15'),
    lastUpdated: new Date(),
    evidenceCount: 1247,
  },
  {
    id: 2,
    name: 'Operation Phoenix',
    description: 'Human rights activist monitoring - International organization connections',
    status: 'active',
    priority: 'high',
    targets: ['Leila Nazari', 'Geneva Office'],
    createdDate: new Date('2024-01-22'),
    lastUpdated: new Date(),
    evidenceCount: 892,
  },
  {
    id: 3,
    name: 'Operation Guardian',
    description: 'Political opposition intelligence gathering',
    status: 'pending',
    priority: 'medium',
    targets: ['Marcus Webb', 'Party HQ'],
    createdDate: new Date('2023-12-10'),
    lastUpdated: new Date('2024-02-01'),
    evidenceCount: 456,
  },
  {
    id: 4,
    name: 'Operation Shadow',
    description: 'Investigative reporter - Cross-border collaboration tracking',
    status: 'closed',
    priority: 'low',
    targets: ['Sara Petrov'],
    createdDate: new Date('2023-11-01'),
    lastUpdated: new Date('2024-01-15'),
    evidenceCount: 234,
  },
];

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      cases: mockCases,
      
      addCase: (caseItem) => set((state) => ({ 
        cases: [caseItem, ...state.cases] 
      })),
      
      updateCase: (id, updates) => set((state) => ({
        cases: state.cases.map(c => c.id === id ? { ...c, ...updates, lastUpdated: new Date() } : c)
      })),
      
      removeCase: (id) => set((state) => ({
        cases: state.cases.filter(c => c.id !== id)
      })),
      
      getCasesByStatus: (status) => {
        return get().cases.filter(c => c.status === status);
      },
      
      getCasesByPriority: (priority) => {
        return get().cases.filter(c => c.priority === priority);
      },
    }),
    {
      name: 'pegasus-cases-storage',
    }
  )
);