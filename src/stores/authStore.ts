// src/stores/authStore.ts
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
        set({ isAuthenticated: true, user: username });
        localStorage.setItem('pegasus-auth', JSON.stringify({ state: { isAuthenticated: true, user: username } }));
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
        localStorage.removeItem('pegasus-auth');
      },
    }),
    {
      name: 'pegasus-auth',
    }
  )
);
