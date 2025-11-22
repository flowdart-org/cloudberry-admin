import { categoryApi, request } from "@/lib/axios";
import { CreateCategoryDTO, updateCategoryDTO } from "./category.dto";
import { Category } from "@/types/category.types";
import { ApiResponse } from "@/types/common";

export const CATEGORY_SERVICES = {
  addCategory: async (
    data: CreateCategoryDTO
  ): Promise<ApiResponse<Category>> => {
     return await request(categoryApi.categoryControllerCreate.bind(categoryApi), data);
  },

  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    return await request(categoryApi.categoryControllerFindOne.bind(categoryApi), id);
  },

  getCategories: async (page: number, limit?: number, search?: string, status?: 'active' | 'inactive'): Promise<ApiResponse<Category[]>> => {
    const response = await categoryApi.categoryControllerFindAll( page, limit, search, status);
    return response.data
  }, 

  // getCategories: async (): Promise<ApiResponse<Category[]>> => {
  //   const response = await handleApi(categoryApi.categoryControllerFindOne, 1, 12, 'shi', 'active')
  //   console.log(response, 'from test cet')
  // }, 
  updateCategory: async (
    id: string,
    data: updateCategoryDTO
  ): Promise<ApiResponse<Category>> => {
    return await request(categoryApi.categoryControllerUpdate.bind(categoryApi),id, data);
  },
};
