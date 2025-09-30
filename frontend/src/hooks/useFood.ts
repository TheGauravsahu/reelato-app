/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import type { IFood, ILike, ISave } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toastErrorMessage } from "@/lib/utils";

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

export const useLikeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      return await apiClient.post<{ data: ILike }>(`/foods/${foodId}/like`);
    },
    onMutate: async (foodId: string) => {
      // cancel queries
      await queryClient.cancelQueries({ queryKey: ["reelato-foodList"] });

      // snapshot data
      const prevData = queryClient.getQueryData<IFood[]>(["reelato-foodList"]);

      // optimistically update
      if (prevData) {
        queryClient.setQueryData<IFood[]>(
          ["reelato-foodList"],
          prevData.map((food) =>
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
        );
      }
      return { prevData };
    },
    onError: (error: any, _foodId, context: any) => {
      console.log("error liking the food video", error);
      if (context?.prevData) {
        queryClient.setQueryData(["reelato-foodList"], context.prevData);
      }
      toastErrorMessage(error.response.data.message);
    },
  });
};

export const useSaveVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId: string) => {
      const res = await apiClient.post<{ data: ISave }>(
        `/foods/${foodId}/save`
      );
      return res.data;
    },
    onMutate: async (foodId: string) => {
      await queryClient.cancelQueries({ queryKey: ["reelato-foodList"] });
      const prevData = queryClient.getQueryData<IFood[]>(["reelato-foodList"]);
      if (prevData) {
        queryClient.setQueryData(
          ["reelato-foodList"],
          prevData.map((food) =>
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
        );
      }
      return {
        prevData,
      };
    },
    onError: (error: any, _foodId, context: any) => {
      console.log("error liking the food video", error);
      if (context?.prevData) {
        queryClient.setQueryData(["reelato-foodList"], context.prevData);
      }
      toastErrorMessage(error.response.data.message);
    },
  });
};
