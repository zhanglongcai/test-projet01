import { create } from 'zustand';

interface UserState {
  user: any | null;
  setUser: (user: any) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  isAuthenticated: () => !!get().user,
}));