import axios, { AxiosRequestConfig } from "axios";
import { ENV } from "./env";
import { ApiResponse } from "@/types/common";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

export async function request<T>(
  method: "get" | "post" | "put" | "delete",
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
