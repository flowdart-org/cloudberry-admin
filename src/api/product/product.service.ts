import { productApi, request } from "@/lib/axios";
import { Product } from "@/types/product.types";
import { CreateProductDTO, updateProductDTO } from "./product.dto";
import { ApiResponse } from "@/types/common";

const BASE_URL = "/product";

// export const PRODUCT_SERVICES = {
//   addProduct: async (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
//     return await request<Product>("post", `${BASE_URL}`, data);
//   },

//   getProduct: async (id: string): Promise<ApiResponse<Product>> => {
//     return await request<Product>("get", `${BASE_URL}/${id}`);
//   },

//   getProducts: async (): Promise<ApiResponse<Product[]>> => {
//     return await request<Product[]>("get", `${BASE_URL}`);
//   },

//   updateProducts: async (id: string, data: updateProductDTO ): Promise<ApiResponse<Product>> => {
//     return await request<Product>("patch", `${BASE_URL}/${id}`, data);
//   },

//   deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
//     return await request<void>("delete", `${BASE_URL}/${id}`);
//   },

// };

export const PRODUCT_SERVICES = {
  addProduct: async (data: CreateProductDTO): Promise<ApiResponse<Product>> => {
    //TODO add discountPercentage 
    const response: any = await productApi.productControllerCreate(data);
    return response.data;
  },

  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    const response: any = await productApi.productControllerFindOne(id);
    return response.data;
  },

  getProducts: async (data: any): Promise<ApiResponse<Product[]>> => {
    const response: any = await productApi.productControllerFindAll();
    return response.data;
  },

  updateProducts: async (
    id: string,
    data: updateProductDTO
  ): Promise<ApiResponse<Product>> => {
    //TODO add discountPercentage
    const response: any = await productApi.productControllerUpdate(id, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response: any = await productApi.productControllerRemove(id);
    return response.data;
  },
};
