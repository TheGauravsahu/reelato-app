import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "@/types";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

type AuthState = {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  setUser: (user: IUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useUserAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: true,
      setUser: (user) => {
        set({ user, loading: false });
      },
      setToken: (token) => {
        set({ token, loading: false });
      },
      logout: () => {
        apiClient.post("/auth/users/logout").catch(() => {});
        set({ user: null });
      },

      checkAuth: async () => {
        set({ loading: true });
        try {
          const res = await apiClient.get<{
            data: { user: IUser; token: string };
          }>("/auth/users/me");
          set({ user: res.data.user, token: res.data.token, loading: false });
        } catch {
          toast.error("Session expired. Please log in again.");
          set({ user: null, token: null, loading: false });
        }
      },
    }),
    {
      name: "reelato-uAuth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
