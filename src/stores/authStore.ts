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
        console.log('🔐 Login successful:', username);
        set({ isAuthenticated: true, user: username });
        // Also update localStorage directly to be safe
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', username);
      },
      logout: () => {
        console.log('🚪 Logout triggered');
        set({ isAuthenticated: false, user: null });
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      },
    }),
    {
      name: 'pegasus-auth',
    }
  )
);
