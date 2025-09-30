import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiClient = {
  get: async <T>(url: string, config = {}) => {
    const { data } = await api.get<T>(url, config);
    return data;
  },

  post: async <T>(url: string, body?: unknown, config = {}) => {
    const { data } = await api.post<T>(url, body, config);
    return data;
  },

  put: async <T>(url: string, body?: unknown, config = {}) => {
    const { data } = await api.put<T>(url, body, config);
    return data;
  },

  delete: async <T>(url: string, config = {}) => {
    const { data } = await api.delete<T>(url, config);
    return data;
  },
};

// Global error interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) toast.error(error.message);
    return Promise.reject(error);
  }
);
