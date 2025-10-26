
import { request } from "@/lib/axios";
import { USER } from "./user.constants";
import { AdminUser } from "@/types/user.types";
import { ApiResponse } from "@/types/common";

const BASE_URL = '/admin';

export const USER_SERVICES = {
  me: async (): Promise<ApiResponse<AdminUser>> => {
    return await request<AdminUser>("get", `${BASE_URL}/${USER.ME}`);
  },

};
