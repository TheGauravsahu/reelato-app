/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import { toastErrorMessage } from "@/lib/utils";
import type { IChat, IChatWithFoodPartner, IChatWithUser, IMessage } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useCreateChat = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (foodPartnerId: string) => {
      const res = await apiClient.post<{ data: IChat }>("/chats/user", {
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

export const useUserChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["reelato-chatMessages", chatId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IMessage[] }>(
        `/chats/user/${chatId}/messages`
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
      const res = await apiClient.get<{ data: IChatWithFoodPartner[] }>(
        "/chats/user/all"
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// food partner
export const useFoodPartnerChats = () => {
  return useQuery({
    queryKey: ["reelato-userChats"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IChatWithUser[] }>(
        "/chats/food-partner/all"
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFoodPartnerChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ["reelato-chatMessages", chatId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IMessage[] }>(
        `/chats/food-partner/${chatId}/messages`
      );
      return res.data;
    },
    enabled: !!chatId,
    refetchOnWindowFocus: false,
  });
};
