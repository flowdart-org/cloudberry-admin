import { USER_SERVICES } from "@/api/user/user.service";
import { ErrorResponse } from "@/api/utils";
import { ApiResponse } from "@/types/common";
import { AdminUser } from "@/types/user";

export const me = async (): Promise<ApiResponse<AdminUser | void>> => {
  try {
    const response = await USER_SERVICES.me();
    return response;
  } catch (error) {
    return ErrorResponse(error)
  }
};