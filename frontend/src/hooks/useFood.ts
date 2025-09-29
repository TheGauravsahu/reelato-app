import { apiClient } from "@/lib/api";
import type { IFood } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useFoodList = () => {
  return useQuery({
    queryKey: ["reelato-foodList"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFood[] }>("/foods");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
