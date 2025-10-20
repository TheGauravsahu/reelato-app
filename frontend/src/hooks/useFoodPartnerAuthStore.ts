import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import type { IFoodPartner } from "@/types";

type AuthState = {
  foodPartner: IFoodPartner | null;
  token: string | null;
  loading: boolean;
  setFoodPartner: (foodPartner: IFoodPartner | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useFoodPartnerAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      foodPartner: null,
      token: null,
      loading: true,
      setFoodPartner: (foodPartner) => {
        set({ foodPartner, loading: false });
      },
      setToken: (token) => {
        set({ token, loading: false });
      },
      logout: () => {
        apiClient.post("/auth/food-partners/logout").catch(() => {});
        set({ foodPartner: null });
      },
      checkAuth: async () => {
        try {
          const res = await apiClient.get<{
            data: { foodPartner: IFoodPartner; token: string };
          }>("/auth/food-partners/me");
          set({
            foodPartner: res.data.foodPartner,
            token: res.data.token,
            loading: false,
          });
        } catch {
          toast.error("Session expired. Please log in again.");
          set({ foodPartner: null, token: null, loading: false });
        }
      },
    }),
    {
      name: "reelato-food-partner-auth-storage",
      partialize: (state) => ({
        foodPartner: state.foodPartner,
        token: state.token,
      }),
      onRehydrateStorage: () => async (state) => {
        if (!state) return;
        const { foodPartner, checkAuth } = state as AuthState;
        if (foodPartner) {
          // Already have persisted data — verify it
          await checkAuth();
        } else {
          // No data found — stop loading
          state.loading = false;
        }
      },
    }
  )
);
