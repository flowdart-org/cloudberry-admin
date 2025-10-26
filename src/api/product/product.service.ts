import { request } from "@/lib/axios";
import { Product } from "@/types/product.types";
import { CreateProductDTO, updateProductDTO } from "./product.dto";
import { ApiResponse } from "@/types/common";

const BASE_URL = '/product';

export const PRODUCT_SERVICES = {
  addProduct: async (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
    return await request<Product>("post", `${BASE_URL}`, data);
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return await request<Product>("get", `${BASE_URL}/${id}`);
  },

  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    return await request<Product[]>("get", `${BASE_URL}`);
  },

  updateProducts: async (id: string, data: updateProductDTO ): Promise<ApiResponse<Product>> => {
    return await request<Product>("patch", `${BASE_URL}/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return await request<void>("delete", `${BASE_URL}/${id}`);
  },

};
