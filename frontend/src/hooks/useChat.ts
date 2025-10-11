/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { toastErrorMessage } from "@/lib/utils";
import type { IChat, IChatWithFoodPartner, IMessage } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useCreateChat = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (foodPartnerId: string) => {
      const res = await apiClient.post<{ data: IChat }>("/chats", {
        foodPartnerId,
      });
      return res.data;
    },
    onSuccess: (data: IChat) => {
      navigate(`/chat/${data._id}`);
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["reelato-chatMessages", chatId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IMessage[] }>(
        `/chats/${chatId}/messages`
      );
      return res.data;
    },
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });
};

export const useUserChats = () => {
  return useQuery({
    queryKey: ["reelato-userChats"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IChatWithFoodPartner[] }>("/chats/user");
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
