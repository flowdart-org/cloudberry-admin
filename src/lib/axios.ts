import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "./env";
import { ApiResponse } from "@/types/common";
import { useAuthStore } from "@/store/authStore";
import { AdminApi, AuthApi, CategoryApi, Configuration, MediaApi, ProductApi, UserApi } from "@/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

export const config = new Configuration({
  basePath: ENV.API_BASE_URL,
  baseOptions: {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  }
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
          const isRefreshed = await useAuthStore.getState().refreshToken();
          isRefreshing = false;

          if (isRefreshed) {
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
  }
);


export async function request<T>(
  callback: any,
  ...props: any[]
): Promise<ApiResponse<T>> {
  try {
    const response = await callback(...props);
    return response.data;
  } catch (err: any) {
    return {
      message: err?.response?.data?.message || err.message,
      success: false,
    } as ApiResponse<T>;
  }
}




export const authApi = new AuthApi(config, ENV.API_BASE_URL, api)
export const adminApi = new AdminApi(config, ENV.API_BASE_URL, api)
export const userApi = new UserApi(config, ENV.API_BASE_URL, api)
export const categoryApi = new CategoryApi(config, ENV.API_BASE_URL, api)
export const productApi = new ProductApi(config, ENV.API_BASE_URL, api)
export const mediaApi = new MediaApi(config, ENV.API_BASE_URL, api)
