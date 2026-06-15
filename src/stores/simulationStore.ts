import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SimulationState {
  isActive: boolean;
  tasks: any[];
  globalLog: string[];
  connectionStats: {
    packets: number;
    bytes: number;
    connections: number;
    latency: number;
  };
  internetSpeed: number;
  serversConnected: number;
  currentOperation: string;
  startSimulation: () => void;
  stopSimulation: () => void;
  addLog: (message: string) => void;
  updateTask: (taskId: number, updates: any) => void;
  updateConnectionStats: () => void;
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      isActive: false,
      tasks: [
        { id: 1, name: 'Initializing Connection', status: 'pending', progress: 0, output: [] },
        { id: 2, name: 'Bypassing Firewall', status: 'pending', progress: 0, output: [] },
        { id: 3, name: 'Establishing Secure Tunnel', status: 'pending', progress: 0, output: [] },
        { id: 4, name: 'Enumerating Target Network', status: 'pending', progress: 0, output: [] },
        { id: 5, name: 'Extracting Credentials', status: 'pending', progress: 0, output: [] },
        { id: 6, name: 'Dumping Database', status: 'pending', progress: 0, output: [] },
        { id: 7, name: 'Capturing Traffic', status: 'pending', progress: 0, output: [] },
        { id: 8, name: 'Finalizing Exploitation', status: 'pending', progress: 0, output: [] },
      ],
      globalLog: [],
      connectionStats: { packets: 0, bytes: 0, connections: 0, latency: 0 },
      internetSpeed: 0,
      serversConnected: 0,
      currentOperation: 'Idle',
      
      startSimulation: () => {
        set({ isActive: true });
      },
      
      stopSimulation: () => {
        set({ isActive: false });
      },
      
      addLog: (message: string) => {
        set((state) => ({
          globalLog: [`[${new Date().toLocaleTimeString()}] ${message}`, ...state.globalLog].slice(0, 500)
        }));
      },
      
      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        }));
      },
      
      updateConnectionStats: () => {
        set((state) => ({
          connectionStats: {
            packets: state.connectionStats.packets + Math.floor(Math.random() * 100),
            bytes: state.connectionStats.bytes + Math.floor(Math.random() * 10000),
            connections: state.connectionStats.connections + (Math.random() > 0.9 ? 1 : 0),
            latency: Math.floor(Math.random() * 50) + 10
          },
          internetSpeed: Math.floor(Math.random() * 900) + 50,
          serversConnected: Math.min(state.serversConnected + Math.floor(Math.random() * 2), 24)
        }));
      }
    }),
    {
      name: 'pegasus-simulation',
    }
  )
);