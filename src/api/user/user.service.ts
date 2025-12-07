
import { adminApi, request, userApi } from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/common";
import { AdminUser, ExtendedUser, User } from "@/types/user.types";


export const USER_SERVICES = {
  me: async (): Promise<ApiResponse<AdminUser>> => {
    return await request(adminApi.adminControllerGetAdmin.bind(adminApi)) as ApiResponse<AdminUser>;
  },

  fetchUsers: async (page?: number, limit?: number, search?: string, status?: 'active' | 'suspended'): Promise<PaginatedResponse<ExtendedUser[]>> => {
    return await request(userApi.userControllerFind.bind(userApi), page, limit, search, status) as PaginatedResponse<ExtendedUser[]>;
  },

  fetchUser: async (id: string): Promise<ExtendedUser> => {
    const response = await  request(userApi.userControllerFindOne.bind(userApi), id) as ApiResponse<ExtendedUser>;
    return response.data
  }
}