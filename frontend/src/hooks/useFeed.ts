/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import type { ISavedHistory, IWatchHistory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useHistoryList = () => {
  return useQuery({
    queryKey: ["reelato-watch-history"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IWatchHistory[] }>(
        "/feed/watch-history"
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useDeleteAllHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete("/feed/watch-history");
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["reelato-watch-history"] });
      toastSuccessMessage(res.message);
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useDeleteHistoryItem = (foodId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/feed/watch-history/${foodId}`);
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["reelato-watch-history"] });
      toastSuccessMessage(res.message);
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useSavedList = () => {
  return useQuery({
    queryKey: ["reelato-saved-foods"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ISavedHistory[] }>("/feed/saved");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};
