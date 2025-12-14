import { categoryApi, request } from "@/lib/axios";
import { CreateCategoryDTO, updateCategoryDTO } from "./category.dto";
import { Category } from "@/types/category.types";
import { ApiResponse, PaginatedResponse } from "@/types/common";

export const CATEGORY_SERVICES = {
  addCategory: async (
    data: CreateCategoryDTO
  ): Promise<ApiResponse<Category>> => {
     return await request(categoryApi.categoryControllerCreate.bind(categoryApi), data);
  },

  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    return await request(categoryApi.categoryControllerFindOne.bind(categoryApi), id);
  },

  getCategories: async (page?: number, limit?: number, search?: string, status?: 'active' | 'inactive'): Promise<PaginatedResponse<Category[]>> => {
    return await request(categoryApi.categoryControllerFindAll.bind(categoryApi), 1, 1000, search, status) as PaginatedResponse<Category[]>;
  }, 

  updateCategory: async (
    id: string,
    data: updateCategoryDTO
  ): Promise<ApiResponse<Category>> => {
    return await request(categoryApi.categoryControllerUpdate.bind(categoryApi),id, data);
  },
};
