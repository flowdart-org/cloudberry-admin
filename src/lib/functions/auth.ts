import { AUTH_SERVICES } from "@/api/auth/auth.service";
import { ErrorResponse } from "@/api/utils";
import { ApiResponse } from "@/types/common";

export const loginApi = async (email: string, password: string): Promise<ApiResponse<void>> => {
  try {
    console.log("Login admin:", email, password);
    const response = await AUTH_SERVICES.login({ email, password });
    return response;
  } catch (error) {
    return ErrorResponse(error)
  }
};

export const logoutApi = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await AUTH_SERVICES.logout();
    return response;
  } catch (error) {
    return ErrorResponse(error)
  }
};

export const refreshTokenApi = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await AUTH_SERVICES.refreshToken();
    return response;
  } catch (error) {
    return ErrorResponse(error)
  }
};



