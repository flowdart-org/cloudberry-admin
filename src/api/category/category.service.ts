
import { categoryApi, request } from "@/lib/axios";
import { CreateCategoryDTO, updateCategoryDTO } from "./category.dto";
import { Category } from "@/types/category.types";
import { ApiResponse } from "@/types/common";

const BASE_URL = '/category';

// export const CATEGORY_SERVICES = {
//   addCategory: async (data: CreateCategoryDTO): Promise<ApiResponse<Category>> => {
//     return await request<Category>("post", `${BASE_URL}`, data);
//   },

//   getCategory: async (id: string): Promise<ApiResponse<Category>> => {
//     return await request<Category>("get", `${BASE_URL}/${id}`);
//   },

//   getCategories: async (): Promise<ApiResponse<Category[]>> => {
//     return await request<Category[]>("get", `${BASE_URL}`);
//   },

//   updateCategories: async (id: string, data: updateCategoryDTO ): Promise<ApiResponse<Category>> => {
//     return await request<Category>("patch", `${BASE_URL}/${id}`, data);
//   },

//   deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
//     return await request<void>("delete", `${BASE_URL}/${id}`);
//   },

// };


export const CATEGORY_SERVICES = {
  addCategory: async (data: CreateCategoryDTO): Promise<ApiResponse<Category>> => {
    const response: any = await categoryApi.categoryControllerCreate(data);
        return response.data;
  },

  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    const response: any = await categoryApi.categoryControllerFindOne(id);
        return response.data;
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response: any = await categoryApi.categoryControllerFindAll();
        return response.data;
  },

  updateCategories: async (id: string, data: updateCategoryDTO ): Promise<ApiResponse<Category>> => {
    const response: any = await categoryApi.categoryControllerUpdate(id, data);
        return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response: any = await categoryApi.categoryControllerRemove(id);
        return response.data;
  },

};
