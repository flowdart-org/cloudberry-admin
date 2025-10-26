import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "./env";
import { ApiResponse } from "@/types/common";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const onTokenRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const status = await useAuthStore.getState().refreshToken()
          isRefreshing = false;

          if (status) {
            onTokenRefreshed();
            return api(originalRequest); 
          }
        } else {
          return new Promise((resolve) => {
            addRefreshSubscriber(() => {
              resolve(api(originalRequest));
            });
          });
        }
      } catch (refreshError) {
        await useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);


export async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await api.request<ApiResponse<T>>({
      url,
      method,
      data,
      ...config,
    });
    console.log('me response, return data:',response.data)
    return response.data;
  } catch (err: any) {
    return {
      message: err?.response?.data?.message || err.message,
      success: false,
    };
  }
}
