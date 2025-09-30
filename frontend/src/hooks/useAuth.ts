/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api";
import type {
  FoodPartnerLoginFormData,
  FoodPartnerRegisterFormData,
  UpdateUserAccountFormData,
  UserLoginFormData,
  UserRegisterFormData,
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserAuthStore } from "./useUserAuthStore";
import { useFoodParnterAuthStore } from "./useFoodPartnerAuthStore";

function toastErrorMessage(msg: string) {
  toast.error(msg || "Something went wrong. Please try again.");
  console.log("error occured", msg);
}

function toastSuccessMessage(msg: string) {
  toast.success(msg || "Sucess");
  console.log("error occured", msg);
}

export const useRegisterUser = () => {
  const navigate = useNavigate();
  const setUser = useUserAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (input: UserRegisterFormData) => {
      return await apiClient.post("/auth/users/register", input);
    },
    onSuccess: (res: any) => {
      setUser(res.data);
      toastSuccessMessage("Your account has been created successfully!");
      navigate("/");
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const setUser = useUserAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (input: UserLoginFormData) => {
      return await apiClient.post("/auth/users/login", input);
    },
    onSuccess: (res: any) => {
      setUser(res.data);
      navigate("/");
      toastSuccessMessage("Logged in succesfully!");
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useUpdateUser = () => {
  const setUser = useUserAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (input: UpdateUserAccountFormData) => {
      return await apiClient.put("/auth/users/me", input);
    },
    onSuccess: (res: any) => {
      setUser(res.data);
      toastSuccessMessage("Account details updated succesfully!");
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useDeleteUser = () => {
  const { logout } = useUserAuthStore();

  return useMutation({
    mutationFn: async () => {
      return await apiClient.delete("/auth/users/me");
    },
    onSuccess: (res: any) => {
      logout();
      toastSuccessMessage(res.message);
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};

export const useRegisterFoodPartner = () => {
  const navigate = useNavigate();
  const setFoodPartner = useFoodParnterAuthStore(
    (state) => state.setFoodPartner
  );

  return useMutation({
    mutationFn: async (input: FoodPartnerRegisterFormData) => {
      return await apiClient.post("/auth/food-partners/register", input);
    },
    onSuccess: (res: any) => {
      setFoodPartner(res.data);
      toastSuccessMessage("Your account has been created successfully!");
      navigate("/");
    },
    onError: (error: any) =>
      toastErrorMessage(error.response.data.message || error.message),
  });
};

export const useLoginFoodPartner = () => {
  const navigate = useNavigate();
  const setFoodPartner = useFoodParnterAuthStore(
    (state) => state.setFoodPartner
  );

  return useMutation({
    mutationFn: async (input: FoodPartnerLoginFormData) => {
      return await apiClient.post("/auth/food-partners/login", input);
    },
    onSuccess: (res: any) => {
      setFoodPartner(res.data);
      toastSuccessMessage("Logged in succesfully!");
      navigate("/");
    },
    onError: (error: any) => toastErrorMessage(error.response.data.message),
  });
};
