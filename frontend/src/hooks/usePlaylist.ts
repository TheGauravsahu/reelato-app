/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";
import { type IPlaylist } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePlaylistList = () => {
  return useQuery({
    queryKey: ["reelato-playlists"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IPlaylist[] }>("/playlists");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: ["reelato-playlist", playlistId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IPlaylist }>(
        `/playlists/${playlistId}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      foodId,
    }: {
      playlistId: string;
      foodId: string;
    }) => {
      return await apiClient.put<{ data: IPlaylist }>(
        `/playlists/${playlistId}/add`,
        {
          foodId,
        }
      );
    },
    onSuccess: (res: any) => {
      toastSuccessMessage(res.message);
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlist", res.data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlists"],
      });
    },
    onError: (error: any) => {
      console.log(error);
      toastErrorMessage(error.response.data.message);
    },
  });
};

export const useDeleteFoodFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      foodId,
    }: {
      playlistId: string;
      foodId: string;
    }) => {
      return await apiClient.delete<{ data: IPlaylist }>(
        `/playlists/${playlistId}/${foodId}`
      );
    },
    onSuccess: (res: any) => {
      toastSuccessMessage(res.message);
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlist", res.data._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlists"],
      });
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      return await apiClient.post<{ data: IPlaylist }>("/playlists", {
        title,
      });
    },
    onSuccess: (res: any) => {
      toastSuccessMessage(res.message);
      queryClient.invalidateQueries({ queryKey: ["reelato-playlists"] });
    },
    onError: (error: any) => toastSuccessMessage(error.response.data.message),
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      return await apiClient.delete<{ data: IPlaylist }>(
        `/playlists/${playlistId}`
      );
    },
    onSuccess: (res: any) => {
      toastSuccessMessage(res.message);
      queryClient.invalidateQueries({ queryKey: ["reelato-playlists"] });
    },
    onError: (error: any) => toastSuccessMessage(error.response.data.message),
  });
};

export const useEditPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playlistId,
      title,
    }: {
      playlistId: string;
      title: string;
    }) => {
      return await apiClient.put<{ data: IPlaylist }>(
        `/playlists/${playlistId}`,
        {
          title,
        }
      );
    },
    onSuccess: (res: any) => {
      toastSuccessMessage(res.message);
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlists"],
      });
      queryClient.invalidateQueries({
        queryKey: ["reelato-playlist", res.data._id],
      });
    },
    onError: (error: any) => toastSuccessMessage(error.response.data.message),
  });
};
