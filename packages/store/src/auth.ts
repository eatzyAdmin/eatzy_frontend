import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUserLogin } from "../../types/src";

type AuthState = {
  token: string | null;
  user: IUserLogin | null;
  setLogin: (token: string, user: IUserLogin) => void;
  setUser: (user: IUserLogin | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLogin: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "eatzy-auth-storage",
      storage: createJSONStorage(() => localStorage),
      // SECURITY: Only persist user info, NEVER persist access token
      partialize: (state) => ({ user: state.user }),
    }
  )
);