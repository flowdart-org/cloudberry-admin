
import { adminApi, userApi } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { AdminUser, ExtendedUser, User } from "@/types/user.types";
import { UserApi } from "../client/api";


export const USER_SERVICES = {
  me: async (): Promise<ApiResponse<AdminUser>> => {
    const response = await adminApi.adminControllerGetAdmin();
    return response.data;
  },

  fetchUsers: async (page?: number, limit?: number, search?: string, status?: 'active' | 'suspended'): Promise<ApiResponse<User[]>> => {
    const response = await userApi.userControllerFind( page, limit, search, status);
    return response.data
  },

  fetchUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await userApi.userControllerFindOne(id);
    return response.data
  }
}