import { authApi, request } from "@/lib/axios";
import { AUTH } from "./auth.constants";
import { ApiResponse } from "@/types/common";
import { LoginDTO } from "./auth.dto";


const BASE_URL = '/auth';

// export const AUTH_SERVICES = {
//   login: async (payload: LoginDTO): Promise<ApiResponse<void>> => {
//     return await request<void>("post", `${BASE_URL}/admin/${AUTH.LOGIN}`, payload);
//   },

//   logout: async (): Promise<ApiResponse<void>> => {
//     return await request<void>("post", `${BASE_URL}/${AUTH.LOGOUT}`);
//   },

//   refreshToken: async (): Promise<ApiResponse<void>> => {
//     return await request<void>("post", `${BASE_URL}/${AUTH.REFRESH_TOKEN}`);
//   },

// };

export const AUTH_SERVICES = {
  login: async (payload: LoginDTO): Promise<ApiResponse<void>> => {
    const response: any = await authApi.authControllerAdminLogin(payload);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response: any = await authApi.authControllerLogout();
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<void>> => {
    const response: any = await authApi.authControllerRefreshToken();
    return response.data;
  },
};


 