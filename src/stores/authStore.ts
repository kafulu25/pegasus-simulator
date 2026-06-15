import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username) => {
        console.log('🔐 Login successful:', username);
        set({ isAuthenticated: true, user: username });
      },
      logout: () => {
        console.log('🚪 Logout triggered');
        set({ isAuthenticated: false, user: null });
        // Clear any other stores if needed
        localStorage.removeItem('pegasus-auth');
      },
    }),
    {
      name: 'pegasus-auth',
    }
  )
);