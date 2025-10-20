/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import type { IFood, IFoodWithFoodPartner, ILike, ISave } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toastErrorMessage, toastSuccessMessage } from "@/lib/utils";

export const useFoodList = () => {
  return useQuery({
    queryKey: ["reelato-foodList"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFood[] }>("/foods");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};

export const useLikeVideo = (foodPartnerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      return await apiClient.post<{ data: ILike }>(`/foods/${foodId}/like`);
    },
    onMutate: async (foodId: string) => {
      const partnerKey = ["reelato-foodList", foodPartnerId];
      const globalKey = ["reelato-foodList"];

      // cancel queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: partnerKey }),
        queryClient.cancelQueries({ queryKey: globalKey }),
      ]);

      // snapshot data
      const prevPartnerData = queryClient.getQueryData<IFood[]>(partnerKey);
      const prevGlobalData = queryClient.getQueryData<IFood[]>(globalKey);

      // optimistically update
      const updater = (foods: IFood[] | undefined) =>
        foods
          ? foods.map((food) =>
              food._id === foodId
                ? {
                    ...food,
                    isLiked: !food.isLiked,
                    likesCount: food.isLiked
                      ? food.likesCount - 1
                      : food.likesCount + 1,
                  }
                : food
            )
          : foods;

      if (prevPartnerData) {
        queryClient.setQueryData(partnerKey, updater(prevPartnerData));
      }
      if (prevGlobalData) {
        queryClient.setQueryData(globalKey, updater(prevGlobalData));
      }

      return { prevGlobalData, prevPartnerData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reelato-liked-foods"] });
    },
    onError: (error: any, _foodId, context: any) => {
      console.log("error liking the food video", error);
      const partnerKey = ["reelato-foodList", foodPartnerId];
      const globalKey = ["reelato-foodList"];

      if (context?.prevPartnerData) {
        queryClient.setQueryData(partnerKey, context.prevPartnerData);
      }
      if (context?.prevGlobalData) {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
      toastErrorMessage(error.response.data.message);
    },
  });
};

export const useSaveVideo = (foodPartnerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      const res = await apiClient.post<{ message: string; data: ISave }>(
        `/foods/${foodId}/save`
      );
      return res;
    },
    onMutate: async (foodId: string) => {
      const partnerKey = ["reelato-foodList", foodPartnerId];
      const globalKey = ["reelato-foodList"];

      // cancel queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: partnerKey }),
        queryClient.cancelQueries({ queryKey: globalKey }),
      ]);

      // snapshot data
      const prevPartnerData = queryClient.getQueryData<IFood[]>(partnerKey);
      const prevGlobalData = queryClient.getQueryData<IFood[]>(globalKey);

      // optimistically update
      const updater = (foods: IFood[] | undefined) =>
        foods
          ? foods.map((food) =>
              food._id === foodId
                ? {
                    ...food,
                    isSaved: !food.isSaved,
                    savesCount: food.isSaved
                      ? food.savesCount - 1
                      : food.savesCount + 1,
                  }
                : food
            )
          : foods;

      if (prevPartnerData) {
        queryClient.setQueryData(partnerKey, updater(prevPartnerData));
      }
      if (prevGlobalData) {
        queryClient.setQueryData(globalKey, updater(prevGlobalData));
      }

      return { prevGlobalData, prevPartnerData };
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["reelato-saved-foods"] });
      toastSuccessMessage(res.message);
    },
    onError: (error: any, _foodId, context: any) => {
      const partnerKey = ["reelato-foodList", foodPartnerId];
      const globalKey = ["reelato-foodList"];

      if (context?.prevPartnerData) {
        queryClient.setQueryData(partnerKey, context.prevPartnerData);
      }
      if (context?.prevGlobalData) {
        queryClient.setQueryData(globalKey, context.prevGlobalData);
      }
      toastErrorMessage(error.response.data.message);
    },
  });
};

export const useFoodPartnerFoodsList = (foodPartnerId: string) => {
  return useQuery({
    queryKey: ["reelato-foodList", foodPartnerId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: IFoodWithFoodPartner[] }>(
        "/foods/food-partner/" + foodPartnerId
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!foodPartnerId,
  });
};

export const useWatchFood = () => {
  return useMutation({
    mutationFn: async (foodId: string) => {
      await apiClient.post(`/foods/${foodId}/watch`);
    },
    onError: (error: any) => {
      console.log("error saving the food video", error);
      toastErrorMessage(error.response.data.message);
    },
  });
};

export const useCreateFood = (options?: any) => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return await apiClient.post<{ data: IFood }>("/foods", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: options?.onUploadProgress,
      });
    },
    onSuccess: (res: any) => {
      console.log(res);
      options?.onSuccess();
      // toastSuccessMessage(res.message);
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};
