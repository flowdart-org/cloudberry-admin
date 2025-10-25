import { request } from "@/lib/axios";
import { AUTH } from "./auth.constants";
import { ApiResponse } from "@/types/common";
import { LoginDTO } from "./auth.dto";


const BASE_URL = '/auth';

export const AUTH_SERVICES = {
  login: async (payload: LoginDTO): Promise<ApiResponse<void>> => {
    return await request<void>("post", `${BASE_URL}/admin/${AUTH.LOGIN}`, payload);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return await request<void>("post", `${BASE_URL}/${AUTH.LOGOUT}`);
  },

  refreshToken: async (): Promise<ApiResponse<void>> => {
    return await request<void>("post", `${BASE_URL}/${AUTH.REFRESH_TOKEN}`);
  },

};
 