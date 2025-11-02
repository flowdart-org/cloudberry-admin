
import { adminApi, userApi } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { AdminUser, ExtendedUser, User } from "@/types/user.types";
import { UserApi } from "../api";


export const USER_SERVICES = {
  me: async (): Promise<ApiResponse<AdminUser>> => {
    const response = await adminApi.adminControllerGetAdmin();
    return response.data;
  },

  fetchUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await userApi.userControllerFindAll();
    return response.data
  },

  fetchUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await userApi.userControllerFindOne(id);
    return response.data
  }
}