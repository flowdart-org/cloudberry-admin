import { authApi, request } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { LoginDTO } from "./auth.dto";

export const AUTH_SERVICES = {
  login: async (payload: LoginDTO): Promise<ApiResponse<void>> => {
    return await request(
      authApi.authControllerAdminLogin.bind(authApi),
      payload
    );
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return await request(authApi.authControllerLogout.bind(authApi));
  },

  refreshToken: async (): Promise<ApiResponse<void>> => {
    return await request(authApi.authControllerRefreshToken.bind(authApi));
  },
};
