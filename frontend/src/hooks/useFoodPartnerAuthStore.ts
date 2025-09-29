import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import type { IFoodPartner } from "@/types";

type AuthState = {
  foodPartner: IFoodPartner | null;
  loading: boolean;
  setFoodPartner: (foodPartner: IFoodPartner | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export const useFoodParnterAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      foodPartner: null,
      loading: true,
      setFoodPartner: (foodPartner) => {
        set({ foodPartner, loading: false });
      },
      logout: () => {
        apiClient.post("/auth/food-partners/logout").catch(() => {});
        set({ foodPartner: null });
      },

      checkAuth: async () => {
        try {
          const res = await apiClient.get<{ data: IFoodPartner }>(
            "/auth/food-partners/me"
          );
          set({ foodPartner: res.data, loading: false });
        } catch {
          toast.error("Session expired. Please log in again.");
          set({ foodPartner: null, loading: false });
        }
      },
    }),
    {
      name: "reelato-food-partner-auth-storage",
      partialize: (state) => ({ user: state.foodPartner }),
    }
  )
);
